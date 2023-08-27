import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "src/shared/api/api";
import { apiUrl } from "src/shared/api/data";
import { getErrorMessage } from "src/shared/api/getErrorMessage";
import { getCookie, removeCookie, setCookie } from "src/shared/lib/cookie/cookie"

export const checkLocalAuthParams = createAsyncThunk(
	'user/checkLocal',
	async (anyParams:any,thunkAPI) => {
		try {
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
	async (undefined, thunkAPI) => {
		try {
			const response:any = await api.checkJWT()
			console.log('response jwt', response )
			const { user } = response;
			if (user) {
				return {user, error: false}
			}
			return {
				user: null,
				error: true,
			}
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
	async (u:undefined, thunkAPI) => {
		try {
			const response = await api.getAllUsers();
			console.log(response)
		} catch (e:any) {
			return thunkAPI.rejectWithValue(e.message)
		}
	}
)