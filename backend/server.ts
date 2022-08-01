import express from 'express'
import { print } from 'listening-on'
import path from 'path';
//import { userRoutes } from './routes/user';
import { expressSessionMiddleware, grantExpress } from "./utils/middleware";
import env from "./utils/env";
import { connectDB, knex } from './utils/db';
import { CardController } from './controllers/card-controller';
import { CardService } from './services/cardServices';
import { form } from './upload';
import { userGuardAPI, userGuard } from './utils/guard';
import { UserService } from './services/userServices';
import { UserController } from './controllers/user-controller';
import { setAppRoutes } from './routes/routes';
import { EventService } from './services/eventServices';
import { EventController } from './controllers/event-controller';
import http from 'http';
import { createIOServer } from './io';

const app = express();
let server = new http.Server(app);
let io = createIOServer(server)

app.use(express.json());

app.use(expressSessionMiddleware);
declare module "express-session" {
  interface SessionData {
    user?: any;
    name?: string;
  }
}

connectDB()

app.use(grantExpress as express.RequestHandler);
let cardService = new CardService(knex)
let cardController = new CardController(cardService, io, form)

let userService = new UserService(knex)
let userController = new UserController(userService)

let eventService = new EventService(knex)
let eventController = new EventController(eventService)

setAppRoutes({ app, userController, eventController, cardController })

app.use(express.static('public'))
app.use(userGuardAPI, express.static('protected'))

app.use('/images', express.static('uploads'))

app.use((req, res) => {
  res.redirect("/pages/404.html")
})

//app
server.listen(env.SERVER_PORT, () => {
  console.log(`Monitoring : http://localhost:${env.SERVER_PORT}/`);
  if (env.SERVER_PORT) {
    print(parseInt(env.SERVER_PORT))
  }
})

