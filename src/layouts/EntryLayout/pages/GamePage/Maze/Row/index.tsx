import React, { useContext } from 'react'
import Cell from './Cell'
import { ICell } from '../../types'
import { MazeContext } from '../../contexts'
interface IProps {
  cells: ICell[] // the values of the row
  rowIndex: number // the index of the row
}
const Row: React.FC<IProps> = (props: IProps) => {
  const { cells, rowIndex } = props
  const context = useContext(MazeContext)
  const { actualSquare, visualSquare, nullCell } = context
  function renderRow() {
    const row: React.ReactNode[] = []
    for (let i = actualSquare[2]; i < 0; i++) {
      row.push(<Cell key={`cell-${rowIndex}-${i}`} cell={nullCell} />)
    }
    for (let i = visualSquare[2]; i <= visualSquare[3]; i++) {
      row.push(<Cell key={`cell-${rowIndex}-${i}`} cell={cells[i]} />)
    }
    for (let i = cells.length; i <= actualSquare[3]; i++) {
      row.push(<Cell key={`cell-${rowIndex}-${i}`} cell={nullCell} />)
    }
    return row
  }
  return <div className='flex flex-row'>{renderRow()}</div>
}

export default Row
