import React, { useState, useEffect, useRef, PureComponent } from 'react'
import './index.less'
import { Card } from '@douyinfe/semi-ui'
import { CardProps } from '@douyinfe/semi-ui/lib/es/card'

const TypingEffect = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [index, setIndex] = useState(0)
  const [status, setStatus] = useState<'doing' | 'rollback' | 'done'>('doing')

  useEffect(() => {
    if (status === 'doing' && index < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText(prev => prev + text[index])
        setIndex(prev => prev + 1)
      }, 100) // 每100毫秒添加一个字符
      return () => clearTimeout(timeoutId)
    } else if (status === 'rollback' && index > 0) {
      const timeoutId = setTimeout(() => {
        setDisplayedText(prev => prev.slice(0, -1))
        setIndex(prev => prev - 1)
      }, 100) // 每100毫秒删除一个字符
      return () => clearTimeout(timeoutId)
    } else if (index === text.length) {
      setStatus('done')
    }
  }, [index, text, status])

  return <div className='multiline text typing-effect'>{displayedText}</div>
}

const App = () => {
  const text = `"博客框架（前端+后端）\r\n完成一个前后端兼具的基础博客框架，要求能够正常部署，简单易用且功能完备。\r\n\r\n不得使用任何现成的博客框架与一键搭建脚本等，代码应完全由自主编写。可以使用开发框架（Vue/React/Spring/Servlet等）。"`
  const CardRef = useRef<PureComponent<CardProps>>(null)
  return (
    <Card
      shadows='hover'
      header={<TypingEffect text={text} />}
      className='typing-card'
      ref={CardRef}></Card>
  )
}

export default App
