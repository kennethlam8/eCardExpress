import express from "express";
import { UserController } from '../controllers/user-controller'
import { UserService } from '../services/userServices'
import { Knex } from "knex";
import { userGuardAPI } from "../utils/guard";


export function createUserRoutes(userController: UserController) {
    let userRoutes = express.Router();

    userRoutes.get("/login/google", userController.googleLogin);
    userRoutes.get('/get-register',userGuardAPI, userController.getUserSession)
    userRoutes.get('/login/google', userController.googleLogin)
    // userRoutes.get('/me', userController.getMe)
    userRoutes.get('/resend-email', userController.resendEmail)
    userRoutes.get("/confirmation/:email/t/:token", userController.emailVerify);
    userRoutes.patch('/update-card-style',userGuardAPI, userController.updateCardStyle);
    userRoutes.patch('/upload-card',userGuardAPI, userController.uploadCard)
    userRoutes.post('/me',userGuardAPI, userController.getMe);
    
    userRoutes.post('/loginByEmail', userController.userLoginByEmail)

    userRoutes.post('/checkEmail', userController.checkEmail)
    userRoutes.post('/user', userController.createUser) //createUser
    userRoutes.post('/userProfile',userGuardAPI, userController.createUserProfile) //createUserProfile
    userRoutes.patch('/userProfile',userGuardAPI, userController.updateUserProfile) //updateUserProfile
    userRoutes.post('/login', userController.userLogin)
    userRoutes.post('/logout', userController.userLogout)
    return userRoutes
}