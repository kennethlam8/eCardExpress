import express from "express";
import formidable from "formidable";
import Formidable from "formidable/Formidable";
import { removeUserByUserName } from "../io";
import { UserService } from "../services/userServices"
import { form } from "../upload";
import { checkPassword } from "../utils/hash";
import { logger } from "../utils/logger";

export class UserController {

    constructor(
        private userService: UserService,
    ) { }

    getUserSession = async (req: express.Request, res: express.Response) => {
        try {
            if (!req.session["user"]) {
                res.json({
                    message: "Not yet login",
                });
                return;
            }
            res.json({
                data: req.session["user"],
            });
        } catch (error) {
            logger.error('System error - ' + error)
            res.status(500).json({
                message: 'System error'
            })
        }
    }

    googleLogin = async (req: express.Request, res: express.Response) => {
        try {
            const accessToken = req.session?.["grant"].response.access_token;

            console.log("Session token: ", accessToken)
            const dbUser = await this.userService.getGoogleLoginInfo(accessToken)

            //const user = await this.userService.getUserByUsername(googleLoginInfo.email)

            console.log("google result2 = ", dbUser);

            delete dbUser.id
            delete dbUser.password
            delete dbUser.updated_at

            req.session["user"] = dbUser
            console.log("Session info: ", req.session["user"])
            const cardInfo = await this.userService.getCard(dbUser.user_id) //id
            console.log({ cardInfo })
            if (!cardInfo) {
                res.redirect("/pages/profile-create.html");
            } else {
                res.redirect("/");
            }


        } catch (error) {
            logger.error('System error - ' + error)
            res.status(500).json({
                message: 'Google login fail' + error
            })
        }
    }

    userLoginByEmail = async (req: express.Request, res: express.Response) => {
        try {
            let { email, isLoggedIn } = req.body
            if (!email || !isLoggedIn) {
                res.json({
                    message: "Not yet login",
                });
                return;
            }
            let dbUser = (await this.userService.userLogin(email))[0]
            delete dbUser.id
            delete dbUser.password
            delete dbUser.updated_at
            req.session["user"] = dbUser

            console.log("Session info: ", req.session["user"])
            res.json({ data: "login success" });
        } catch (error) {
            logger.error('System error - ' + error)
            res.status(500).json({
                message: 'System error'
            })
        }
    }

    getMe = async (req: express.Request, res: express.Response) => {
        try {
            let { email, isLoggedIn } = req.body
            if (!email || !isLoggedIn) {
                res.json({
                    message: "Not yet login",
                });
                return;
            }
           /*  let dbUser = (await this.userService.userLogin(email))[0]
            delete dbUser.id
            delete dbUser.password
            delete dbUser.updated_at
            req.session["user"] = dbUser
 */
            // let userId = req.session["user"].user_id
            let myInfo = await this.userService.getMe(email)

            // console.log(`get user ${userId} result: `, myInfo)
            console.log("Session info: ", req.session["user"])
            res.json({ data: myInfo });
        } catch (error) {
            logger.error('System error - ' + error)
            res.status(500).json({
                message: 'System error'
            })
        }
    }

    resendEmail = async (req: express.Request, res: express.Response) => {
        try {
            let userId = req.session["user"].user_id; //.id;
            let dbUser = await this.userService.InsertNewToken(userId)
            console.log(dbUser)
            // let verifyToken = "http://" + req.headers.host + "/confirmation/" + dbUser.email + "/t/" + dbUser.token;
            let verifyToken = dbUser.token
            let name = dbUser.first_name + " " + dbUser.last_name
            let sendEmailOption = {
                email: dbUser.email,
                name: name,
                token: verifyToken
            }
            await this.userService.sendEmail(sendEmailOption)
            delete dbUser.id
            delete dbUser.password
            delete dbUser.updated_at

            req.session["user"] = dbUser
            res.json({
                data: dbUser.email
            })
        } catch (error) {
            logger.error('System error - ' + error)
            res.status(500).json({
                message: 'System error'
            })
        }
    }



    //post
    checkEmail = async (req: express.Request, res: express.Response) => {
        try {
            console.log("checking email: ", req.body.email);
            let email = req.body.email
            let isRegistered = false;
            let emailChecked = await this.userService.getRegisterByEmail(email)
            if (emailChecked[0]) {
                isRegistered = true
                req.session["user"] = { "id": emailChecked[0].user_id } //id
            }
            res.json({
                data: { email, isRegistered }
            })
        } catch (error) {
            logger.error('System error - ' + error)
            res.status(500).json({
                message: 'System error'
            })
        }
    }

