import { Middleware } from 'redux';

export const gameRequestMiddleware: Middleware = (store: any) => {
  return next => action => {
    if ( action.meta && action.meta.isGameRequest ) {
      const game = store.getState().game
      if( game && game.id ) {
        action.payload.gameId = game.id;
      }
    }
    return next(action);
  }
}