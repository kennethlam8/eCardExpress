import express from "express";
import { EventController } from "../controllers/event-controller";

export function createEventRoutes(eventController: EventController) {
    let eventRoutes = express.Router();

    eventRoutes.post("/events", eventController.postEvent);
    // eventRoutes.post("/eventNote", eventController.postEventNote);

    eventRoutes.post("/eventGroupParticipant", eventController.postEventGroupParticipant);

    eventRoutes.get("/events", eventController.getEvents);
    eventRoutes.get("/events/:id", eventController.getEventsDetailById);
    eventRoutes.get("/eventGroupParticipant/:id", eventController.getEventGroupParticipant);

    eventRoutes.patch("/eventGroup/:id", eventController.getEventGroupParticipant);
    eventRoutes.patch('/updateEventDetail/:id', eventController.updateEventDetail)
    return eventRoutes
}