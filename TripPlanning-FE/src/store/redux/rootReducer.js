import { combineReducers } from '@reduxjs/toolkit'
import useReducer from './features/userSlice'

export const rootReducer = combineReducers({
    user: useReducer,
});