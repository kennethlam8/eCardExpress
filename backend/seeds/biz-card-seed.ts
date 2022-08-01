//import KnexInit from "knex";
import { Knex } from "knex";
import dotenv from "dotenv";
import XLSX from "xlsx";
import { hashPassword } from "../utils/hash";
import { TokenGenerator, TokenBase } from "ts-token-generator";
//import { logger } from "../utils/logger";
//import qrcode from "../public/js/qrcode";
import { generateIdentifier } from "../utils/code_generator";
import QRCode from 'qrcode';

dotenv.config();

//const knexConfigs = require("../knexfile");
//const configMode = process.env.NODE_ENV || "development";
//const knexConfig = knexConfigs[configMode];
//const knex = KnexInit(knexConfig);
interface User {
    email: number
    first_name: string;
    last_name: string;
    password: string;
    description?: string;
    verified: boolean;
    token?: string;
    user_id: string;
}

interface User_card {
    user_id: string;
    card_image?: string;
    qrcode_image?: string;
    first_name: string;
    last_name: string;
    title: string;
    sector?: string;
    company_name: string;
    address?: string;
    email?: string;
    website?: string;
    card_id?: string;
    image_format?: number;
    image_bg?: number;
    ecard_image?: number;
    default_image_index?: number;
}

interface User_cardholder {
    user_id: number;
    card_stored: number;
}

interface Event {
    name: string;
    banner_image?: string;
    qrcode_image?: string;
    invitation_code: string;
    sector?: string;
    organiser: string;
    host_id: number;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    status: string;
    address?: string;
    conference_link?: string;
    conference_type?: string;
    estimated_participant?: number;
    event_link?: string;
    fb_link?: string;
    linkedin_link?: string;
    contact_email?: string;
    is_private?: boolean;
    allowtime_walkin?: number;
    location?: string;
    start_date_time?: any;
    end_date_time?: any;
    description?: any;
}

interface Event_group {
    group_name: string;
    event_id: number;
}

interface Event_participant {
    event_id: number;
    participant_id: number;
    group?: number
}

interface Telephone {
    card_id: number;
    tel_number: number;
    country_code?: number;
    category?: string
}

export async function seed(knex: Knex): Promise<void> {
    let workbook = XLSX.readFile("./seeds/data.xlsx");
    let userWs = workbook.Sheets["users"];
    let user_cardWs = workbook.Sheets["user_cards"];
    let user_cardholderWs = workbook.Sheets["user_cardholders"];
    let card_requestWs = workbook.Sheets["card_requests"];
    let eventWs = workbook.Sheets["events"];
    let event_groupsWs = workbook.Sheets["event_groups"];
    let event_participantsWs = workbook.Sheets["event_participants"];
    let telephoneWs = workbook.Sheets["telephones"];

    // Deletes ALL existing entries    
    await knex("telephones").del();
    await knex("event_participants").del();
    await knex("event_groups").del();
    await knex("user_cardholders").del();
    await knex("events").del();
    await knex("card_request").del();
    await knex("user_cards").del();
    await knex("users").del();
    await knex.raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE')

    let users: User[] = XLSX.utils.sheet_to_json(userWs);
    let user_cards: User_card[] = XLSX.utils.sheet_to_json(user_cardWs);
    let user_cardholders: User_cardholder[] = XLSX.utils.sheet_to_json(user_cardholderWs);
    let card_requests: any[] = XLSX.utils.sheet_to_json(card_requestWs);
    let events: Event[] = XLSX.utils.sheet_to_json(eventWs);
    let event_groups: Event_group[] = XLSX.utils.sheet_to_json(event_groupsWs);
    let event_participants: Event_participant[] = XLSX.utils.sheet_to_json(event_participantsWs);
    let telephones: Telephone[] = XLSX.utils.sheet_to_json(telephoneWs);

    const usersHashed: User[] = [];
    for (let user of users) {
        let hashedPassword = await hashPassword(user.password)
        user.password = hashedPassword

        /* let user_alias = user.first_name?user.first_name:"any"
        if(user.first_name.length > 5)
            user_alias = user_alias.slice(0, 5);
        
        let user_code = user_alias + "#"+ 1
        user.user_code = user_code */
        usersHashed.push(user);
    }

    //console.log("user card length: ",user_cards.length)
    for (let i: number = 0; i < user_cards.length; i++) {
        //let card_id = generateIdentifier()
        //user_cards[i].card_id = card_id

        /*  qrcode.stringToBytes = qrcode.stringToBytesFuncs["UTF-8"];
         var qr = qrcode(0, 'M');
         qr.addData(`https://ecard-express.com/pages/code-scan.html?cardId=${card_id}`, "Byte");
         qr.make();
         //console.log("event qr code: "+ qr.createImgTag())
         user_cards[i].qrcode_image = qr.createImgTag() */

        //for browser
        /* var QRCode = require('qrcode')
        var canvas = document.getElementById('canvas')

        QRCode.toCanvas(canvas, 'sample text', function (error) {
            if (error) console.error(error)
            console.log('success!');
        }) */

        //user_cards[i].qrcode_image = (await QRCode.toDataURL(`cardId=${card_id}`)) //https://ecard-express.com/pages/code-scan.html?
        console.log("card: ", user_cards[i])
    }

    //console.log("event length: ",user_cards.length)
    for (let i: number = 0; i < events.length; i++) {
        /*  qrcode.stringToBytes = qrcode.stringToBytesFuncs["UTF-8"];
         var qr = qrcode(0, 'M');
         qr.addData(`eventId=${i}`, "Byte");
         qr.make();
         //console.log("event qr code: "+ qr.createImgTag())
         events[i].qrcode_image = qr.createImgTag() */

        // const tokengen = new TokenGenerator({ bitSize: 128, baseEncoding: TokenBase.BASE62 });
        // const token = tokengen.generate();
        // //logger.info("Token generated: "+ token)
        // events[i].invitation_code = token
        console.log("event: ", events[i])
    }
    await knex("users").insert(usersHashed);
    await knex("user_cards").insert(user_cards);   //user_cards
    await knex("card_request").insert(card_requests);
    await knex("events").insert(events); //eventsHashed
    await knex("user_cardholders").insert(user_cardholders);
    await knex("event_groups").insert(event_groups);
    //    await knex("event_participants").insert(event_participants); 
    await knex("telephones").insert(telephones);
};
