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

const selectedTileMoves = ({x, y}, board) => {
  if (!board[y] || board[y][x] === null) return []
  const {piece, player} = board[y][x]
  switch (piece) {
    case PIECES.PAWN:
      if (player === PLAYERS.WHITE) {
        const moves = []
        for (let i = 1; i <= 2 && y - i >= 0 && !board[y - i][x]; i++) {
          moves.push({x, y: y - i})
        }
        if (y - 1 >= 0 && x - 1 >= 0 && board[y - 1][x - 1] && board[y - 1][x - 1].player === PLAYERS.BLACK) {
          moves.push({x: x - 1, y: y - 1})
        }
        if (y - 1 >= 0 && x + 1 < 8 && board[y - 1][x + 1] && board[y - 1][x + 1].player === PLAYERS.BLACK) {
          moves.push({x: x + 1, y: y - 1})
        }
        return moves
      } else {
        const moves = []
        for (let i = 1; i <= 2 && y + i < 8 && !board[y + i][x]; i++) {
          moves.push({x, y: y + i})
        }
        if (y + 1 < 8 && x - 1 >= 0 && board[y + 1][x - 1] && board[y + 1][x - 1].player === PLAYERS.WHITE) {
          moves.push({x: x - 1, y: y + 1})
        }
        if (y + 1 < 8 && x + 1 < 8 && board[y + 1][x + 1] && board[y + 1][x + 1].player === PLAYERS.WHITE) {
          moves.push({x: x + 1, y: y + 1})
        }
        return moves
      }
    case PIECES.ROOK:
      {
        const moves = []
        // top
        for (let i = 1; i <= 7 && y - i >= 0 && (board[y - i][x] === null || board[y - i][x].player !== player); i++) {
          moves.push({x, y: y - i})
          if (board[y - i][x]) break
        }
        // bottom
        for (let i = 1; i <= 7 && y + i < 8 && (board[y + i][x] === null || board[y + i][x].player !== player); i++) {
          moves.push({x, y: y + i})
          if (board[y + i][x]) break
        }
        // left
        for (let i = 1; i <= 7 && x - i >= 0 && (board[y][x - i] === null || board[y][x - i].player !== player); i++) {
          moves.push({x: x - i, y})
          if (board[y][x - i]) break
        }
        // right
        for (let i = 1; i <= 7 && x + i < 8 && (board[y][x + i] === null || board[y][x + i].player !== player); i++) {
          moves.push({x: x + i, y})
          if (board[y][x + i]) break
        }
        return moves
      }
    case PIECES.KNIGHT:
      {
        const knightMoves = [
          {x: -2, y: -1},
          {x: -1, y: -2},
          {x: 1, y: -2},
          {x: 2, y: -1},
          {x: 2, y: 1},
          {x: 1, y: 2},
          {x: -1, y: 2},
          {x: -2, y: 1}
        ]
        return knightMoves.filter(offset => {
          if (y + offset.y >= 8 || y + offset.y < 0 || x + offset.x >= 8 || x + offset.x < 0) {
            return false
          }
          const tile = board[y + offset.y][x + offset.x]
          return tile === null || tile.player !== player
        }).map(offset => ({
          x: x + offset.x,
          y: y + offset.y
        }))
      }
    case PIECES.BISHOP:
      {
        const moves = []
        // top-left
        for (let i = 1; i <= 7 && x - i >= 0 && y - i >= 0 && (board[y - i][x - i] === null || board[y - i][x - i].player !== player); i++) {
          moves.push({x: x - i, y: y - i})
          if (board[y - i][x - i]) break
        }
        // top-right
        for (let i = 1; i <= 7 && x + i < 8 && y - i >= 0 && (board[y - i][x + i] === null || board[y - i][x + i].player !== player); i++) {
          moves.push({x: x + i, y: y - i})
          if (board[y - i][x + i]) break
        }
        // bottom-left
        for (let i = 1; i <= 7 && x - i >= 0 && y + i < 8 && (board[y + i][x - i] === null || board[y + i][x - i].player !== player); i++) {
          moves.push({x: x - i, y: y + i})
          if (board[y + i][x - i]) break
        }
        // bottom-right
        for (let i = 1; i <= 7 && x + i < 8 && y + i < 8 && (board[y + i][x + i] === null || board[y + i][x + i].player !== player); i++) {
          moves.push({x: x + i, y: y + i})
          if (board[y + i][x + i]) break
        }
        return moves
      }
    case PIECES.QUEEN:
      {
        const moves = []
        // top
        for (let i = 1; i <= 7 && y - i >= 0 && (board[y - i][x] === null || board[y - i][x].player !== player); i++) {
          moves.push({x, y: y - i})
          if (board[y - i][x]) break
        }
        // bottom
        for (let i = 1; i <= 7 && y + i < 8 && (board[y + i][x] === null || board[y + i][x].player !== player); i++) {
          moves.push({x, y: y + i})
          if (board[y + i][x]) break
        }
        // left
        for (let i = 1; i <= 7 && x - i >= 0 && (board[y][x - i] === null || board[y][x - i].player !== player); i++) {
          moves.push({x: x - i, y})
          if (board[y][x - i]) break
        }
        // right
        for (let i = 1; i <= 7 && x + i < 8 && (board[y][x + i] === null || board[y][x + i].player !== player); i++) {
          moves.push({x: x + i, y})
          if (board[y][x + i]) break
        }
        // top-left
        for (let i = 1; i <= 7 && x - i >= 0 && y - i >= 0 && (board[y - i][x - i] === null || board[y - i][x - i].player !== player); i++) {
          moves.push({x: x - i, y: y - i})
          if (board[y - i][x - i]) break
        }
        // top-right
        for (let i = 1; i <= 7 && x + i < 8 && y - i >= 0 && (board[y - i][x + i] === null || board[y - i][x + i].player !== player); i++) {
          moves.push({x: x + i, y: y - i})
          if (board[y - i][x + i]) break
        }
        // bottom-left
        for (let i = 1; i <= 7 && x - i >= 0 && y + i < 8 && (board[y + i][x - i] === null || board[y + i][x - i].player !== player); i++) {
          moves.push({x: x - i, y: y + i})
          if (board[y + i][x - i]) break
        }
        // bottom-right
        for (let i = 1; i <= 7 && x + i < 8 && y + i < 8 && (board[y + i][x + i] === null || board[y + i][x + i].player !== player); i++) {
          moves.push({x: x + i, y: y + i})
          if (board[y + i][x + i]) break
        }
        return moves
      }
    case PIECES.KING:
      {
        const kingMoves = [
          {x: -1, y: -1},
          {x: 0, y: -1},
          {x: 1, y: -1},
          {x: 1, y: 0},
          {x: 1, y: 1},
          {x: 0, y: 1},
          {x: -1, y: 1},
          {x: -1, y: 0}
        ]
        return kingMoves.filter(offset => {
          if (y + offset.y >= 8 || y + offset.y < 0 || x + offset.x >= 8 || x + offset.x < 0) {
            return false
          }
          const tile = board[y + offset.y][x + offset.x]
          return tile === null || tile.player !== player
        }).map(offset => ({
          x: x + offset.x,
          y: y + offset.y
        }))
      }
    default:
      throw new Error(`Invalid piece: ${piece}`)
  }
}

