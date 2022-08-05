export const GAP = 90

export const KeyPointPos = Object.freeze({
  x: 100, //[0,130]
  y: 0
})

export enum GameState {
  Unknown = 'Unknown',
  Start = 'Start',
  Action = 'Action',
  PreLose = ' PreLose',
  Lose = 'Lose'
}
