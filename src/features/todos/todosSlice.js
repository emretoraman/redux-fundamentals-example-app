import { createSelector } from 'reselect'

import { client } from '../../api/client'
import { StatusFilters } from '../filters/filtersSlice'

const initialState = {
    status: 'idle',
    entities: {}
}

const todosReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'todos/todoAdded': {
            const todo = action.payload

            return {
                ...state,
                entities: {
                    ...state.entities,
                    [todo.id]: todo
                }
            }
        }
        case 'todos/todoToggled': {
            const todoId = action.payload
            const todo = state.entities[todoId]

            return {
                ...state,
                entities: {
                    ...state.entities,
                    [todoId]: {
                        ...todo,
                        completed: !todo.completed
                    }
                }
            }
        }
        case 'todos/colorSelected': {
            const { todoId, color } = action.payload
            const todo = state.entities[todoId]

            return {
                ...state,
                entities: {
                    ...state.entities,
                    [todoId]: {
                        ...todo,
                        color
                    }
                }
            }
        }
        case 'todos/todoDeleted': {
            const todoId = action.payload
            const entities = { ...state.entities }
            delete entities[todoId]

            return {
                ...state,
                entities
            }
        }
        case 'todos/allCompleted': {
            const entities = { ...state.entities }
            Object.keys(entities).forEach(todoId => {
                entities[todoId] = {
                    ...entities[todoId],
                    completed: true
                }
            })

            return {
                ...state,
                entities
            }
        }
        case 'todos/completedCleared': {
            const entities = { ...state.entities }
            Object.keys(entities).forEach(todoId => {
                if(entities[todoId].completed) {
                    delete entities[todoId]
                }
            })

            return {
                ...state,
                entities
            }
        }
        case 'todos/todosLoading': {
            return {
                ...state,
                status: 'loading'
            }
        }
        case 'todos/todosLoaded': {
            const entities = {}
            action.payload.forEach(todo => {
                entities[todo.id] = todo
            })
            
            return {
                ...state,
                status: 'idle',
                entities
            }
        }
        default: {
            return state
        }
    }
}

export default todosReducer

export const fetchTodos = () => async (dispatch, getState) => {
    dispatch({ type: 'todos/todosLoading' })
    const response = await client.get('/fakeApi/todos')
    dispatch(todosLoaded(response.todos))
}

export const saveNewTodo = (text) => async (dispatch, getState) => {
    const response = await client.post(
        '/fakeApi/todos',
        { todo: { text } }
    )
    dispatch(todoAdded(response.todo))
}

export const todosLoaded = todos => ({
    type: 'todos/todosLoaded',
    payload: todos
})

export const todoAdded = todo => ({
    type: 'todos/todoAdded',
    payload: todo
})

const selectTodoEntites = state => state.todos.entities

export const selectTodos = createSelector(
    selectTodoEntites,
    entities => Object.values(entities)
)

export const selectTodoById = (state, todoId) => {
    return selectTodoEntites(state)[todoId]
}

export const selectFilteredTodos = createSelector(
    selectTodos,
    state => state.filters,
    (todos, filters) => {
        const { status, colors } = filters
        const showAllCompletions = status === StatusFilters.All
        const showAllColors = colors.length === 0
        const completedStatus = status === StatusFilters.Completed

        return todos.filter(todo => {
            const statusMatches = showAllCompletions || todo.completed === completedStatus
            const colorMatches = showAllColors || colors.includes(todo.color)
            return statusMatches && colorMatches
        })
    }
)

export const selectFilteredTodoIds = createSelector(
    selectFilteredTodos,
    filteredTodos => filteredTodos.map(todo => todo.id)
)