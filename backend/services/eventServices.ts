import { Knex } from "knex";
import { Event } from "../models/event";
//import qrcode from "../public/js/qrcode";
import QRCode from 'qrcode';
import { generateNumber } from "../utils/code_generator";

interface NewEventFields {
    name: string,
    status: string,
    organiser: string,
    start_date: string,
    start_time: string,
    end_time: string,
    event_address?: string | undefined,
    estimated_participant?: number | undefined,
    banner_image?: string,
    qrcode_image?: string,
    invitation_code?: string,
    location?: string,
    description?: string,
    host_id?: number,
    image?: string,
    start_date_time?: any,
    end_date_time?: any
}

export interface UpdateEventFields {
    name: string,
    status: string,
    organiser: string,
    start_date: string,
    start_time: string,
    end_time: string,
    event_address?: string | undefined,
    estimated_participant?: number | undefined,
    banner_image?: string,
    invitation_code?: string,
    location?: string,
    description?: string,
    host_id?: number,
    image?: string,
    group_names: any[],
    start_date_time?: any,
    end_date_time?: any
}
export class EventService {
    constructor(private knex: Knex) { }



    public async addEvent(newEventFields: NewEventFields) {
        let { name, status, organiser, start_date, start_time, end_time,
            event_address, estimated_participant, qrcode_image, invitation_code,
            location, description, host_id, image, start_date_time, end_date_time } = newEventFields
        console.log({ start_date_time, end_date_time })

        // invitation_code = Math.floor(Math.random() * 12) + 1
        invitation_code = [
            ...Array.from({ length: 6 }, generateNumber)
        ].join('');
        // console.log('invitation code: ', invitation_code)

        /*  qrcode.stringToBytes = qrcode.stringToBytesFuncs["UTF-8"];
         var qr = qrcode(0, 'M');
         qr.addData(`eventId=${invitation_code}`, "Byte");
         qr.make();
         //console.log("event qr code: "+ qr.createImgTag())
         qrcode_image = qr.createImgTag() */

        qrcode_image = await QRCode.toDataURL(`https://ecard-express.com/pages/code-scan.html?eventId=${invitation_code}`)

        await this.knex("events").insert({
            name, status, organiser,
            start_date, start_time, end_time, event_address,
            estimated_participant, banner_image: image,
            qrcode_image, invitation_code, location, description, host_id, start_date_time: new Date(start_date_time), end_date_time: new Date(end_date_time)
        });
    }

    //get all public event
    public async getEvents() {
        let eventResultFromDB = await this.knex("events").orderBy("updated_at", "desc");
        // let eventResultFromDB = await this.knex("events").orderBy("updated_at");
        return eventResultFromDB;
    }

    public async getEventsById(eventId: number) {
        let eventDetailResultFromDB = (await this.knex("events").where({ id: eventId }))[0]
        //console.log("Event: ",eventDetailResultFromDB)

        if (eventDetailResultFromDB) {
            let groupList = await this.knex("event_groups").select("*").where("event_id", eventId).orderBy("id");
            console.log("Group list: ", groupList)
            if (groupList)
                eventDetailResultFromDB['groupList'] = groupList
        }

        console.log("get event by id services result: ", eventDetailResultFromDB)
        return eventDetailResultFromDB;
    }

    public async updateEventDetails(eventId: number, updateEventFields: UpdateEventFields) {
        let { name, status, organiser, start_date, start_time, end_time,
            event_address, estimated_participant, invitation_code,
            location, description, image, group_names, start_date_time, end_date_time } = updateEventFields

        // console.log('update detail id=', eventId)
        // console.log('update detail event name=', name)



        await this.knex("events").update({
            name,
            status,
            organiser,
            start_date,
            start_time,
            end_time,
            event_address,
            estimated_participant,
            invitation_code,
            location,
            description,
            banner_image: image,
            start_date_time,
            end_date_time,
            updated_at: "NOW()"
        }).where({ id: eventId });
        console.log("event from services updated: ", group_names)

        // Remove unwanted groups
        let existingGroupRows = await this.knex("event_groups").where("event_id", eventId).select('id')

        const existingGroupIdList = existingGroupRows.map((item) => item.id)
        const inputGroupsIdList = group_names.map(t => t.id)

        for (let existingGroupId of existingGroupIdList) {
            if (inputGroupsIdList.indexOf(existingGroupId) == -1) {
                console.log(`Going to remove :${existingGroupId}`)

                // 1. remove all participants for the "to be removed group"
                await this.knex('event_participants').update({
                    group: null
                }).where({
                    event_id: eventId,
                    group: existingGroupId
                })
                // 2. remove the group
                await this.knex('event_groups').del().where({
                    id: existingGroupId
                })
            }

        }

        // Update or insert groups

        if (group_names && group_names.length > 0) {
            for (let groupItem of group_names) {
                if (groupItem['id']) {
                    await this.knex("event_groups").update({
                        group_name: groupItem['group_name']
                    }).where({ id: groupItem['id'] });

                } else {
                    await this.knex("event_groups").insert({
                        group_name: groupItem['group_name'],
                        event_id: eventId
                    });
                }

            }

        }
    }

    public async getEventGroupParticipant(groupId: number) {
        let result = await this.knex("event_participants")
            .innerJoin('user_cards', 'event_participants.card_id', '=', 'user_cards.card_id')
            .where("group", groupId)

        console.log('group ID from BE', groupId)

        console.log("event participants from services result: ", result)

        // result = result.filter((value, index, self) =>
        //     index === self.findIndex((t) => (
        //         t.participant_id === value.participant_id
        //     ))
        // )
        console.log(`filter event participants service result: `, result)

        return result;
    }


    public async postEventGroupParticipant(user_id: string, event_id: number, group: number) {
        let card_id = (await this.knex
            .select('*')
            .from("user_cards")
            .orderBy("id")
            .where("user_id", user_id))[0];

        console.log("card_id get: ", card_id.card_id)

        let result = await this.knex
            .insert({
                card_id: card_id.card_id,
                event_id: event_id,
                group: group
            }).into("event_participants").returning('id')
        console.log(`event_participants insert: ${result}`)
        console.log("event participant ", card_id, " added to ", group)
    }



}