export enum CardShareType {
    COLOUR = "COLOUR",
    ROLE = "ROLE"
}

export interface CardShareRequest {
    id: string | undefined,
    type: CardShareType,
    requestor: string,
    recipient: string
}