export interface UserInfo {
    userId: string,
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

export interface Telephones{
    card_id:string,
    tel_number: string,
    country_code: string,
    category: string,
}