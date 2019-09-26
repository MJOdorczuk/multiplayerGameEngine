export const SET_NICK = 'SET_NICK';
export const SET_ID = 'SET_ID';
export const CHOOSE_GAME = 'CHOOSE_GAME';

export class SetNick {
  readonly type = SET_NICK;
  constructor(public payload) {}
}

export class SetId {
  readonly type = SET_ID;
  constructor(public payload) {}
}

export class ChooseGame {
  readonly type = CHOOSE_GAME;
  constructor(public payload) {}
}

export type JoinGameActions = SetNick | SetId | ChooseGame;
