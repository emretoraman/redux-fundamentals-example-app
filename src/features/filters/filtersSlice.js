export const StatusFilters = {
    All: 'all',
    Active: 'active',
    Completed: 'completed',
}

const initialState = {
    status: StatusFilters.All,
    colors: []
}

const filtersReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'filters/statusFilterChanged': {
            return {
                ...state,
                status: action.payload
            }
        }
        case 'filters/colorFilterChanged': {
            const { color, changeType } = action.payload
            const { colors } = state

            switch (changeType) {
                case 'added': {
                    if (colors.includes(color)) {
                        return state
                    }

                    return {
                        ...state,
                        colors: [
                            ...colors,
                            color
                        ]
                    }
                }
                case 'removed': {
                    return {
                        ...state,
                        colors: colors.filter(
                            (existingColor) => existingColor !== color
                        )
                    }
                }
                default: {
                    return state
                }
            }
        }
        default: {
            return state
        }
    }
}

export default filtersReducer

export const colorFilterChanged = (color, changeType) => ({
    type: 'filters/colorFilterChanged',
    payload: { color, changeType }
})