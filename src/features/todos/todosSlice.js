import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'

import { client } from '../../api/client'
import { StatusFilters } from '../filters/filtersSlice'

const todosAdapter = createEntityAdapter()

const initialState = todosAdapter.getInitialState({
    status: 'idle'
})

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
    const response = await client.get('/fakeApi/todos')
    return response.todos
})

export const saveNewTodo = createAsyncThunk('todos/saveNewTodo', async (text) => {
    const response = await client.post(
        '/fakeApi/todos',
        { todo: { text } }
    )
    return response.todo
})

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        todoToggled(state, action) {
            const todoId = action.payload
            const todo = state.entities[todoId]
            todo.completed = !todo.completed
        },
        todoColorSelected: {
            reducer(state, action) {
                const { todoId, color } = action.payload
                state.entities[todoId].color = color
            },
            prepare(todoId, color) {
                return {
                    payload: { todoId, color }
                }
            }
        },
        todoDeleted: todosAdapter.removeOne,
        allTodosCompleted(state, action) {
            Object.values(state.entities).forEach(todo => {
                todo.completed = true
            })
        },
        completedTodosCleared(state, action) {
            const completedIds = Object.keys(state.entities)
                .filter(todoId => state.entities[todoId].completed)
            todosAdapter.removeMany(state, completedIds)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                todosAdapter.setAll(state, action.payload)
                state.status = 'idle'
            })
            .addCase(saveNewTodo.fulfilled, todosAdapter.addOne)
    }
})

const todosReducer = todosSlice.reducer
export default todosReducer

export const {
    todoToggled,
    todoColorSelected,
    todoDeleted,
    allTodosCompleted,
    completedTodosCleared
} = todosSlice.actions

export const { selectAll: selectTodos, selectById: selectTodoById } =
    todosAdapter.getSelectors(state => state.todos)

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