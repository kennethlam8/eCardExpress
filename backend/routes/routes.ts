import express from "express";
import { CardController } from "../controllers/card-controller";
import { EventController } from "../controllers/event-controller";
import { UserController } from "../controllers/user-controller";
import { userGuardAPI } from "../utils/guard";
import { createCardRoutes } from "./cardRoutes";
import { createEventRoutes } from "./eventRoutes";
import { createUserRoutes } from "./userRoutes";


interface Routes {
    app: express.Application,
    userController: UserController,
    eventController: EventController,
    cardController: CardController
}
export function setAppRoutes(options: Routes) {
    let { app, userController, eventController, cardController } = options
    let userRoutes = createUserRoutes(userController)
    let eventRoutes = createEventRoutes(eventController)
    let cardRoutes = createCardRoutes(cardController)
    app.use(userRoutes)
    app.use(userGuardAPI, eventRoutes)
    app.use(userGuardAPI, cardRoutes)
}
