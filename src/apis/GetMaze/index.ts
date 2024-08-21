export interface GetMazeRequest {
  row: number
  col: number
}

export interface GetMazeResponse {
  message: string
  maze: number[][]
  start_pos: [number, number]
  end_pos: [number, number]
  row: number
  col: number
}
