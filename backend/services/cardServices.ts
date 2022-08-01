import { Knex } from 'knex'
import { HttpError } from '../utils/error'
import { NewCard } from '../container/card'
import { logger } from '../utils/logger';
//import { RedisClient } from './db'
/* 
const knexConfig = require('./knexfile'); 
const knex = Knex(knexConfig[process.env.NODE_ENV || "development"]);
 */
export class CardService {
    constructor(private knex: Knex) { } //, private redis: RedisClient

    async getAllCards(user_id: string): Promise<any> {
        //console.log("getting all cards for user ",id)
        let result = await this.knex
            //.select('*')
            .select("user_cardholders.card_stored", "user_cardholders.created_at", "user_cards.card_image", "user_cards.first_name", "user_cards.last_name", "user_cards.title", "user_cards.company_name", "user_cards.address", "user_cards.default_image_index", "user_cards.card_image", "user_cards.email", "user_cards.website", "user_cards.image_format", "user_cards.image_bg", "user_cards.profile_pic", "events.start_date", "events.start_time", "events.event_address", "telephones.*")
            .from("user_cardholders")
            .leftJoin('events', 'user_cardholders.event_code', 'events.invitation_code')
            .innerJoin('telephones', 'user_cardholders.card_stored', '=', 'telephones.card_id')
            .join('user_cards', 'user_cardholders.card_stored', '=', 'user_cards.card_id')
            .where("user_cardholders.user_id", user_id)
            .orderBy("user_cardholders.created_at"); //, 'desc'

        // let result2 = await this.knex.select("telephones.*").from("user_cardholders").join('telephones', 'user_cardholders.card_stored', '=', 'telephones.card_id') .where("user_cardholders.user_id", user_id).orderBy("user_cardholders.created_at");
        //let card = result.rows[0]
        console.log("get all service result: ", result)
        if (!result) {
            throw new HttpError(404, 'Card not found')
        }

        return result
    }

