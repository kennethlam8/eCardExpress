import { Knex } from "knex";
import { toUnicode } from "punycode";
import { hashPassword } from "../utils/hash";
//import qrcode from "../public/js/qrcode";
import QRCode from 'qrcode';
import { HttpError } from '../utils/error'
import { compressImage } from "./compressor";
import fetch from 'node-fetch'
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "../utils/email";
import { EmailOption } from "../models/email";

import { generateIdentifier, generateNumber } from "../utils/code_generator";


export class UserService {
    // private knex;

    // constructor(client: Knex) {
    //     this.knex = client;
    // }

    constructor(private knex: Knex) { }

    async getRegisterByEmail(email: string) {
        let userResult = await this.knex("users")
            .select("email", 'first_name', 'last_name', "profile_pic", "user_id", "verified")
            .where("email", email);
        console.log("Service check email result: ", userResult)
        return userResult;
    }

    async userLogin(email: string) {
        let userResult = await this.knex("users").where("email", email);
        console.log("Service check user account result: ", userResult)
        return userResult;
    }

    async InsertNewToken(id: string) {
        let token = [
            ...Array.from({ length: 4 }, generateNumber)
        ].join('')
        let userResult = (await this.knex("users").update("token", token).where("user_id", id).returning("*"))[0]; //"id"
        return userResult
    }
    /*  async getUserByUsername(username: string) {
         let userResult = await this.knex("users").where({ username });
         let dbUser = userResult[0];
         return dbUser;
     } */

    async getGoogleLoginInfo(accessToken: string) {
        console.log("google login ing");
        const fetchRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            method: "get",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        const result = await fetchRes.json();
        console.log("google result = ", result);

        const users = await this.knex("users").where("email", result.email);

        let dbUser = users[0];
        if (!dbUser) {
            dbUser = (await this.knex.insert({
                email: result.email,
                first_name: result.given_name,
                last_name: result.family_name,
                profile_pic: result.picture,
                verified: true
            }).into("users")
                .returning("*"))[0];
            console.log("user create google service result: ", dbUser)
        }

        return dbUser
    }

    async createUser(email: string, first_name: string //| null = null
        , last_name: string, password: string) {
        let hashedPassword = await hashPassword(password)
        console.log("user create service hash password: ", hashedPassword)

        let user_alias = first_name ? first_name : "any"
        let character = user_alias[0]
        if (first_name.length > 5)
            user_alias = user_alias.slice(0, 5);
        let userCount = (await this.knex("users").count('user_id').where('user_id', '~', `^${character}`))[0].count as string
        console.log("user create checking service result: ", userCount)

        let user_id = user_alias + "#" + (parseInt(userCount) + 1)
        console.log("user create checking service result2: ", user_id)
        let token = [
            ...Array.from({ length: 4 }, generateNumber)
        ].join('')
        let status = "False"

        let userResult = await this.knex.insert({
            email: email,
            first_name: first_name,
            last_name: last_name,
            password: hashedPassword,
            user_id: user_id,
            token: token,
            verified: status
        }).into("users")
            .returning("*");
        console.log("user create service result: ", userResult)

        return userResult
    }

    async sendEmail(emailOptions: EmailOption) {
        sendEmail(emailOptions)
    }

    async emailVerify(email: string, token: string) {
        let userResult = (await this.knex("users").update("verified", true).where({ "email": email, "token": token }).returning("*"))[0];
        return userResult
    }

