import React, {Component} from 'react'
import {render} from 'react-dom'
import range from 'lodash/range'

const PIECES = {PAWN: 1, ROOK: 2, KNIGHT: 3, BISHOP: 4, QUEEN: 5, KING: 6}
const PLAYERS = {WHITE: 7, BLACK: 8}
const backRow = [PIECES.ROOK, PIECES.KNIGHT, PIECES.BISHOP, PIECES.QUEEN, PIECES.KING, PIECES.BISHOP, PIECES.KNIGHT, PIECES.ROOK]
const initialBoard = [
  backRow.map(piece => ({piece, player: PLAYERS.BLACK})),
  range(8).map(() => ({piece: PIECES.PAWN, player: PLAYERS.BLACK})),
  range(8).map(() => null),
  range(8).map(() => null),
  range(8).map(() => null),
  range(8).map(() => null),
  range(8).map(() => ({piece: PIECES.PAWN, player: PLAYERS.WHITE})),
  backRow.map(piece => ({piece, player: PLAYERS.WHITE}))
]

const tileToUnicode = ({piece, player}) => {
  switch (piece) {
    case PIECES.PAWN: return {[PLAYERS.WHITE]: '♙', [PLAYERS.BLACK]: '♟'}[player]
    case PIECES.ROOK: return {[PLAYERS.WHITE]: '♖', [PLAYERS.BLACK]: '♜'}[player]
    case PIECES.KNIGHT: return {[PLAYERS.WHITE]: '♘', [PLAYERS.BLACK]: '♞'}[player]
    case PIECES.BISHOP: return {[PLAYERS.WHITE]: '♗', [PLAYERS.BLACK]: '♝'}[player]
    case PIECES.QUEEN: return {[PLAYERS.WHITE]: '♕', [PLAYERS.BLACK]: '♛'}[player]
    case PIECES.KING: return {[PLAYERS.WHITE]: '♔', [PLAYERS.BLACK]: '♚'}[player]
    default: throw new Error(`Invalid piece: ${piece}`)
  }
}

const selectedTileMoves = ({x, y}, board) => {
  if (!board[y] || board[y][x] === null) return []
  const {piece, player} = board[y][x]
  const isValidMove = ({x, y}) => x >= 0 && x <= 7 && y >= 0 && y <= 7 && (board[y][x] === null || board[y][x].player !== player)
  const directionMoves = direction => {
    const moves = []
    for (let i = 1; i <= 7 && isValidMove(direction(x, y, i)); i++) {
      moves.push(direction(x, y, i))
      if (board[direction(x, y, i).y][direction(x, y, i).x]) break
    }
    return moves
  }
  const rookMoves = () => [
    ...directionMoves((x, y, i) => ({x: x - i, y})),
    ...directionMoves((x, y, i) => ({x: x + i, y})),
    ...directionMoves((x, y, i) => ({x, y: y - i})),
    ...directionMoves((x, y, i) => ({x, y: y + i}))
  ]
  const bishopMoves = () => [
    ...directionMoves((x, y, i) => ({x: x - i, y: y - i})),
    ...directionMoves((x, y, i) => ({x: x - i, y: y + i})),
    ...directionMoves((x, y, i) => ({x: x + i, y: y - i})),
    ...directionMoves((x, y, i) => ({x: x + i, y: y + i}))
  ]
  const validMoves = (moveOffsets) => {
    return moveOffsets.filter(offset => {
      if (!isValidMove({x: x + offset.x, y: y + offset.y})) {
        return false
      }
      const tile = board[y + offset.y][x + offset.x]
      return tile === null || tile.player !== player
    }).map(offset => ({x: x + offset.x, y: y + offset.y}))
  }
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
      return rookMoves()
    case PIECES.KNIGHT:
      const knightMoves = [{x: -2, y: -1}, {x: -1, y: -2}, {x: 1, y: -2}, {x: 2, y: -1}, {x: 2, y: 1}, {x: 1, y: 2}, {x: -1, y: 2}, {x: -2, y: 1}]
      return validMoves(knightMoves)
    case PIECES.BISHOP:
      return bishopMoves()
    case PIECES.QUEEN:
      return [...rookMoves(), ...bishopMoves()]
    case PIECES.KING:
      const kingMoves = [{x: -1, y: -1}, {x: 0, y: -1}, {x: 1, y: -1}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}, {x: -1, y: 1}, {x: -1, y: 0}]
      return validMoves(kingMoves)
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
                  }}>
                  {tile === null ? '' : tileToUnicode(tile)}
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
