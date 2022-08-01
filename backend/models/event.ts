export type Event = {
    id: number;
    name: string;
    organiser: string;
    start_date: string;
    start_time: string;
    end_time: string;
    event_address?: string;
    estimated_participant?: number;
    banner_image?: string;
    qrcode_image: string;
    invitation_code: string;
    host_id?: string;
    create_at: Date;
    update_at: Date;
};
