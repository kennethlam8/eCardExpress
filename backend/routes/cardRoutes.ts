import express from "express";
import { CardController } from "../controllers/card-controller";
import { userGuardAPI } from "../utils/guard";

export function createCardRoutes(cardController: CardController) {
    let cardRoutes = express.Router();
    cardRoutes.get('/cards', cardController.getAllCard)
    cardRoutes.get('/cards/:id', cardController.getCardById)
    cardRoutes.get('/cardCode/:id', cardController.sendCardRequest)
    cardRoutes.get('/cardRequested', cardController.getCardRequested)
    cardRoutes.get('/cardRequestedCount', cardController.getCardRequestedCount)   
    
    cardRoutes.post('/cardholder', cardController.setNewCardholder) //newCardholder
    
    cardRoutes.post('/myCards', cardController.getMyCard)
    cardRoutes.post('/publicCards', cardController.getPublicCard)

    cardRoutes.patch('/cardExchangeRequest', cardController.sendCardExchangeRequest)

    cardRoutes.delete('/card', cardController.removeCardholder)
    cardRoutes.delete('/cardRequest', cardController.removeCardRequest) //removeCardRequest
    return cardRoutes
}