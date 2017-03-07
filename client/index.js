import React, {Component} from 'react'
import {render} from 'react-dom'

const PIECES = {PAWN: 1, ROOK: 2, KNIGHT: 3, BISHOP: 4, QUEEN: 5, KING: 6}
const PLAYERS = {WHITE: 1, BLACK: 2}

const range = (lo, hi) => Array.from({length: hi - lo}, (_, i) => lo + i)

const initialBoard = [
  [PIECES.ROOK, PIECES.KNIGHT, PIECES.BISHOP, PIECES.QUEEN, PIECES.KING, PIECES.BISHOP, PIECES.KNIGHT, PIECES.ROOK].map(piece => ({piece, player: PLAYERS.BLACK})),
  range(0, 8).map(() => ({piece: PIECES.PAWN, player: PLAYERS.BLACK})),
  range(0, 8).map(() => null),
  range(0, 8).map(() => null),
  range(0, 8).map(() => null),
  range(0, 8).map(() => null),
  range(0, 8).map(() => ({piece: PIECES.PAWN, player: PLAYERS.WHITE})),
  [PIECES.ROOK, PIECES.KNIGHT, PIECES.BISHOP, PIECES.KING, PIECES.QUEEN, PIECES.BISHOP, PIECES.KNIGHT, PIECES.ROOK].map(piece => ({piece, player: PLAYERS.WHITE}))
]

const tileToUnicode = ({piece, player}) => {
  switch (piece) {
    case PIECES.PAWN:
      return player === PLAYERS.WHITE ? '♙' : '♟'
    case PIECES.ROOK:
      return player === PLAYERS.WHITE ? '♖' : '♜'
    case PIECES.KNIGHT:
      return player === PLAYERS.WHITE ? '♘' : '♞'
    case PIECES.BISHOP:
      return player === PLAYERS.WHITE ? '♗' : '♝'
    case PIECES.QUEEN:
      return player === PLAYERS.WHITE ? '♕' : '♛'
    case PIECES.KING:
      return player === PLAYERS.WHITE ? '♔' : '♚'
    default:
      throw new Error(`Invalid piece: ${piece}`)
  }
}

const selectTile = (selection) => () => ({tileSelected: selection})

class Chess extends Component {
  constructor() {
    super()
    this.state = {
      board: initialBoard, // [{piece, player} | null]
      playerTurn: PLAYERS.WHITE, // player
      tileSelected: {x: -1, y: -1}, // {x: int, y: int}
      gameover: false // bool
    }
  }

  render() {
    const {board, tileSelected} = this.state
    return (
      <div>
        {board.map((row, y) =>
          <div key={y} style={{display: 'flex'}}>
            {row.map((tile, x) => {
              const backgroundColor =
                x === tileSelected.x && y === tileSelected.y ? 'skyblue' :
                (x + y) % 2 === 0 ? '#eee' : '#444'
              return (
                <div key={x}
                  onClick={() => this.setState(selectTile({x, y}))}
                  style={{
                    backgroundColor,
                    width: 50,
                    height: 50,
                    fontSize: 32,
                    textAlign: 'center',
                    // This makes the '.' invisible. The reason why we use '.'
                    // for blank tiles is so the tile styling will be applied.
                    color: tile === null ? backgroundColor : ''
                  }}>
                  {tile === null ? '.' : tileToUnicode(tile)}
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }
}

render(<Chess />, document.querySelector('#root'))