    async getMyCards(user_id: string, index: number, keyword: string, searchBy: string): Promise<any> {
        //console.log("getting all cards for user ",id)
        let result: any[] = []
        if (keyword == "") {
            result = await this.knex
                //.select('*')
                .select("user_cardholders.card_stored", "user_cardholders.created_at","user_cardholders.has_acct",  "user_cards.card_image", "user_cards.first_name", "user_cards.last_name", "user_cards.title", "user_cards.company_name", "user_cards.address", "user_cards.default_image_index", "user_cards.card_image", "user_cards.email", "user_cards.website", "user_cards.image_format", "user_cards.image_bg", "user_cards.profile_pic", "user_cards.card_id", "telephones.*")
                .from("user_cardholders")
                .innerJoin('user_cards', 'user_cardholders.card_stored', '=', 'user_cards.card_id')
                .leftJoin('telephones', 'user_cardholders.card_stored', '=', 'telephones.card_id')
                .where("user_cardholders.user_id", user_id)
                .orderBy("user_cardholders.created_at"); //, 'desc'
        } else {
            result = await this.knex
                //.select('*')
                .select("user_cardholders.card_stored", "user_cardholders.created_at","user_cardholders.has_acct", "user_cards.card_image", "user_cards.first_name", "user_cards.last_name", "user_cards.title", "user_cards.company_name", "user_cards.address", "user_cards.default_image_index", "user_cards.card_image", "user_cards.email", "user_cards.website", "user_cards.image_format", "user_cards.image_bg", "user_cards.profile_pic", "user_cards.card_id", "telephones.*")
                .from("user_cardholders")
                .innerJoin('user_cards', 'user_cardholders.card_stored', '=', 'user_cards.card_id')
                .leftJoin('telephones', 'user_cardholders.card_stored', '=', 'telephones.card_id')
                .where("user_cardholders.user_id", user_id)
                .andWhere(`user_cards.${searchBy}`, '~', `^${keyword}`)
                //.limit(20)
                .orderBy("user_cardholders.created_at"); //, 'desc'
        }
        console.log("get my card service result: ", result)
        if (!result) {
            throw new HttpError(404, 'Card not found')
        }

        result = result.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.card_id === value.card_id
            ))
        )

        return result
    }

    async getPublicCards(index: number, keyword: string, searchBy: string): Promise<any> {
        //console.log("getting all cards for user ",id)
        let result = await this.knex
            //.select('*')
            //should select card_id
            .select("user_cards.card_id", "user_cards.card_image", "user_cards.first_name", "user_cards.last_name", "user_cards.title", "user_cards.company_name", "user_cards.address", "user_cards.default_image_index", "user_cards.card_image", "user_cards.email", "user_cards.website", "user_cards.image_format", "user_cards.image_bg", "user_cards.profile_pic", "telephones.*")
            .from("user_cards")
            .leftJoin('telephones', 'user_cards.card_id', '=', 'telephones.card_id')
            .where("user_cards.id", '>', index)
            .andWhere(`user_cards.${searchBy}`, '~', `^${keyword}`)
            .limit(20)
            .orderBy("user_cards.created_at");

        console.log("get all service result: ", result)
        if (!result) {
            throw new HttpError(404, 'Card not found')
        }
        //filter duplicate user due to multiple cards owned
        result = result.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.card_id === value.card_id
            ))
        )
        console.log("filtered result: ", result)

        return result
    }

    async getCardById(card_id: string, user_id: string): Promise<any> {

        let cardInfo = {}

        cardInfo["userDetail"] = (await this.knex
            .select('*')
            .from("users")
            .where("user_id", user_id))[0]; //id

        //console.log("getting all cards for user ",id)
        cardInfo["cardDetail"] = (await this.knex
            .select('*')
            .from("user_cards")
            .where("card_id", card_id))[0]; //id
        //let card = result.rows[0]

        cardInfo["telephones"] = await this.knex
            .select('*')
            .from("telephones")
            .where("card_id", card_id);

        cardInfo["note"] = (await this.knex
            .select('note')
            .from("user_cardholders")
            .where("card_stored", card_id)
            .andWhere("user_id", user_id))[0];

        console.log(`get card ${card_id} service result: `, cardInfo)

        if (!cardInfo) {
            throw new HttpError(404, 'Card not found')
        }

        return cardInfo
    }

    async getCardInfo(card_id: string): Promise<any> {
        let result = await this.knex
            .select('user_id', 'first_name', 'last_name', 'title', 'company_name', 'is_public')
            .from("user_cards")
            .where("card_id", card_id);

        console.log(`search card ${card_id} service result: `, result)

        return result
    }

    async removeCardholder(user_id: string, card_id: string) {
        await this.knex('user_cardholders')
            .where("card_stored", card_id)
            .andWhere("user_id", user_id)
            .del()
    }

    async sendCardRequest(card_requested: string, requestor_id: string, user_card_id: string): Promise<any> {
        let result: any[] = []

        let checkCardholder = (await this.knex
            .select('*')
            .from("user_cardholders")
            .where("user_id", requestor_id)
            .andWhere("card_stored", card_requested))

        console.log(`search card ${card_requested} in cardholder service result: `, checkCardholder)
        if (checkCardholder.length > 0) {
            return result
        }

        let searchResult = await this.knex
            .select('*')
            .from("card_request")
            .where("requestor_id", requestor_id)
            .andWhere("user_card_id", user_card_id)
            .andWhere("card_requested", card_requested)

        console.log(`search card ${card_requested} in card_request service result: `, searchResult)

        if (!(searchResult.length > 0)) {
            result = await this.knex.insert({
                requestor_id: requestor_id,
                user_card_id: user_card_id,
                card_requested: card_requested
            }).into("card_request")
                .returning("*");
        } else {
            console.log('User already hold this card request');
        }
        console.log(`sent card ${card_requested} service result: `, result)

        return result
    }

    async sendCardExchangeRequest(card_requested: string, requestor_id: string, allow_ex: boolean = false): Promise<any> {
        console.log("Updating card exchange: ",[ card_requested, requestor_id, allow_ex])
           let  result = await this.knex.update("allow_ex", allow_ex).into("card_request")
           .where("card_requested", card_requested)
           .andWhere("requestor_id",requestor_id)
                .returning("*");
        
        console.log(`sent card ${card_requested} service result: `, result)

        return result
    }
    /* 
        async getSocketUsername(user_id: string): Promise<any> {
            let result = (await this.knex
                .select('*')
                .from("users")
                .where("user_id", user_id))[0] //id
    
            console.log(`search card user service result: `, result)
    
            return result
        } */

    async getCardRequested(user_id: string): Promise<any> {
        let result = await this.knex
            .select('card_request.requestor_id', 'card_request.user_card_id',
                'card_request.card_requested', 'card_request.created_at','card_request.allow_ex', 'user_cards.first_name', 'user_cards.last_name', 'user_cards.title', 'user_cards.company_name')
            //.distinctOn('card_request.requestor_id')
            .from("card_request")
            .innerJoin('user_cards', 'user_cards.user_id', 'card_request.requestor_id')
            .where("user_card_id", user_id)  //card_user_id
            .orderBy("card_request.created_at"); //["card_request.requestor_id", 

        //same user found 2 record as 2 cards stored
        console.log(`search card request service result: `, result)

        //filter duplicate user due to multiple cards owned
        result = result.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.card_requested === value.card_requested && t.requestor_id === value.requestor_id
            ))
        )
        console.log(`filter card request service result: `, result)

        return result
    }

    async getCardRequestedCount(user_id: string): Promise<any> {
        let result = (await this.knex("card_request")
            .count('requestor_id')
            .where("user_card_id", user_id))[0].count;

        console.log(`count card request service result: `, result)

        return result
    }

    async setNewCardholder(user_id: string, card_id: string) {
        //should direct update the database table to store card_code
        /* let searchResult = (await this.knex
            .select('card_id')
            .from("user_cards")
            .where("card_id", card_id))[0].card_id  //card_code

        console.log("search card before set holder result: ", searchResult) */

        await this.knex.insert({
            user_id: user_id,
            card_stored: card_id //searchResult
        }).into("user_cardholders")

        return;

    }

    async setReturnNewCardholder(user_id: string, returnUser_Id: string) {
        //should direct update the database table to store card_code
        let searchResult = (await this.knex
            .from("user_cards")
            .where("user_id", user_id))[0].card_id  //card_code

        console.log("search card before set return card holder result: ", searchResult)

        await this.knex.insert({
            user_id: returnUser_Id,
            card_stored: searchResult
        }).into("user_cardholders")

        return;

    }

    async removeCardRequest(user_id: string, card_id: string) {
        await this.knex('card_request')
            .where("card_requested", card_id)
            .andWhere("requestor_id", user_id)
            .del()

        // let request_user = (await this.knex
        //     .select('*')
        //     .from("users")
        //     .where("user_id", user_id))[0] //id
        //return request_user
    }
    //single param
    //   let result = await this.knex.raw(
    //     /* sql */ `
    // select memo.id , memo.content , memo.image, memo.user_id, "user".username
    // from memo left join "user" on "user".id = memo.user_id
    // where memo.id = ?
    // `,
    //     [id],
    //   )

    //multi param
    /* var params = {x1:1,dude:10};
  return knex.raw("select * from foo where x1 = :x1 and dude = :dude",params); */

    /* async createCard(card: NewCard): Promise<number> {
        let result: number = await this.knex
            .insert(card)
            .into("user_cards")
            .returning("id");
        console.log('insert result:', result)
        //await this.redis.del('recentMemoList')
        //this.getRecentCardList()
        return result
    }
 */
    //   async getRecentCardList(): Promise<Card[]> {
    //     let cache = await this.redis.get('recentCardList')
    //     if (cache) {
    //       return JSON.parse(cache)
    //     }
    //     let cardList = await this.knex
    //       .from('memo')
    //       .select('id', 'user_id', 'content', 'image', 'created_at')
    //       .orderBy('created_at', 'DESC')
    //     this.redis.set('recentCardList', JSON.stringify(cardList), {
    //       EX: 60, // auto expire after 60 seconds
    //     })
    //     return cardList
    //   }

    todo(): never {
        throw new HttpError(501, 'not implemented')
    }
}
