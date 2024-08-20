import React, { useState, useEffect, useCallback } from 'react'
import './index.less'
import { Card } from '@douyinfe/semi-ui'

const TypingEffect = ({
  text,
  status,
}: {
  text: string
  status: 'doing' | 'rollback' | 'done'
}) => {
  const [displayedText, setDisplayedText] = useState('')
  const [index, setIndex] = useState(0)

  const updateText = useCallback(() => {
    if (status === 'doing' && index < text.length) {
      setDisplayedText(prev => prev + text[index])
      setIndex(prev => prev + 1)
    } else if (status === 'rollback' && index > 0) {
      setDisplayedText(prev => prev.slice(0, -1))
      setIndex(prev => prev - 1)
    }
  }, [index, text, status])

  useEffect(() => {
    const timeoutId = setTimeout(updateText, 110)
    return () => clearTimeout(timeoutId)
  }, [updateText])

  return <div className='multiline text typing-effect'>{displayedText}</div>
}

const TestPage = () => {
  const text = `"博客框架（前端+后端一个前后端兼具的基础博客框架，要求能够正常部署，简单易一个前后端兼具的基础博客框架，要求能够正常部署，简单易一个前后端兼具的基础博客框架，要求能够正常部署，简单易一个前后端兼具的基础博客框架，要求能够正常部署，简单易一个前后端兼具的基础博客框架，要求能够正常部署，简单易一个前后端兼具的基础博客框架，要求能够正常部署，简单易\r\n完成一个前后端兼具的基础博客框架，要求能够正常部署，简单易用且功能完备。\r\n\r\n不得使用任何现成的博客框架与一键搭建脚本等，代码应完全由自主编写。可以使用开发框架（Vue/React/Spring/Servlet等）。"`
  const [status, setStatus] = useState<'doing' | 'rollback' | 'done'>('done')

  const handleMouseEnter = useCallback(() => {
    setStatus('doing')
  }, [])

  const handleMouseLeave = useCallback(() => {
    setStatus('rollback')
  }, [])

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className='w-[200px] select-none'>
      <Card
        shadows='hover'
        header={<TypingEffect text={text} status={status} />}
        className='typing-card'></Card>
    </div>
  )
}

export default TestPage
