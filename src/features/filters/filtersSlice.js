import { createSlice } from "@reduxjs/toolkit"

export const StatusFilters = {
    All: 'all',
    Active: 'active',
    Completed: 'completed',
}

const initialState = {
    status: StatusFilters.All,
    colors: []
}

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        statusFilterChanged(state, action) {
            const status = action.payload
            state.status = status
        },
        colorFilterChanged: {
            reducer(state, action) {
                const { color, changeType } = action.payload
                const { colors } = state
    
                switch (changeType) {
                    case 'added': {
                        if (!colors.includes(color)) {
                            colors.push(color)
                        }
                        break
                    }
                    case 'removed': {
                        const colorIndex = colors.indexOf(color)
                        if(colorIndex !== -1) {
                            colors.splice(colorIndex, 1)
                        }
                        break
                    }
                    default: break
                }
            },
            prepare(color, changeType) {
                return {
                    payload: { color, changeType }
                }
            }
        }
    }
})

const filtersReducer = filtersSlice.reducer
export default filtersReducer

export const {
    statusFilterChanged,
    colorFilterChanged
} = filtersSlice.actions