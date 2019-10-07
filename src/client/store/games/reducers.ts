import * as GamesActions from './actions';
import { initialState, GamesState } from './state';

export function gamesReducer(
  state: GamesState = initialState,
  { type, payload }: { type: string; payload: any },
) {
  switch (type) {
    case GamesActions.ADD_GAME:
      return {
        ...state,
        list: [...state.list, payload],
        roomName: '',
      };

    case GamesActions.SET_GAME_NAME:
      return {
        ...state,
        roomName: payload,
      };

    case GamesActions.SET_GAME_TYPE:
      return {
        ...state,
        type: payload,
      };

    case GamesActions.SET_GAME_MAP:
      return {
        ...state,
        map: payload,
      };

    case GamesActions.CLEAR_GAMES_LIST:
      return {
        ...state,
        list: [],
      };
    default:
      return state;
  }
}