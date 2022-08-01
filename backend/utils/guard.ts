import express from 'express'
import { Request, Response, NextFunction } from "express";

export let userGuard = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.session?.['username']) {
        next();
    } else {
        res.status(401).end("This resources is only accessible by admin");
        // res.end('')
    }
};

export async function userGuardAPI(req: Request, res: Response, next: NextFunction) {
    if (!req.session || !req.session['user']){
        res.status(500).json({ error: "No session found" })
        return
    }/* else if(req.session['user']["verified"] == false){
        //res.status(403).redirect('/pages/login-page4.html')
        res.status(403).json({ error: "this account has not been verified" })
        return
    } */
    next()
}