import { createReducer } from "@reduxjs/toolkit";
// import { createCard } from "./action";
// import { } from "./thunks";
import { UserInfo } from "./state";
import { getMyInfo, logOut, updateCardStyle, createUserProfile } from "./thunks";

const initialState: UserInfo = {
    userId: "",
    name: "",
    firstName: "",
    lastName: "",
    email: "",
    title: "",
    telephones: [],
    company: "",
    address: "",
    website: "",
    imageFormat: "",
    imageBg: "",
    cardImage: "",
    defaultImageIndex: "",
    description: "",
    profilePic: "",
    cardId: "",
}

const userInfoReducer = createReducer(initialState, (build) => {
    build.addCase(getMyInfo.fulfilled, (state, action) => {
        state.userId = action.payload.userDetail.user_id;
        state.firstName = action.payload.cardDetail.first_name
        state.lastName = action.payload.cardDetail.last_name
        state.name = action.payload.cardDetail.first_name + " " + action.payload.cardDetail.last_name
        state.email = action.payload.cardDetail.email
        state.cardId = action.payload.cardDetail.card_id
        state.title = action.payload.cardDetail.title ? action.payload.cardDetail.title : ""
        state.company = action.payload.cardDetail.company_name ? action.payload.cardDetail.company_name : ""
        state.address = action.payload.cardDetail.address ? action.payload.cardDetail.address : ""
        state.website = action.payload.cardDetail.website ? action.payload.cardDetail.website : ""
        state.imageFormat = action.payload.cardDetail.image_format ? action.payload.cardDetail.image_format : ""
        state.imageBg = action.payload.cardDetail.image_bg ? action.payload.cardDetail.image_bg : ""
        state.cardImage = action.payload.cardDetail.card_image ? action.payload.cardDetail.card_image : ""
        state.defaultImageIndex = action.payload.cardDetail.default_image_index
        state.telephones = action.payload.telephones ? action.payload.telephones : []
        state.description = action.payload.userDetail.description ? `${action.payload.userDetail.description}` : ""
        state.profilePic = action.payload.userDetail.profile_pic ? action.payload.userDetail.profile_pic : ""
    });
    build.addCase(logOut.fulfilled, (state, action) => {
        if (action.payload == `${state.email} logout successfully`) {
            state.userId = ""
            state.name = ""
            state.firstName = ""
            state.lastName = ""
            state.email = ""
            state.title = ""
            state.company = ""
            state.address = ""
            state.website = ""
            state.imageFormat = ""
            state.imageBg = ""
            state.cardImage = ""
            state.defaultImageIndex = ""
            state.telephones = []
            state.description = ""
            state.profilePic = ""
            state.cardId = ""
        }
    })
    build.addCase(updateCardStyle.fulfilled, (state, action) => {
        state.imageFormat = action.payload.image_format
        state.imageBg = action.payload.image_bg
        state.defaultImageIndex = action.payload.default_image_index
        state.cardImage = action.payload.card_image ? action.payload.card_image : ""
    })
    build.addCase(createUserProfile.fulfilled, (state, action) => {
        state.userId = ""
        state.name = action.payload.firstName + " " + action.payload.lastName
        state.firstName = action.payload.firstName
        state.lastName = action.payload.lastName
        state.email = action.payload.email
        state.cardId = action.payload.cardId
        state.title = ""
        state.company = ""
        state.address = ""
        state.website = ""
        state.imageFormat = "1"
        state.imageBg = "1"
        state.cardImage = ""
        state.defaultImageIndex = "1"
        state.telephones = []
        state.description = ""
        state.profilePic = ""
    })
})


export default userInfoReducer;