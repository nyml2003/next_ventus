import { createContext } from 'react'
import { ICoordinate, IHero, ICell } from '../types'

export interface IContext {
  hero: IHero
  end: ICoordinate
  visualSquare: number[]
  actualSquare: number[]
  nullCell: ICell
}

export const MazeContext = createContext<IContext>({} as IContext)