    async createUserProfile(user_id: string, first_name: string | null = null, last_name: string | null = null,
        title: string | null = null, company_name: string | null = null
        , email: string | null = null, address: string | null = null,
        website: string | null = null, telephones: any | null = null, profile_pic: any | null = null,
        card_image: any | null = null, description: string | null = null, has_acct: string | null = null) {

        const txn = await this.knex.transaction();

        console.log("creating user profile")

        //compressImage(profile_pic)

        try {
            //let latest_id = await this.knex("user_cards").max('id')
            //console.log("latest card id: ", latest_id)

            let card_code = generateIdentifier()
            //let card_code = "UK0169"
            for (let i = 0; i < 10; i++) {
                let code_checking = await this.knex("user_cards").select("id").where("card_id", card_code)
                console.log("Checking code result", code_checking)

                if (code_checking.length < 1) {
                    console.log("Code success generated: ", card_code)
                    break;
                } else if (i == 9) {
                    throw "Fail to generate";
                } else {
                    card_code = generateIdentifier()
                }
            }

            /* qrcode.stringToBytes = qrcode.stringToBytesFuncs["UTF-8"];
            var qr = qrcode(0, 'M');
            qr.addData(`https://ecard-express.com/pages/code-scan.html?cardId=${card_code}`, "Byte");
            qr.make(); */

            //var qrcode: string = (await QRCode.toDataURL(`cardId=${card_code}`))
            //console.log("user card qr created ")

            //for google login
            let userResult = (await this.knex("users").where("user_id", user_id))[0];
            //console.log("user checking result: ", userResult)
            first_name = first_name ? first_name : '[???]'//userResult.first_name
            last_name = last_name ? last_name : '[???]' //userResult.first_name

            let default_image_index = has_acct == 'false'? 2 : 1

            const card_id = (await txn.insert({
                user_id: user_id,
                card_image: card_image,
                //qrcode_image: qrcode, //qr.createImgTag(),
                first_name: first_name,
                last_name: last_name,
                title: title,
                company_name: company_name,
                email: email,
                address: address,
                website: website,
                card_id: card_code,
                default_image_index: default_image_index
            }).into("user_cards")
                .returning("card_id"))[0];

            if (card_image) {
                compressImage(card_image)
            }
            console.log("user create card id result: ", card_id.card_id)//.id)
            // console.log("user create card id result type: ", typeof(parseInt(card_id.id)))

            console.log("user telephone list", telephones)

            if (telephones)
                for (let telephone of telephones) {
                    console.log("user telephone info", telephone)
                    if (telephone.tel_number == "")
                        continue
                    await txn.insert({
                        card_id: card_id.card_id, //.id,
                        tel_number: telephone.tel_number,
                        category: telephone.category,
                    }).into("telephones")
                    //console.log("user telephone result")
                }

            if (profile_pic || description) {
                let updateItems = {}
                if (profile_pic) {
                    updateItems['profile_pic'] = profile_pic
                }
                if (description) {
                    updateItems['description'] = description
                }
                await txn.update(updateItems).into("users").where("user_id", user_id)
                if (profile_pic)
                    await compressImage(profile_pic)
            }
            console.log("service user profile create pass")
            await txn.commit();
            return { cardId: card_id.card_id };
        } catch (e) {
            await txn.rollback();
            return e;
        }

    }

    async setScanCardholder(user_id: string, card_id: string) {     
        console.log("Add card holder",[user_id,card_id]);  
        await this.knex.insert({
            user_id: user_id,
            card_stored: card_id,
            has_acct: false
        }).into("user_cardholders")

        return;

    }

    async addUser(username: string, password: string | undefined = undefined) {
        let randomHashPassword = null;
        if (password === undefined)
            randomHashPassword = null;
        else
            randomHashPassword = await hashPassword(password)
        await this.knex("users").insert({ username: username, password: randomHashPassword });
    }

