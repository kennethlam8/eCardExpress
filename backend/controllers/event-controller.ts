import { Request, Response } from "express";
import formidable from "formidable";
import { mkdirSync } from "fs";
import { logger } from "handlebars";
import { io } from "../io";
import { EventService, UpdateEventFields } from "../services/eventServices";
import { form } from "../upload";


type PostEventFields = {
    name: string,
    status: string,
    organiser: string,
    start_date: string,
    start_time: string,
    end_time: string,
    event_address: string,
    estimated_participant: number,
    qrcode_image: string,
    invitation_code: string,
    location: string,
    description: string,
    start_date_time?: any,
    end_date_time?: any
}
export class EventController {

    private eventService: EventService;

    constructor(eventService: EventService) {
        this.eventService = eventService;
    }

    postEvent = (req: Request, res: Response) => {
        try {
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    res.status(400).json({ error: String(err) });
                    return;
                }
                if (!req.session || !req.session['user']) {
                    res.status(403).json({ error: "Login is required" })
                    return
                }
                let {
                    name, status, organiser, start_date, start_time,
                    end_time, event_address, estimated_participant,
                    qrcode_image, invitation_code, location, description,
                    start_date_time, end_date_time
                } = fields as any as PostEventFields;
                // console.log(
                //     {
                //         name, status, organiser, start_date,
                //         start_time, end_time, event_address, estimated_participant,
                //         qrcode_image, invitation_code, location, description, start_date_time,
                //         end_date_time
                //     }
                // )
                let { banner_image } = files;
                let file = Array.isArray(banner_image) ? banner_image[0] : banner_image;
                let image = file ? file.newFilename : undefined;
                await this.eventService.addEvent({
                    name, status, organiser, start_date, start_time, end_time,
                    event_address, estimated_participant, qrcode_image,
                    invitation_code, location, description,
                    host_id: req.session['user'].user_id, image,
                    start_date_time, end_date_time//.id
                });

                res.json({
                    message: "Add event success"

                });
            });

        }

        catch (error) {
            res.status(500).json({
                message: "Internal server error (postEvent)",
            });

        }
    }

    getEvents = async (req: Request, res: Response) => {
        try {
            let events = await this.eventService.getEvents();
            res.json({
                data: events,
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Internal server error (getEvents)",
            });
        }

    }
    getEventsDetailById = async (req: Request, res: Response) => {
        try {
            let eventId = Number(req.params.id)
            let user_id = req.session["user"]?.user_id //|| "admin#1" //.id || 1

            if (!user_id) {
                res.status(400).json({
                    message: 'no session found'
                })
            }
            if (!eventId) {
                res.status(401).json({
                    message: "Invalid ID",
                });
                return;
            }
            let eventDetails = await this.eventService.getEventsById(eventId);
            let isHostIdMatchEventId = (user_id == eventDetails.host_id)
            eventDetails['isHostIdMatchEventId'] = isHostIdMatchEventId
            // console.log('event detail from event controller: ', eventDetails);
            // console.log('isHostIdMatchEventId', isHostIdMatchEventId);


            res.json({
                data: eventDetails,
            });
        }

        catch (error) {
            res.status(500).json({
                message: "Internal server error (getEventsDetailById)" + error,
            });
        }
    }

    updateEventDetail = async (req: Request, res: Response) => {
        let eventId = Number(req.params.id)

        console.log('event ID', eventId)
        form.parse(req, async (err: any, fields: any, files: formidable.Files) => {
            if (err) {
                console.log('parse fiel error :', err)
                res.status(400).json({ error: String(err) });
                return;
            } else {
                console.log('parse no error')
            }
            if (!req.session || !req.session['user']) {
                res.status(403).json({ error: "Login is required" })
                return
            }

            console.log("Updating Event details: ", { err, files, fields });

            // let banner_image: formidable.File = files.banner_image as formidable.File;

            try {

                // let { name, status, organiser, start_date, start_time, end_time, event_address,
                //     estimated_participant, invitation_code, location, description, group_names,
                //     start_date_time, end_date_time
                // }: any = fields



                let inputGroups = []
                for (let key in fields) {
                    if (key.startsWith('group_names_')) {
                        inputGroups.push(JSON.parse(fields[key]))
                    }
                }



                let { name, status, organiser, start_date, start_time, end_time, event_address,
                    estimated_participant, invitation_code, location, description, group_names,
                    start_date_time, end_date_time
                }: any = fields

                let { banner_image } = files;
                let file = Array.isArray(banner_image) ? banner_image[0] : banner_image;
                let image = file ? file.newFilename : undefined;
                // console.log('o[tions : ', {
                //     name, status, organiser, start_date, start_time, end_time, event_address,
                //     estimated_participant, invitation_code, location, description, image, group_name,
                //     start_date_time, end_date_time
                // })
                await this.eventService.updateEventDetails(eventId, {
                    name, status, organiser, start_date, start_time,
                    end_time, event_address,
                    estimated_participant, invitation_code,
                    location, description, image, group_names: inputGroups,
                    start_date_time, end_date_time
                })
                io.emit('new-event', {
                    message: `${name} updated: ( ${status} )`,
                })
                res.json({
                    data: `Event edit details updated`
                })
            }

            catch (error) {
                console.error('System error - ' + error)
                res.status(500).json({
                    message: "Internal server error (updateEventDetail)"
                })
            }
        })

    }

    getEventGroupParticipant = async (req: Request, res: Response) => {
        try {
            console.log("Get event group participants request id: ", req.params.id);
            let groupId = Number(req.params.id)

            if (!groupId) {
                res.status(401).json({
                    message: "Missing group id",
                });
                return;
            }

            let eventParticipants = await this.eventService.getEventGroupParticipant(groupId);
            console.log('event participants from event controller: ', eventParticipants);

            res.json({
                data: eventParticipants,
            });
        }

        catch (error) {
            res.status(500).json({
                message: "Internal server error (getEventsDetailById)" + error,
            });
        }
    }

    postEventGroupParticipant = async (req: Request, res: Response) => {
        try {
            /* if(!req.session || !req.session["user"]){
                console.log("No user session found")
                res.status(404).json({ error: "No user session found"})
                return
            } */
            console.log("user session: ", req.session["user"]);
            let user_id = req.session["user"]?.user_id //|| "admin#1" //.id || 1

            let { event_id, group } = req.body
            console.log("Get event group participants request id: ", req.body);

            await this.eventService.postEventGroupParticipant(user_id, event_id, group);

            res.json({
                data: "success add as group participant",
            });
        } catch (error) {
            res.status(500).json({
                message: "Internal server error (postEventGroupParticipant)" + error,
            });
        }
    }

}
