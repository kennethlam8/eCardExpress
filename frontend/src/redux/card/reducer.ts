import { createReducer } from "@reduxjs/toolkit";
import { CardDetail, UserAllCard, UserSocketInfo} from "./state";
import { receiveNotification, setSocketUserId } from "./action";
import { getAllCard, getCardByID } from "./thunks";
const initialState: UserSocketInfo = {
    requestReceived: false,
    socketUserId: ''
}

const initialState2: UserAllCard = {
    cards:[]
}

const initialState3: CardDetail = {
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

const cardRequestReducer = createReducer(initialState, (build) => {
    build.addCase(receiveNotification, (state, action) => {
        state.requestReceived = action.payload.requestReceived;
    })
    build.addCase(setSocketUserId, (state, action) => {
        state.socketUserId = action.payload.socketUserId;
    })
})

const allCardReducer = createReducer(initialState2, (build) => {
    build.addCase(getAllCard.fulfilled, (state, action) => {
        state.cards = action.payload
    })

})

const cardDetailReducer = createReducer(initialState3, (build) => {
    build.addCase(getCardByID.fulfilled, (state, action) => {
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
    })
})

export {cardRequestReducer, cardDetailReducer, allCardReducer}