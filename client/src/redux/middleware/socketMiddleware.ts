import { Middleware } from 'redux';
import {MiddlewareOptions} from "redux-socket.io";
import {Action} from "typesafe-actions/dist/type-helpers";


export default (socket: SocketIOClient.Socket, listeners: Array<string> ) : Middleware => (store : any) => {
    for(const listener of listeners) {
        socket.on( listener, ( data:any ) => {
            const action = {
                type: listener,
                data
            }
            store.dispatch(action);
        } );
    }

    return next => action => {
        if ( action.meta && action.meta.remote ) {
            socket.emit(action.type, action.payload);
        }
        return next(action);
    }
}