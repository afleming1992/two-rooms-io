import {Dispatch} from "redux";
import SocketIOClient  from 'socket.io-client';

export const reloadGameSession = (socket:SocketIOClient.Socket, gameToken:string, playerToken: string) => {
    return (dispatch: Dispatch) => {
        let request = {
            "gameToken": gameToken,
            "playerToken": playerToken
        }
        socket.emit("RELOAD_GAME_SESSION", request);
    }
}

export const joinGame = (socket:SocketIOClient.Socket, name: string) => {
    return (dispatch: Dispatch) => {
        let request = {
            "name": name
        }
        socket.emit("JOIN_GAME", request);
    }
}

export const nextRound = (socket:SocketIOClient.Socket) => {
    return (dispatch: Dispatch) => {
        socket.emit("NEXT_ROUND");
    }
}

export const startTimer = (socket:SocketIOClient.Socket) => {
    return (dispatch: Dispatch) => {
        socket.emit("START_TIMER");
    }
}

export const pauseTimer = (socket:SocketIOClient.Socket) => {
    return (dispatch: Dispatch) => {
        socket.emit("PAUSE_TIMER");
    }
}