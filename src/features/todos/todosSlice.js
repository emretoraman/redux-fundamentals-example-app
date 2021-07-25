import { client } from '../../api/client'

const initialState = []

const todosReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'todos/todoAdded': {
            return [...state, action.payload]
        }
        case 'todos/todoToggled': {
            return state.map(todo => {
                if (todo.id !== action.payload) {
                    return todo
                }

                return {
                    ...todo,
                    completed: !todo.completed
                }
            })
        }
        case 'todos/colorSelected': {
            const { todoId, color } = action.payload
            return state.map(todo => {
                if (todo.id !== todoId) {
                    return todo
                }

                return {
                    ...todo,
                    color
                }
            })
        }
        case 'todos/todoDeleted': {
            return state.filter(todo => todo.id !== action.payload)
        }
        case 'todos/allCompleted': {
            return state.map(todo => {
                return {
                    ...todo,
                    completed: true
                }
            })
        }
        case 'todos/completedCleared': {
            return state.filter(todo => !todo.completed)
        }
        case 'todos/todosLoaded': {
            return action.payload
        }
        default: {
            return state
        }
    }
}

export default todosReducer

export const fetchTodos = () => async (dispatch, getState) => {
    const response = await client.get('/fakeApi/todos')
    dispatch({ type: 'todos/todosLoaded', payload: response.todos })
}

export const saveNewTodo = (text) => async (dispatch, getState) => {
    const response = await client.post(
        '/fakeApi/todos',
        { todo: { text } }
    )
    dispatch({ type: 'todos/todoAdded', payload: response.todo })
}