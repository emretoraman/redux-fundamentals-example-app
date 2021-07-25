import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import store from './store'

import './api/server'
import './index.css'

console.log('Initial state', store.getState())
store.dispatch({ type: 'todos/todoAdded', payload: 'Learn about actions' })
console.log('State after dispatch', store.getState())

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
