import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from './reducers/UsersSlice';
import adminSlice from "./reducers/AdminSlice";

const rootReducer = combineReducers({
	user: userReducer,
	admin: adminSlice, 
})

export const store = configureStore({
	reducer: rootReducer, 
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({})
})

export const setupStore = () => {
	return store
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']