const selectTile = (selection) => () => ({tileSelected: selection})

const movePiece = destination => ({board, tileSelected, playerTurn}) => ({
  tileSelected: {x: -1, y: -1},
  playerTurn: playerTurn === PLAYERS.WHITE ? PLAYERS.BLACK : PLAYERS.WHITE,
  board: board.map((row, y) =>
    row.map((tile, x) => 
      x === destination.x && y === destination.y ? board[tileSelected.y][tileSelected.x] :
      x === tileSelected.x && y === tileSelected.y ? null :
      tile
    )
  ),
  gameover: board[destination.y][destination.x] &&
    board[destination.y][destination.x].piece === PIECES.KING
})

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
    const {board, tileSelected, playerTurn, gameover} = this.state
    const tileMoves = selectedTileMoves(tileSelected, board)
    return (
      <div>
        <div>
          {gameover ? 
            `${playerTurn === PLAYERS.WHITE ? 'Black' : 'White'} wins!` :
            `${playerTurn === PLAYERS.WHITE ? 'White' : 'Black'}'s turn`}
        </div>
        {board.map((row, y) =>
          <div key={y} style={{display: 'flex'}}>
            {row.map((tile, x) => {
              const backgroundColor =
                x === tileSelected.x && y === tileSelected.y ? 'skyblue' :
                tileMoves.some(tileMove => tileMove.x === x && tileMove.y === y) ? 'dodgerblue' :
                (x + y) % 2 === 0 ? '#eee' : '#444'
              return (
                <div key={x}
                  onClick={() => {
                    if (!gameover) {
                      const tileThatIsCurrentlySelected = board[tileSelected.y] && board[tileSelected.y][tileSelected.x]
                      const isPossibleMove = tileMoves.some(move => move.x === x && move.y === y)
                      if (tileThatIsCurrentlySelected && tileThatIsCurrentlySelected.player === playerTurn && isPossibleMove) {
                        this.setState(movePiece({x, y}))
                      } else {
                        this.setState(selectTile({x, y}))
                      }
                    }
                  }}
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
