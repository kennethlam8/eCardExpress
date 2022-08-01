export type Card = {
    id: number;
    user_id: number;
    image: string | null;
    qrcode_image: string;
    first_name: string;
    last_name: string;
    title: string;
    sector: string | null;
    company_name: string;
    address: string | null;
    email: string | null;
    website: string | null;
    created_at: string;
    updated_at: string;
}

export type NewCard = Omit<Card, 'id' | 'created_at' | 'updated_at'>

/* export type CardDetail = {
    cardDetail: {
        id: number;
        user_id: number;
        image: string | null;
        qrcode_image: string;
        first_name: string;
        last_name: string;
        title: string;
        sector: string | null;
        company_name: string;
        address: string | null;
        email: string | null;
        website: string | null;
    },
    telephones: telephone[] | null
}

export type telephone = {
    tel_number: number;
    country_code: number;
    category: string;
} */

/*
export type GetCardDetail = {
  card: MemoDetail
  subscriberList: Subscriber[]
} 
 
export type Subscriber = {
id: number
username: string
}*/