    createUser = async (req: express.Request, res: express.Response) => {
        try {
            console.log("login request body: ", req.body);
            let email = req.body.email
            let first_name = req.body.firstName
            let last_name = req.body.lastName
            let password = req.body.password

            //console.log("password: ", typeof(password));

            if (!email || !password) {
                res.status(400).json({
                    error: 'Invalid input'
                });
                return
            }

            if (password.length < 5) {
                res.status(400).json({
                    error: 'Password too short'
                });
                return
            }

            let emailChecked = await this.userService.getRegisterByEmail(req.body.email)
            console.log("Double check email: ", emailChecked)
            if (emailChecked[0]) {
                res.status(400).json({
                    error: 'Account has been created for this email'
                });
                return
            }

            let dbUser = (await this.userService.createUser(email, first_name, last_name, password))[0]
            console.log("Service return create user result: ", dbUser)

            // let verifyToken = "http://" + req.headers.host + "/confirmation/" + dbUser.email + "/t/" + dbUser.token;
            let verifyToken = dbUser.token
            let name = dbUser.first_name + " " + dbUser.last_name
            let sendEmailOption = {
                email: dbUser.email,
                name: name,
                token: verifyToken
            }
            //for test
            await this.userService.sendEmail(sendEmailOption)
            delete dbUser.id
            delete dbUser.password
            delete dbUser.updated_at

            req.session["user"] = dbUser
            console.log("Session info: ", req.session["user"])
            res.json({
                data: { email: dbUser.email, firstName: dbUser.first_name, lastName: dbUser.last_name }
            })
        } catch (error) {
            logger.error('System error - ' + error)
            res.status(500).json({
                message: 'System error'
            })
        }
    }

    emailVerify = async (req: express.Request, res: express.Response) => {
        try {
            let email = req.params.email;
            let token = req.params.token;
            // check username

            let dbUser = await this.userService.emailVerify(email, token)
            if (dbUser.verified == true) {
                //delete dbUser.id
                let isVerified = true
                delete dbUser.password;
                delete dbUser.updated_at
                req.session["user"] = dbUser;
                res.json({
                    data: { isVerified }
                })
            } else {
                res.status(400).json({
                    error: 'The code you have entered is incorrect.'
                });
            }
        } catch (error: any) {
            logger.error(error.message);
            res.json({
                error: "Email Verification fail! " + error.message,
            });
        }
    }
    createUserProfile = async (req: express.Request, res: express.Response) => {
        console.log("start creating card")
        form.parse(req, async (err: any, fields: any, files: formidable.Files) => {
            try {
                console.log("Creating new card: ", {
                    err,
                    fields,
                    files,
                });

                if (err) {
                    res.status(400).json({
                        error: 'File size exceed max - ', err
                    });
                    return
                }

                //let profile_file = Array.isArray(files) ? files[0] : files
                let profile_image: formidable.File = files[`profile_image`] as formidable.File;

                let card_image: formidable.File = files[`card_image`] as formidable.File;

                //console.log("card image: ", card_image);

                if (card_image && card_image.size  == 0) {
                    logger.error("Image size is zero")
                    res.status(406).json({
                        message: 'File corrupted'
                    })
                    return
                }

                console.log("create user profile body: ", fields); //req.body.info

                let { first_name, last_name, title, company_name, email, address, website, description, has_acct } = fields //req.body.info

                console.log("check body title: ", has_acct);

                let user_id = has_acct == 'false'? "temp#0" : req.session["user"]?.user_id  //|| "admin#1" //.id

                console.log("check user name: ", user_id);

                let result: any = await this.userService.createUserProfile(user_id, first_name, last_name, title, company_name, email, address, website,
                    fields.tel ? JSON.parse(fields.tel) : null, profile_image?.newFilename || null, card_image?.newFilename || null, description, has_acct)

                //error shd be checked before input
                console.log("insert result: ", result)

                if (result && !result.cardId) {
                    logger.error("create fail - " + result)
                    res.status(406).json({
                        message: 'Error - ' + result
                    })
                    return
                }                

                console.log("profile created ");

                if(has_acct == 'false') {
                    user_id = req.session["user"]?.user_id 
                    await this.userService.setScanCardholder(user_id, result.cardId)
                }

                res.json({
                    data: { firstName: first_name, lastName: last_name, email: email, cardId: result.cardId }
                })
            } catch (error) {
                logger.error('System error - ' + error)
                res.status(500).json({
                    message: 'System error'
                })
            }
        })
    }

    userLogin = async (req: express.Request, res: express.Response) => {
        try {
            console.log("login: ", req.body);

            let { email, password } = req.body

            if (!email || !password) {
                res.status(400).json({
                    error: 'Invalid input'
                });
                return
            }

            if (password.length < 5) {
                res.status(400).json({
                    error: 'Password has to be at least 4 character long.'
                });
                return
            }

            let dbUser = (await this.userService.userLogin(email))[0]
            console.log("Service return user account result: ", dbUser)
            let isMatched = await checkPassword(password, dbUser.password);

            if (!isMatched) {
                res.status(400).json({
                    error: 'Username or password is incorrect.'
                });
                return
            }
            let isVerified = dbUser.verified
            delete dbUser.id
            delete dbUser.password
            delete dbUser.updated_at

            req.session["user"] = dbUser
            console.log("Session info: ", req.session["user"])
            res.json({
                data: { isVerified: isVerified, firstName: dbUser.first_name, lastName: dbUser.last_name }
            })
        } catch (error) {
            logger.error('System error - ' + error)
            res.status(500).json({
                message: 'System error'
            })
        }
    }