    async getMe(email: string) {
        let myInfo = {}
        let userId = (await this.knex
            .select("user_id")
            .from("users")
            .where("email", email))[0].user_id

        //profile pic (no this column yet)
        myInfo["userDetail"] = (await this.knex
            .select("email", 'first_name', 'last_name', "profile_pic", "user_id", "connection_number", "is_public", 'description')
            .from("users")
            .where("user_id", userId))[0];

        // Card details
        let cardDetail = (await this.knex
            .select('*')
            .from("user_cards")            
            .orderBy("id")
            .where("user_id", userId))[0];
        delete cardDetail.id
        myInfo["cardDetail"] = cardDetail
        
        console.log("Card got: ",myInfo["cardDetail"] )
        //let card = result.rows[0]
        let cardId = myInfo["cardDetail"].card_id

        myInfo["telephones"] = await this.knex
            .select('*')
            .from("telephones")
            .where("card_id", cardId);


        console.log(`get card ${cardId} service result: `, myInfo)

        if (!myInfo) {
            throw new HttpError(404, 'Card not found')
        }

        return myInfo
    }
    async updateUserProfile(user_id: number, first_name: string, last_name: string,
        title: string | null = null, company_name: string | null = null
        , email: string | null = null, address: string | null = null,
        website: string | null = null, telephones: any | null = null, profile_pic: any | null = null
        , description: string | null = null, card_id: string, iconFromDB: string | null = null) {

        const txn = await this.knex.transaction();

        console.log("creating user profile")

        //compressImage(profile_pic)

        try {
            //let latest_id = await this.knex("user_cards").max('id')
            //console.log("latest card id: ", latest_id)

            //console.log("user card qr created ")
            console.log({ first_name })
            console.log({ last_name })
            console.log({ user_id })
            console.log({ card_id })

            // no need 
            // let userResult = (await txn.update({
            //     first_name: first_name,
            //     last_name: last_name,
            // }).into("users").where("id", user_id).returning("*"))[0]

            // console.log(userResult)

            //move to bottom
            // if (profile_pic) {
            //     await txn.update({
            //         profile_pic: profile_pic
            //     }).into("users").where("id", user_id)
            //     await compressImage(profile_pic)
            // }
            //console.log("user checking result: ", userResult)

            await txn.update({
                first_name: first_name,
                last_name: last_name,
                title: title,
                company_name: company_name,
                email: email,
                address: address,
                website: website,
            }).into("user_cards").where("card_id", card_id)


            console.log("update user card where id: ", card_id)
            // console.log("user create card id result type: ", typeof(parseInt(card_id.id)))
            // const telephoneID = await txn("telephones").select("id").where("card_id", card_id)
            // console.log({ telephoneID })
            // console.log("user telephone list", telephones)

            // console.log("user telephone list length: ", telephoneID.length, " ", telephones.length)
            // let i = 0
            await txn("telephones").where("card_id", card_id).del()
            if (telephones.length > 0) {
                for (let telephone of telephones) {
                    // if (i < telephoneID.length) {
                    //     if (telephone.tel_number == "") {
                    //         
                    //         i++
                    //         console.log("user delete telephone info", telephone)
                    //         continue
                    //     }

                    //     console.log("user update telephone info", telephone)
                    //     await txn.update({
                    //         tel_number: telephone.tel_number,
                    //         category: telephone.category,
                    //     }).into("telephones").where("id", telephoneID[i].id)
                    //     //console.log("user telephone result")
                    // } else {
                    //     //when added tel field
                    //     console.log("user add telephone info", telephone)
                    //     if (telephone.tel_number == "")
                    //         continue

                    // }
                    // i++;

                    await txn.insert({
                        card_id: card_id,
                        tel_number: telephone.tel_number,
                        category: telephone.category,
                    }).into("telephones")
                }


            }
            if (!iconFromDB) {
                await txn.update({ profile_pic: iconFromDB }).into("users").where("user_id", user_id)
                await txn.update({ profile_pic: iconFromDB }).into("user_cards").where("card_id", card_id)
            }

            if (profile_pic || description) {
                let updateItems = {}
                if (profile_pic) {
                    updateItems['profile_pic'] = profile_pic
                }
                if (description) {
                    updateItems['description'] = description
                }
                await txn.update(updateItems).into("users").where("user_id", user_id)
                await txn.update({ profile_pic: profile_pic }).into("user_cards").where("card_id", card_id)
                if (profile_pic)
                    await compressImage(profile_pic)
            }
            console.log("service user profile update pass")
            await txn.commit();
            return;
        } catch (e) {
            await txn.rollback();
            return e;
        }

    }

    async updateCardStyle(user_id: string, card_format: number | null, card_bg: number | null, default_image_index: number, card_image: string | null, card_id:string) {
        let result;
        if (card_format && card_bg) {
            result = (await this.knex.update({ image_format: card_format, image_bg: card_bg, default_image_index: default_image_index }).into("user_cards").where("card_id", card_id).returning("*"))[0];
        } else {
            result = (await this.knex.update({ default_image_index: default_image_index, card_image: card_image }).into("user_cards").where("card_id", card_id).returning("*"))[0];
        }
        return result
    }

    async uploadCard(user_id: number, card_image: string) {
        let result = await this.knex.update("card_image", card_image).into("user_cards").where("user_id", user_id).returning("id");
        return result
        // console.log("Service check email result: ", userResult)
    }

    async getCard(user_id: number) {
        let result = (await this.knex("user_cards").where("user_id", user_id))[0];
        return result
        // console.log("Service check email result: ", userResult)
    }

}