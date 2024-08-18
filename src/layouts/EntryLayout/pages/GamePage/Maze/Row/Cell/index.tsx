import React, { useContext } from 'react'
import { MazeContext } from '../../../contexts'
import { CellSpecial, CellStatus, ICell } from '../../../types'
interface IProps {
  cell: ICell
}

const CellDom: Record<CellStatus, React.ReactNode> = {
  [CellStatus.Passed]: (
    <div>
      <div className='w-8 h-8 bg-gray-400 '></div>
    </div>
  ),
  [CellStatus.Blocked]: (
    <div>
      <div className='w-8 h-8 bg-black '></div>
    </div>
  ),
  [CellStatus.NotVisited]: (
    <div>
      <div className='w-8 h-8 bg-yellow-400 '></div>
    </div>
  ),
}

interface IRenderList {
  callback: () => React.ReactNode
  priority: Priority
}

enum Priority {
  Hero = 100,
  Decoration = 10,
  Normal = 1,
}

const Cell: React.FC<IProps> = (props: IProps) => {
  const { cell } = props
  const { hero, end } = useContext(MazeContext)
  function isHero() {
    return hero.position.equals(cell.coordinate)
  }
  function isEnd() {
    return end.equals(cell.coordinate)
  }
  function isAward() {
    return cell.special === CellSpecial.Award
  }
  const renderList: IRenderList[] = [
    {
      callback: () => isHero() && hero.flag,
      priority: Priority.Hero,
    },
    {
      callback: () => isEnd() && '🚩',
      priority: Priority.Decoration,
    },
    {
      callback: () => isAward() && '💰',
      priority: Priority.Decoration,
    },
  ].sort((a, b) => a.priority - b.priority)
  // CellDom在最底层，然后是isHero和isEnd在上面
  return (
    <div className='relative'>
      <div>{CellDom[cell.status]}</div>
      {/* <div className="absolute top-0 left-0 w-8 h-8 flex items-center justify-center">
				{isHero() && hero.flag}
				{isEnd() && '🚩'}
				{isAward() && '💰'}
			</div> */}
      {renderList.map((item, layer) => {
        return (
          <div
            key={layer}
            className='absolute top-0 left-0 w-8 h-8 flex items-center justify-center'>
            {item.callback()}
          </div>
        )
      })}
    </div>
  )
}

export default Cell
