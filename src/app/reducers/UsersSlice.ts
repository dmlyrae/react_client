import { createSlice, PayloadAction} from "@reduxjs/toolkit";
import { userAuth, userAuthByJWT, userGetAll, userLogout } from "../actions/userActions";
import { IUser, unAuthorized } from "src/app/types/IUser";
import { removeCookie } from "src/shared/lib/cookie/cookie";

interface IUsersState {
	currentUser: IUser;
	settings: {
		lang: 'ru' | 'en',
		// theme: Theme,
		permissions?: number,
	};
	auth: boolean;
	error: string;
	token: string;
	accessToken: string;
	refreshToken: string;
	jwtFailed: boolean;
}

const initialState:IUsersState = {
	currentUser: {
		id: unAuthorized,
		login: 'anonymous',
		role: 'anonymous',
	},
	settings: {
		lang: 'ru',
		// theme: Theme.LIGHT,
		permissions: 0,
	},
	jwtFailed: false,
	token:'',
	refreshToken: '',
	accessToken: '',
	error: '',
	auth: false,
}

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		logout: (state) => {
			state.auth = false;
			state.currentUser = {
				login: 'anonymous',
				id: unAuthorized,
				role: 'anonymous',
			};
			removeCookie("accessToken");
		}
	},
	extraReducers: (builder) => {
		builder.addCase(userLogout.fulfilled.type, (state) => {
			state.currentUser = {
				login: 'anonymous',
				id: unAuthorized,
				role: 'anonymous',
			};
			state.settings = {
				lang: 'ru',
				permissions: 0,
			};
			state.token = '';
			state.refreshToken = '';
			state.accessToken = '';
			state.error = "";
			state.auth = false;
		})
		builder.addCase(userGetAll.fulfilled.type, (state, action:PayloadAction<IUser>) => {
			state.currentUser = action.payload;
		})
		builder.addCase(userAuthByJWT.fulfilled.type, (state, action:PayloadAction<{
			user: Partial<IUser>,
		}>) => {
			state.auth = true;
			state.currentUser = Object.assign(state.currentUser, action.payload.user)
		})

		builder.addCase(userAuthByJWT.rejected.type, (state, action:PayloadAction<{error?: string }>) => {
			state.auth = false;
			state.jwtFailed = true;
			state.currentUser = {
				login: "errorUser",
				role: 'anonymous',
				id: unAuthorized,
			}
			state.error = action.payload?.error ?? "Auth error";
		})

		builder.addCase(userAuth.fulfilled.type, (state, action:PayloadAction<{user: IUser, token: string }>) => {
			if(action.payload.user) {
				state.currentUser = action.payload.user;
			}
			if(action.payload.token) {
				state.auth = true;
				state.jwtFailed = false;
				state.token = action.payload.token;
			}
		})

		builder.addCase(userAuth.rejected.type, (state, action:PayloadAction<number|string>) => {
			const errorStatus = action.payload;
			state.auth = false;
			state.currentUser;
			if (errorStatus === 404 || errorStatus === 500) {
				state.currentUser = {
					login: "errorUser",
					role: 'anonymous',
					id: unAuthorized,
				}
			}
			// console.log('user auth')
		})

	}
})

export default userSlice.reducer