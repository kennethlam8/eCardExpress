import express, { Request, Response, NextFunction } from 'express'
import Formidable from 'formidable/Formidable'
import { Server } from 'socket.io'
import { HttpError } from '../utils/error'
import { CardService } from '../services/cardServices'
import { logger } from '../utils/logger'
import { getUserByUserName, messageStore, users } from '../io'

export class CardController {
  router = express.Router()

  constructor(
    private cardService: CardService,
    private io: Server,
    private form: Formidable,
  ) { }


  getCardById = async (req: Request, res: Response) => {
    // let id = parseParamsAsInt(req, 'id')
    // return this.cardService.getCardById(id)

    try {
      let card_id = req.params.id; //parseInt(req.params.id)
      let user_id = req.session.user?.user_id //|| "admin#1" //.id || 1
      //let id = parseParamsAsInt(req, 'cardId')
      console.log(`card id: ${card_id}`)
      let card = await this.cardService.getCardById(card_id, user_id) //id should be card_id

      console.log(`get card ${card_id} result: `, card)
      res.json({ data: card, });
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status).json({ error: error.message })
      } else {
        res.status(500).json({ error: "System error" })
      }
    }
  }

  getAllCard = async (req: Request, res: Response) => {
    try {
      let user_id = req.session.user?.user_id //|| "admin#1" //.id || 1
      console.log("get all result1: ", user_id)
      let cards = await this.cardService.getAllCards(user_id)

      console.log("get all result: ", cards)
      res.json({ data: cards, });
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status).json({ error: error.message })
      } else {
        res.status(500).json({ error: "System error" })
      }
    }
  }

  getMyCard = async (req: Request, res: Response) => {
    try {
      let user_id = req.session.user?.user_id //|| "admin#1" //.id || 1
      let { index, keyword, searchBy } = req.body
      console.log("My card body: ", [index, keyword, searchBy])
      console.log("get my result1: ", user_id)
      let cards = await this.cardService.getMyCards(user_id, index, keyword, searchBy)

      console.log("get my result: ", cards)
      res.json({ data: cards, });
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status).json({ error: error.message })
      } else {
        res.status(500).json({ error: "System error" })
      }
    }
  }

  getPublicCard = async (req: Request, res: Response) => {
    try {
      let { index, keyword, searchBy } = req.body
      console.log("public card body: ", [index, keyword, searchBy])
      if (!keyword) {
        res.json({ data: [], });
        return
      }
      if (!index) index = -1;
      if (!searchBy) searchBy = "first_name"
      //let user_id = req.session.user?.user_id || "admin#1" //.id || 1
      console.log("get public result1 from index - ", index, " & ", keyword)
      let cards = await this.cardService.getPublicCards(index, keyword, searchBy)

      console.log("get all public result: ", cards)
      res.json({ data: cards, });
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status).json({ error: error.message })
      } else {
        res.status(500).json({ error: "System error" })
      }
    }
  }

  removeCardholder = async (req: Request, res: Response) => {
    try {
      
      let { card_id } = req.body
      let user_id = req.session.user?.user_id

      console.log("Remove cardholder request: ", card_id, " , user_id: ",user_id)
      await this.cardService.removeCardholder(user_id, card_id)

      res.json({ data: "Remove card request success" });
    } catch (error) {
      logger.error('System error - ' + error)
      if (error instanceof HttpError) {
        res.status(error.status).json({ error: error.message })
      } else {
        res.status(500).json({ error: "System error" })
      }
    }
  }

  sendCardRequest = async (req: Request, res: Response) => {
    try {
      let card_id = req.params.id; //user_code
      let user_id = req.session.user?.user_id //|| "admin#1" //.id || 1
      console.log("check user session: ", req.session.user.user_id)

      if (!user_id) {
        res.status(500).json({ error: "Session no existed" })
        return
      }
      let card = await this.cardService.getCardInfo(card_id)

      if (!card[0]) {
        res.status(404).json({
          message: 'Card not found'
        });
        return
      }

      console.log(`search card ${card_id} service result:`, card)

      if (card[0].user_id == user_id) {
        logger.warn('User sent request to himself')
        res.status(404).json({
          message: 'Card requested invalid'
        });
        return
      }

      let sendCardRequest = await this.cardService.sendCardRequest(card_id, user_id, card[0].user_id)
      console.log("Service return create card request result: ", sendCardRequest)
      console.log("socket user list: ", users)
      if (sendCardRequest.length < 1) {
        logger.info('Card request already sent')
      } else {
        // let user = await this.cardService.getSocketUsername(user_id)
        // console.log("Service return search card user result: ", user)

        let user_info = getUserByUserName(card[0].user_id) //user.user_code
        console.log("Socket user check: ", card[0].user_info)

        let content = `New card request to you from ${req.session.user?.first_name}` //\n
        let notification = {
          to: card[0].user_id, //to be extracted by getUserByUserName when connected
          from: req.session.user.user_id,
          content: content,
          cardId: card_id,
          //first_comment_id: to scroll down the page
        };
        messageStore.saveNotification(notification);
        let testFindResult = messageStore.findNotificationsForUser(card[0].user_id); //user.user_code
        console.log("testFindResult = ", testFindResult);
        let combinedTestFindResult = messageStore.findNotificationsForUserInGroup(card[0].user_id, req.session.user.user_id);
        console.log("combinedTestFindResult = ", combinedTestFindResult);

        if (user_info) {
          this.io.to(user_info.id).emit('newCardRequest',
            messageStore.findNotificationsForUserInGroup(card[0].user_id, req.session.user.user_id))
          logger.info(`Emit message to ${user_id} - ${notification}`)
        }
      }
      res.json({ data: card });
    } catch (error) {
      logger.error('System error - ' + error)
      if (error instanceof HttpError) {
        res.status(error.status).json({ error: error.message })
      } else {
        res.status(500).json({ error: "System error" })
      }
    }
  }

  sendCardExchangeRequest = async (req: Request, res: Response) => {
    try {
      let user_id = req.session.user?.user_id
      console.log("check user session: ", req.session.user)

      let { card_id, allow_ex } = req.body
      console.log("check card exchange allow body: ", allow_ex)

      let sendCardExchangeRequest = await this.cardService.sendCardExchangeRequest(card_id, user_id, allow_ex)
      console.log("Service return update card exchange result: ", sendCardExchangeRequest)

      res.json({ data: "Card Exchange record updated" });
    } catch (error) {
      logger.error('System error - ' + error)
      if (error instanceof HttpError) {
        res.status(error.status).json({ error: error.message })
      } else {
        res.status(500).json({ error: "System error" })
      }
    }
  }

  getCardRequested = async (req: Request, res: Response) => {
    try {
      let user_id = req.session.user?.user_id //|| "admin#1" //.id || 1
      let card = await this.cardService.getCardRequested(user_id)

      console.log(`search card request result:`, card)

      res.json({ data: card });
    } catch (error) {
      logger.error('System error - ' + error)
      if (error instanceof HttpError) {
        res.status(error.status).json({ error: error.message })
      } else {
        res.status(500).json({ error: "System error" })
      }
    }
  }

  getCardRequestedCount = async (req: Request, res: Response) => {
    try {
      let user_id = req.session.user?.user_id //|| "admin#1" //.id || 1
      let card = await this.cardService.getCardRequestedCount(user_id)

      console.log(`count card request result:`, card)

      res.json({ data: card });
    } catch (error) {
      logger.error('System error - ' + error)
      if (error instanceof HttpError) {
        res.status(error.status).json({ error: error.message })
      } else {
        res.status(500).json({ error: "System error" })
      }
    }
  }

  setNewCardholder = async (req: Request, res: Response) => {
    try {
      console.log("Set new cardholder request body: ", req.body);

      let { user_id, card_id, allow_ex } = req.body

      await this.cardService.setNewCardholder(user_id, card_id)

      let returnUser_Id = req.session.user?.user_id //|| "admin#1" //.id || 1

      if (allow_ex) {
        await this.cardService.setReturnNewCardholder(user_id, returnUser_Id)
      }
      /* if (result) {
        logger.error("set new cardholder fail - " + result)
        res.status(406).json({
          message: 'Error - ' + result
        })
        return
      } */

      await this.cardService.removeCardRequest(user_id, card_id)

      messageStore.removeNotification(user_id, card_id) //requestor_id
      logger.info(`remove message from ${user_id} - ${card_id}}`)

      console.log(`Set card holder success`)
      res.json({ data: "Add card holder success" });
    } catch (error) {
      logger.error('System error - ' + error)
      if (error instanceof HttpError) {
        res.status(error.status).json({ error: error.message })
      } else {
        res.status(500).json({ error: "System error" })
      }
    }
  }

  removeCardRequest = async (req: Request, res: Response) => {
    try {
      console.log("Remove card request body: ", req.body);
      //should use user_code instead of user_id
      let { user_id, card_id } = req.body

      await this.cardService.removeCardRequest(user_id, card_id)
      //console.log("Socket user check: ", requestor_info)

      messageStore.removeNotification(user_id, card_id);
      let testFindResult = messageStore.findNotificationsForUser(user_id);
      console.log("testFindResult = ", testFindResult);

      console.log(`Remove card request success`)
      res.json({ data: "Remove card request success" });
    } catch (error) {
      logger.error('System error - ' + error)
      if (error instanceof HttpError) {
        res.status(error.status).json({ error: error.message })
      } else {
        res.status(500).json({ error: "System error" })
      }
    }
  }
}
