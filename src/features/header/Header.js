import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { saveNewTodo } from '../todos/todosSlice'

const Header = () => {
  const [text, setText] = useState('')
  const [status, setStatus] = useState('idle')
  const dispatch = useDispatch()

  const handleChange = (e) => setText(e.target.value)

  const handleKeyDown = async (e) => {
    const trimmedText = e.target.value.trim()
    if (e.key === 'Enter' && trimmedText) {
      setStatus('loading')
      await dispatch(saveNewTodo(trimmedText))
      setText('')
      setStatus('idle')
    }
  }

  const isLoading = status === 'loading'
  const placeholder = isLoading ? '' : 'What needs to be done?'
  const loader = isLoading ? (<div className="loader" />) : null

  return (
    <header className="header">
      <input
        className="new-todo"
        placeholder={placeholder}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      {loader}
    </header>
  )
}

export default Header