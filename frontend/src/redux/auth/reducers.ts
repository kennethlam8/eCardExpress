import { createReducer } from "@reduxjs/toolkit";
import { checkUserEmail, checkUserPassword, emailVerify, userRegister } from "./thunks";
import { UserStatus } from "./state";

const initialState: UserStatus = {
    email: "",
    firstName: "",
    lastName: "",
    isRegistered: false,
    isLoggedIn: false,
    isVerified: false,
}

const authReducer = createReducer(initialState, (build) => {
    build.addCase(checkUserEmail.fulfilled, (state, action) => {
        // state={...initialState}
        state.isRegistered = action.payload.isRegistered
        state.email = action.payload.email
        state.isVerified = action.payload.isVerified
        state.isLoggedIn = false
        state.lastName = ""
        state.firstName = ""
    });
    build.addCase(checkUserPassword.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isVerified
        state.isVerified = action.payload.isVerified
        state.lastName = action.payload.lastName
        state.firstName = action.payload.firstName
    });
    build.addCase(userRegister.fulfilled, (state, action) => {
        state.lastName = action.payload.lastName
        state.firstName = action.payload.firstName
    })
    build.addCase(emailVerify.fulfilled, (state, action) => {
        state = { ...state }
        state.isLoggedIn = action.payload.isVerified
        state.isVerified = action.payload.isVerified
    });
});

export default authReducer;