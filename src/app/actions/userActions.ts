import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "src/shared/api/api";
import { getErrorMessage } from "src/shared/api/getErrorMessage";
import { removeCookie, setCookie } from "src/shared/lib/cookie/cookie"

export const checkLocalAuthParams = createAsyncThunk(
	'user/checkLocal',
	async (u:any,thunkAPI) => {
		try {
			if (u) { console.log(u); }
			const btoa = localStorage.getItem('btoa');
			if (!btoa) return;
			return {
				btoa
			}
		} catch (e:any) {
			return thunkAPI.rejectWithValue(e.message)
		}
	}
)

export const userAuthByJWT = createAsyncThunk(
	'user/jwtauth',
	async (u:any, thunkAPI) => {
		try {
			if (u) { console.log(u); }
			const response:any = await api.checkJWT()
			const { user } = response;
			if (user) {
				return {user, error: false}
			}
			throw new Error("JWT auth failed")
		} catch (e:Error|unknown) {
			console.error('error')
			return thunkAPI.rejectWithValue(getErrorMessage(e))
		}
	}
)

export const userLogout = createAsyncThunk(
	'user/logout',
	async (undefined, thunkAPI) => {
		try {
			const response:any = await api.logoutRequest()
			if (response.success) {
				removeCookie("accessToken");
				thunkAPI.fulfillWithValue(undefined)
			}
			return thunkAPI.rejectWithValue(undefined)
		} catch (e) {
			return thunkAPI.rejectWithValue(undefined)
		}
	}
)

export const userAuth = createAsyncThunk(
	'user/auth',
	async (authParams: {login:string, password:string}, thunkAPI) => {
		try {
			const response = await api.authRequest(authParams)
			// const response = await axios.post(apiUrl + '/auth', authParams, {
			// 	headers: {
			// 		'Access-Control-Allow-Origin': "*",
			// 	}
			// }) 
			console.log('response', response)

			if (!response) {
				return thunkAPI.rejectWithValue(response)
			}

			if (!response.token) {
				return thunkAPI.rejectWithValue(response)
			}

			if (response.token) {
				setCookie('accessToken', response.token, {
					expires: 172,
				}) 
			}

			return response;

		} catch (e:Error|unknown) {
			console.error('error', e )
			return thunkAPI.rejectWithValue(getErrorMessage(e))
		}
	}
)

export const toggleTheme = createAsyncThunk(
	'user/toggleTheme',
	async (theme:string, thunkAPI) => {
		try {
			return {
				theme
			}
		} catch (e:any) {
			return thunkAPI.rejectWithValue(e.message)
		}
	}
)

export const userGetAll = createAsyncThunk(
	'user/get',
	async (u:any, thunkAPI) => {
		try {
			if (u) {console.log(u)}
			const response = await api.getAllUsers();
			return response;
		} catch (e:any) {
			return thunkAPI.rejectWithValue(e.message)
		}
	}
)