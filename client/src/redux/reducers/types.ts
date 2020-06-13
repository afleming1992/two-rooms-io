export interface PlayerState {
    connected: boolean
    joining: boolean
    inGame: boolean
    gameToken: string | undefined
    userToken: string | undefined
}