import React, { useState, useEffect, useCallback } from 'react'
import './typewriter.less'
const TypingWriter = ({
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
    const timeoutId = setTimeout(updateText, 100)
    return () => clearTimeout(timeoutId)
  }, [updateText])

  return <div className='multiline text typing-effect select-none'>{displayedText}</div>
}

export default TypingWriter
