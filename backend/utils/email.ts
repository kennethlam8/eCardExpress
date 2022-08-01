import nodemailer from "nodemailer";
import handlebars from "handlebars";
import path from "path";
import fs from "fs";
import { EmailOption } from "../models/email";
import { EmailTemplate } from "../enum/email-template";
import { Locale } from "../enum/locale";

//send email to the user

export function sendEmail(emailOptions: EmailOption) {
    const { templateName = EmailTemplate.REGISRATION, locale = Locale.EN_US, email, name, token } = emailOptions;

    const emailTemplateSource = fs.readFileSync(path.resolve(`email-templates/${locale}/${templateName}.hbs`), "utf8");

    const template = handlebars.compile(emailTemplateSource);
    const htmlToSend = template({ token, name });
    let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
            user: "ecardexpress@gmail.com",
            pass: "vgjdsxoinzowjmde",
        },
    });

    let mailOptions = {
        from: "ecardexpress@gmail.com",
        to: email,
        subject: `Verification Code:${token}`,
        html: htmlToSend,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}
