export interface EventInfo {
    map(arg0: (event: EventInfo, index: number) => JSX.Element): import("react").ReactNode
    id: number,
    name: string,
    status: string,
    organiser: string,
    start_date: string,
    start_time: string,
    end_time: string,
    event_address?: string | undefined,
    estimated_participant?: number | undefined,
    banner_image?: string,
    invitation_code?: string,
    location?: string,
    description?: string,
    host_id?: number,
    image?: string,
    group_name: string,
    start_date_time: string,
    end_date_time: string
}

export interface IEventState {
    events: EventInfo[]
}