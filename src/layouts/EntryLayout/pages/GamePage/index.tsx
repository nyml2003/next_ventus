import { useApi } from '@/hooks/useApi'
import React, { useState, useEffect } from 'react'
import MazeComponent from './Maze'
import { Button } from '@douyinfe/semi-ui'
import { GetMazeResponse, GetMazeRequest } from '@/hooks/useApi/apis/GetMaze'
import { ApiEnum } from '@/hooks/useApi/apis'

const fetchMaze = async (request: GetMazeRequest): Promise<GetMazeResponse> => {
  const { api } = useApi()
  const res = (await api.request(ApiEnum.GetMaze, request)) as GetMazeResponse
  return res
}

const Maze = () => {
  const [maze, setMaze] = useState<GetMazeResponse | null>(null)
  const [visiualLength, setVisiualLength] = useState<number>(2)
  const [row, setRow] = useState<number>(11)
  const [col, setCol] = useState<number>(11)
  const handleWin = () => {
    setRow(row + 2)
    setCol(col + 2)
  }
  const handleIncreaseVisiualLength = () => {
    setVisiualLength(visiualLength + 1)
  }
  useEffect(() => {
    fetchMaze({ row, col }).then(res => {
      setMaze(res)
    })
  }, [])
  return (
    <>
      <Button onClick={handleWin}>Win</Button>
      <Button onClick={handleIncreaseVisiualLength}>Increase Visiual Length</Button>
      {maze && (
        <MazeComponent
          row={row}
          col={col}
          start={maze.start_pos}
          end={maze.end_pos}
          gameMap={maze.maze}
          visiualLength={visiualLength}
          heroFlag='🐭'
        />
      )}
    </>
  )
}

const GamePage = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-2xl font-bold'>Game Page</h1>
      <Maze />
    </div>
  )
}

export default GamePage
