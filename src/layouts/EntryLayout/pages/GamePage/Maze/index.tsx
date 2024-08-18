import React, { useRef, useMemo, useState } from 'react'
import Row from './Row'
import { MazeContext } from '../contexts'
import {
  Direction,
  IHero,
  ICoordinateGrid,
  ICoordinate,
  CellMovability,
  CellStatus,
  CellSpecial,
  ICell,
} from '../types'
import { Toast } from '@douyinfe/semi-ui'
interface IProps {
  row: number
  col: number
  start: [number, number]
  end: [number, number]
  gameMap: number[][]
  heroFlag: string
  visiualLength: number
}

class Cell implements ICell {
  movability: CellMovability
  status: CellStatus
  special: CellSpecial
  coordinate: ICoordinate
  constructor(cell: number, coordinate: ICoordinate, start?: boolean) {
    this.coordinate = coordinate
    this.movability = cell === 1 ? CellMovability.Wall : CellMovability.Empty
    switch (cell) {
      case 1:
        this.status = CellStatus.Blocked
        this.special = CellSpecial.Plain
        break
      case 0:
        this.status = CellStatus.NotVisited
        this.special = CellSpecial.Plain
        break
      case 2:
        this.status = CellStatus.NotVisited
        this.special = CellSpecial.End
        break
      case 3:
        this.status = CellStatus.NotVisited
        this.special = CellSpecial.Award
        break
      default:
        throw new Error('Invalid cell type')
    }
    if (start) {
      this.status = CellStatus.Passed
      this.special = CellSpecial.Start
    }
  }
}

