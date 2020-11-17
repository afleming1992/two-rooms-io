import { Middleware } from 'redux';

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