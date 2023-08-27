import { RouteProps } from 'react-router-dom';
import { Admin } from 'src/pages/admin';
import { Login } from 'src/pages/login';
import { Requests } from 'src/pages/requests';
import { SingleRequest } from 'src/pages/singleRequest';

export enum AnonymousRoutes {
	LOGIN = 'login',
	NOT_FOUND = 'not_found',
}

export enum AuthorizedRoutes {
	MAIN = 'main',
	LOGIN = 'login',
	REQUESTS = 'requests',
	SINGLE_REQUEST = 'single_request',
	ADMIN = 'admin',
	NOT_FOUND = 'not_found',
}

export const startPage = AuthorizedRoutes.LOGIN;

export type AppRoutes = AnonymousRoutes | AuthorizedRoutes;

export const RoutePaths: Record<AuthorizedRoutes, string> = {
	[AuthorizedRoutes.MAIN]: '/',
	[AuthorizedRoutes.LOGIN]: '/login',
	[AuthorizedRoutes.REQUESTS]: '/requests',
	[AuthorizedRoutes.SINGLE_REQUEST]: '/request/:id',
	[AuthorizedRoutes.ADMIN]: '/admin',
	[AuthorizedRoutes.NOT_FOUND]: '/not_found',
}

export const RouteConfig: Record<AuthorizedRoutes, RouteProps> = {
	[AuthorizedRoutes.MAIN]: {
		path: RoutePaths[AuthorizedRoutes.MAIN],
		element: <Requests />
	},
	[AuthorizedRoutes.SINGLE_REQUEST]: {
		path: RoutePaths[AuthorizedRoutes.SINGLE_REQUEST],
		element: <SingleRequest />
	},
	[AuthorizedRoutes.LOGIN]: {
		path: RoutePaths[AuthorizedRoutes.LOGIN],
		element: <Login />
	},
	[AuthorizedRoutes.REQUESTS]: {
		path: AuthorizedRoutes.REQUESTS,
		element: <Requests />
	},
	[AuthorizedRoutes.ADMIN]: {
		path: AuthorizedRoutes.ADMIN,
		element: <Admin />
	},
	[AuthorizedRoutes.NOT_FOUND]: {
		path: AuthorizedRoutes.NOT_FOUND,
		element: <Login />
	},
}

export const AnonymousPaths: Record<AnonymousRoutes, string> = {
	[AnonymousRoutes.LOGIN]: '/login',
	[AnonymousRoutes.NOT_FOUND]: '/not_found'
}

export const AnonymousRouteConfig: Record<AnonymousRoutes, RouteProps> = {
	[AnonymousRoutes.LOGIN]: {
		path: AnonymousPaths.login,
		element: <Login />
	},
	[AnonymousRoutes.NOT_FOUND]: {
		path: AnonymousPaths.not_found,
		element: <Login />
	},
}