class Coordinate implements ICoordinate {
  x: number
  y: number
  constructor(x: number | [number, number], y?: number) {
    if (Array.isArray(x)) {
      this.x = x[0]
      this.y = x[1]
    } else if (typeof x === 'number' && typeof y === 'number') {
      this.x = x
      this.y = y
    } else {
      throw new Error('Invalid coordinate')
    }
  }
  isValid(coordinateGrid: ICoordinateGrid) {
    return coordinateGrid.include(this) && coordinateGrid.isMoveable(this)
  }
  equals(coordinate: ICoordinate) {
    return this.x === coordinate.x && this.y === coordinate.y
  }
  assign(coordinate: ICoordinate) {
    this.x = coordinate.x
    this.y = coordinate.y
  }
  move(
    coordinateGridState: [ICoordinateGrid, React.Dispatch<React.SetStateAction<ICoordinateGrid>>],
    direction: Direction,
  ) {
    const newCoordinate: ICoordinate = new Coordinate(this.x, this.y)
    const [coordinateGrid, setCoordinateGrid] = coordinateGridState
    switch (direction) {
      case Direction.Up:
        newCoordinate.x--
        break
      case Direction.Down:
        newCoordinate.x++
        break
      case Direction.Left:
        newCoordinate.y--
        break
      case Direction.Right:
        newCoordinate.y++
        break
      default:
        throw new Error('Invalid direction')
    }
    if (!newCoordinate.isValid(coordinateGrid)) {
      if (coordinateGrid.getElement(newCoordinate).movability === CellMovability.Wall) {
        Toast.error('You hit a wall!')
      }
      return
    }
    this.assign(newCoordinate)
    const cell = coordinateGrid.getElement(this)
    if (cell.status === CellStatus.NotVisited) {
      cell.status = CellStatus.Passed
    }
    switch (cell.special) {
      case CellSpecial.End:
        Toast.success('You win!')
        break
      case CellSpecial.Award:
        cell.special = CellSpecial.Plain
        Toast.success('You get an award!')
        break
      case CellSpecial.Trap:
        Toast.error('You hit a trap!')
        break
      case CellSpecial.Plain:
        break
      case CellSpecial.Start:
        Toast.error('You hit the start!')
        break
      default:
        throw new Error('Invalid cell special')
    }
    coordinateGrid.setElement(cell)
    setCoordinateGrid(coordinateGrid)
  }
}
const nullCell: ICell = {
  movability: CellMovability.Empty,
  status: CellStatus.Blocked,
  special: CellSpecial.Plain,
  coordinate: new Coordinate(-1, -1),
}
class CoordinateGrid implements ICoordinateGrid {
  // 默认行优先
  grid: ICell[][]
  rows: number
  cols: number
  constructor(grid: number[][], _rows?: number, _cols?: number, start?: ICoordinate) {
    const rows = _rows || grid.length
    const cols = _cols || grid[0].length
    function isValid() {
      const MIN_ROW = 3 // 行数小于3, 无法构成迷宫
      const MIN_COL = 3 // 列数小于3, 无法构成迷宫
      if (grid.length !== rows) {
        throw new Error('Invalid grid: rows do not match')
      }
      if (rows < MIN_ROW) {
        throw new Error('Invalid grid: rows less than 5')
      }
      if (grid.map(row => row.length).some(col => col !== cols)) {
        throw new Error('Invalid grid: cols do not match')
      }
      if (cols < MIN_COL) {
        throw new Error('Invalid grid: cols less than 5')
      }
      if (rows % 2 === 0 || cols % 2 === 0) {
        throw new Error('Invalid grid: rows and cols must be odd numbers')
      }
      return true
    }
    isValid()
    this.grid = grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        const coordinate = new Coordinate(rowIndex, colIndex)
        return new Cell(cell, coordinate, start?.equals(coordinate))
      }),
    )
    this.rows = rows
    this.cols = cols
  }
  getElement(coordinate: ICoordinate) {
    return this.grid[coordinate.x][coordinate.y]
  }
  setElement(cell: ICell) {
    this.grid[cell.coordinate.x][cell.coordinate.y] = cell
  }
  include(coordinate: ICoordinate) {
    return (
      coordinate.x >= 0 && coordinate.x < this.rows && coordinate.y >= 0 && coordinate.y < this.cols
    )
  }
  isMoveable(coordinate: ICoordinate) {
    const cell = this.getElement(coordinate)
    return (
      this.include(coordinate) &&
      cell.movability === CellMovability.Empty &&
      cell.status !== CellStatus.Blocked
    )
  }
  *[Symbol.iterator]() {
    for (let i = 0; i < this.rows; i++) {
      yield this.grid[i]
    }
  }
  map(callback: (row: ICell[], index: number) => unknown) {
    return Array.from(this).map(callback)
  }
}
const Maze: React.FC<IProps> = (props: IProps) => {
  const { start, end, gameMap, heroFlag, row, col, visiualLength } = props
  const startCoordinate = new Coordinate(start)
  const [coordinateGrid, setCoordinateGrid] = useState<ICoordinateGrid>(
    new CoordinateGrid(gameMap, row, col, startCoordinate),
  )
  const [hero, setHero] = useState<IHero>({
    position: startCoordinate,
    flag: heroFlag,
  })
  // 可视正方形范围
  const actualSquare = [
    hero.position.x - visiualLength,
    hero.position.x + visiualLength,
    hero.position.y - visiualLength,
    hero.position.y + visiualLength,
  ]
  const visualSquare = [
    Math.max(hero.position.x - visiualLength, 0),
    Math.min(hero.position.x + visiualLength, row - 1),
    Math.max(hero.position.y - visiualLength, 0),
    Math.min(hero.position.y + visiualLength, col - 1),
  ] // index 0, 1, 2, 3 分别代表上下左右
  const context = useMemo(
    () => ({ hero, end: new Coordinate(end), visualSquare, actualSquare, nullCell }),
    [hero, end, visualSquare, actualSquare, nullCell],
  )
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const { key } = e
    const position = hero.position
    const newHero = { ...hero }
    switch (key) {
      case 'w':
      case 'ArrowUp':
        position.move([coordinateGrid, setCoordinateGrid], Direction.Up)
        break
      case 's':
      case 'ArrowDown':
        position.move([coordinateGrid, setCoordinateGrid], Direction.Down)
        break
      case 'a':
      case 'ArrowLeft':
        position.move([coordinateGrid, setCoordinateGrid], Direction.Left)
        break
      case 'd':
      case 'ArrowRight':
        position.move([coordinateGrid, setCoordinateGrid], Direction.Right)
        break
      default:
        break
    }
    setHero({ ...newHero, position })
  }
  const mazeRef = useRef<HTMLDivElement>(null) // 创建引用
  function renderCoordinateGrid() {
    const rows: React.ReactNode[] = []
    for (let i = actualSquare[0]; i < 0; i++) {
      rows.push(
        <Row
          key={`row-${i}`}
          cells={Array.from({ length: col }).fill(nullCell) as ICell[]}
          rowIndex={i}
        />,
      )
    }
    for (let i = visualSquare[0]; i <= visualSquare[1]; i++) {
      rows.push(<Row key={`row-${i}`} cells={coordinateGrid.grid[i]} rowIndex={i} />)
    }
    for (let i = row; i <= actualSquare[1]; i++) {
      rows.push(
        <Row
          key={`row-${i}`}
          cells={Array.from({ length: col }).fill(nullCell) as ICell[]}
          rowIndex={i}
        />,
      )
    }
    return rows
  }
  return (
    // 隐藏选中的闪烁的边框
    // web
    <div ref={mazeRef} tabIndex={0} style={{ outline: 'none' }} onKeyDown={handleKeyDown}>
      {/* 无法被选中 */}
      <div style={{ userSelect: 'none' }}>
        <MazeContext.Provider value={context}>{renderCoordinateGrid()}</MazeContext.Provider>
      </div>
    </div>
  )
}

export default Maze
