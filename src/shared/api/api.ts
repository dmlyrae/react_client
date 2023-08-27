//import { RequestOptions } from "https"
import { getCookie, setCookie, removeCookie } from "typescript-cookie";
import { apiUrl as defaultApiUrl } from "./data"
import { INewUser, IUser } from "src/app/types/IUser";
import { TCategory, TRequest } from "src/app/types/IMenu";

type TMethods = "GET" | "POST" | "PUT" | "DELETE";
interface IRequestProps extends RequestInit {
	method: TMethods;
	settings?: Record<string, unknown>; 
	notAuth?: boolean;
	validate?: boolean;
	token?: string;
}

class API {

	private _apiUrl: string;
	private _accessToken: string | undefined;

	constructor(apiUrl = defaultApiUrl) {
		this._apiUrl = apiUrl;
	}

	private getCookie = getCookie;
	private setCookie = setCookie;
	private removeCookie = removeCookie

	private checkResponse = (response:Response) => {
		console.log('response', response)
		if (response.ok) return response.json();
		console.log('response not ok');
		throw Error('Response error: ' + response.status);
	}

	private validateResponse = (res:{success: boolean, data: unknown}) => {
		if (res.success) return {data: res.data ?? res }
		throw Error('Bad response.')
	}

	private request = (action:string, props:IRequestProps) => {
		console.log('request', action, props)
		const { settings, notAuth, validate, token, headers, ...options } = props;

		let accessToken = token ?? this._accessToken;
		if (!accessToken) {
			accessToken = this.getJWTToken();
		}

		// console.log('access token', accessToken)

		let headerOptions = {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Access-Control-Allow-Headers': 'Content-Type',
			'Access-Control-Allow-Origin': "*",
			...(typeof headers === "object" ? headers : {})
		}

		if (!notAuth) headerOptions = Object.assign(headerOptions, {
			'Authorization': `Bearer ${accessToken}`,
		})
		// console.log('before fetch', options)

		return fetch(`${this._apiUrl}/${action}`, {
			...options,
			mode: "cors",
			headers: new Headers(headerOptions),
		})
			.then(this.checkResponse)
			.then(validate ? this.validateResponse : r => r)
	}

	private getJWTToken = () => {
		const accessToken = this.getCookie('accessToken');
		if (accessToken) {
			this._accessToken = accessToken;
			return this._accessToken;
		}
		return undefined;
	}

	checkJWT = (token?:string) => this.request('auth', { 
		method: 'GET',
		token
	})

	getAllUsers = async () => {
		return await this.request('user', { method: 'GET', })
	}

	createUser = async (userData: INewUser ) => {
		return await this.request('user', { 
			method: 'POST', 
			body: JSON.stringify(userData)
		})
	}

	deleteUser = async (id: string) => {
		return await this.request(`user/${id}`, { 
			method: 'DELETE', 
		})
	}

	authRequest = (authData:{login:string, password:string }) => this.request('auth', {
		method: 'POST',
		body: JSON.stringify(authData)
	})

	logoutRequest = () => this.request('auth', {
		method: 'POST',
		notAuth: true,
	})

	currentMenuInsert = (props: {menu: TCategory[]}) => this.request(
		`menu`, {
			method: 'POST',
			body: JSON.stringify(props),
		})


	currentMenuUpdate = (props: {id: string, menu: TCategory[]}) => this.request(
		`menu/${props.id}`, {
			method: 'PUT',
			body: JSON.stringify(props),
		})

	currentMenuGet = () => this.request('menu', {
		method: 'GET',
	})

	createRequest = (request: TRequest) => this.request('request', {
		method: 'POST',
		body: JSON.stringify(request),
	})

	getAllRequests = () => this.request('request', {
		method: 'GET',
	})

	getSingleRequest = (id:string) => this.request(`request/${id}`, {
		method: 'GET',
	})

	deleteRequest = (id: string) => this.request(`request/${id}`, {
		method: 'DELETE',
	})

	checkmarkRequests = (ids: string[]) => this.request(`request`, {
		method: 'PUT',
		body: JSON.stringify(ids),
	})

}

export default new API();