    //not yet done
    userLogout = async (req: express.Request, res: express.Response) => {
        try {
            let email = ""
            if (req.session && req.session["user"]) {
                console.log("log out session: ", req.session)                
                removeUserByUserName(req.session["user"].user_id); 
                email = req.session["user"].email
                req.session["user"] = null              
                logger.warn(`${email} logging out`)
            } else {
                res.json({
                    message: `No user session found. Logout successfully`
                })
                return
            }
            res.json({
                message: `${email} logout successfully`
            })
        } catch (error) {
            logger.error('Login out fail - ' + error)
            res.status(500).json({
                message: 'logout fail'
            })
        }
    }

    /*  //after adminguard must have user session
     function tempUser<T>(fn: (req: Request) => T) {
         let user_id = req.session.user?.id || 1
         return user_id
     } */

    updateUserProfile = async (req: express.Request, res: express.Response) => {
        form.parse(req, async (err: any, fields: any, files: formidable.Files) => {
            console.log("Updating user profile: ", {
                err,
                fields,
                files,
            });

            //let profile_file = Array.isArray(files) ? files[0] : files
            let profile_image: formidable.File = files[`profile_image`] as formidable.File;

            console.log("user image: ", profile_image);

            try {
                console.log("update user profile body: ", fields); //req.body.info

                let { first_name, last_name, title, company_name, email, address, website, description, card_id, iconFromDB } = fields //req.body.info

                console.log("check body title: ", title);

                let user_id = req.session["user"]?.user_id //|| "admin#1" //.id || 1

                if (!user_id) {
                    res.status(400).json({
                        message: 'no session found'
                    })
                }

                console.log("check user name: ", user_id);
                let result = await this.userService.updateUserProfile(user_id, first_name, last_name, title, company_name, email, address, website,
                    JSON.parse(fields.tel), profile_image?.newFilename || null, description, card_id, iconFromDB)

                //error shd be checked before input
                // console.log("insert result: ", result)

                if (result) {
                    logger.error("create fail - " + result)
                    res.status(406).json({
                        message: 'Error - ' + result
                    })
                    return
                }

                console.log("profile updated ");
                res.json({
                    data: `User profile updated`
                })
            } catch (error) {
                logger.error('System error - ' + error)
                res.status(500).json({
                    message: 'System error'
                })
            }
        })
    }
    updateCardStyle = async (req: express.Request, res: express.Response) => {
        form.parse(req, async (err: any, fields: any, files: formidable.Files) => {
            try {
                console.log("Updating user profile: ", {
                    err,
                    fields,
                    files,
                });

                let card_format;
                let card_bg;
                let default_image_index;
                let card_id;
                let card_image: formidable.File = files[`ecard_image`] as formidable.File;
                let card_image_name = card_image?.newFilename || null
                if (!card_image)
                    logger.error("No updated image uploaded")

                if (fields.card_format) {
                    card_format = fields.card_format
                    card_bg = fields.card_bg
                    default_image_index = fields.default_image_index
                    card_id = fields.card_id
                } else {
                    default_image_index = fields.default_image_index
                    card_id = fields.card_id
                }

                let user_id = req.session["user"]?.user_id //|| "admin#1" //.id || 1

                if (!user_id) {
                    res.status(400).json({
                        message: 'no session found'
                    })
                }

                console.log("check user name: ", user_id);
                let result = await this.userService.updateCardStyle(user_id, card_format, card_bg, default_image_index, card_image_name, card_id)
                console.log("update card style result: ", result)

                res.json({
                    data: result
                })

                //res.redirect("/pages/me.html")
            } catch (error) {
                logger.error('System error - ' + error)
                res.status(500).json({
                    message: 'System error'
                })
            }
        })
    }
    uploadCard = async (req: express.Request, res: express.Response) => {
        form.parse(req, async (err: any, fields: any, files: formidable.Files) => {
            try {
                console.log("Updating user profile: ", {
                    err,
                    fields,
                    files,
                });

                let card_image: formidable.File = files[`myCard`] as formidable.File;
                let user_id = req.session["user"].user_id //|| "admin#1" //.id

                if (!user_id) {
                    res.status(400).json({
                        message: 'no session found'
                    })
                }
                console.log("check user name: ", user_id);

                let result = await this.userService.uploadCard(user_id, card_image?.newFilename)

                console.log(result + "uploaded card")

                res.json({
                    data: `card uploaded`
                })
            } catch (error) {
                logger.error('System error - ' + error)
                res.status(500).json({
                    message: 'System error'
                })
            }
        })
    }

}