import { Telephones } from "../userInfo/state";

export interface UserSocketInfo {
    requestReceived: boolean,
    socketUserId: string,
}

export interface UserAllCard {
    cards: Array<Card>
}

export interface Card {
    first_name: string,
    last_name: string,
    title: string,
    company_name: string,
    address: string,
    default_image_index: string,
    email: string,
    website: string,
    image_format: string,
    image_bg: string,
    profile_pic: string,
    card_image: string,
    card_id: string,
    tel_number: string,
    country_code: string,
    category: string,
    created_at:string,
}

export interface CardDetail{
    name: string,
    firstName: string,
    lastName: string,
    email: string,
    title: string,
    telephones: Array<Telephones>,
    company: string,
    address: string,
    website: string,
    imageFormat: string,
    imageBg: string,
    cardImage: string,
    defaultImageIndex: string,
    description: string,
    profilePic: string,
    cardId:string,
}