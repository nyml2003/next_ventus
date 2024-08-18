import { Dispatch, SetStateAction } from 'react'

export enum CellMovability {
	Wall = 1, // 墙
	Empty = 0, // 空地
}

export enum CellStatus {
	Passed = 'passed', // 对应颜色为灰色, 也就是走过的路
	Blocked = 'blocked', // 对应颜色为黑色, 也就是墙
	NotVisited = 'notVisited', // 对应颜色为黄色, 也就是未走过的路
}

export enum CellSpecial {
	Start = 'start', // 起点
	End = 'end', // 终点
	Award = 'award', // 奖励
	Trap = 'trap', // 陷阱
	Plain = 'plain', // 普通
}

export interface ICell {
	movability: CellMovability
	status: CellStatus
	special: CellSpecial
	coordinate: ICoordinate
}

export enum Direction {
	Up = 'up',
	Down = 'down',
	Left = 'left',
	Right = 'right',
}

export interface ICoordinate {
	x: number
	y: number
	isValid(coordinateGrid: ICoordinateGrid): boolean
	equals(coordinate: ICoordinate): boolean
	assign(coordinate: ICoordinate): void
	/**
	 *
	 * @param coordinateGridState 坐标所在的二维数组的状态
	 * @param direction 移动的方向
	 */
	move(
		coordinateGridState: [ICoordinateGrid, Dispatch<SetStateAction<ICoordinateGrid>>],
		direction: Direction,
	): void
}

export interface ICoordinateGrid {
	grid: ICell[][]
	rows: number
	cols: number
	getElement(coordinate: ICoordinate): ICell
	setElement(cell: ICell): void
	include(coordinate: ICoordinate): boolean
	isMoveable(coordinate: ICoordinate): boolean
	[Symbol.iterator](): IterableIterator<ICell[]>
	map(callback: (row: ICell[], index: number) => unknown): unknown[]
}

export interface IHero {
	position: ICoordinate
	flag: string | React.ReactNode
}
