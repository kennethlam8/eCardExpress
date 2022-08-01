import { Telephones } from "../userInfo/state"

export interface CardInfo {
    map(arg0: (event: CardInfo, index: number) => JSX.Element): import("react").ReactNode
    //user_id?: string,
    card_stored?: string,
    card_id?: string,
    first_name: string,
    last_name: string,
    title?: string,
    sector?: string,
    company_name?: string,
    address?: string,
    email?: string,
    website?: string,
    created_at: string,
    image_format: string,
    image_bg: string,
    profile_pic?: string,
    default_image_index: string,
    updated_items?: string[],
    card_image?: string,
    start_date?: string,
    end_time?: string,
    start_date_time?: string,
    location?: string,
    telephones: Array<Telephones>,
}

export interface CardState {
    cards: CardInfo[]
}