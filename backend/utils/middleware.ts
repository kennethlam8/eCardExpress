import grant from 'grant'
import expressSession from "express-session";
import env from './env';
export const grantExpress = grant.express({
    "defaults":{
        "origin": `http://localhost:${env.SERVER_PORT}`,
        "transport": "session",
        "state": true,
    },
    "google":{
        "key":env.GOOGLE_CLIENT_ID,
        "secret": env.GOOGLE_CLIENT_SECRET,
        "scope": ["profile","email"],
        "callback": "/login/google"
    }
});

export let expressSessionMiddleware = expressSession({
    secret: env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
})