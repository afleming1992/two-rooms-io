
export type RootState = {
    readonly game: GameState | undefined,
    readonly player: PlayerState,
    readonly role: RoleState | undefined,
    readonly timer: TimerState | undefined,
};

export interface GameState {

}

export interface PlayerState {
    joining: boolean
}

export interface RoleState {

}

export interface TimerState {

}

export const initialState: RootState = {
    player: {
        joining: false
    },
    game: undefined,
    role: undefined,
    timer: undefined
}



