import { Suspense, useMemo } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AnonymousRouteConfig, RouteConfig } from "src/shared/config/routerConfig"
import { useAppSelector } from 'src/shared/lib/hooks/redux'
import { Loader } from 'src/shared/ui/loader/Loader'

const AppRouter = function () {

	const { currentUser, auth  } = useAppSelector( state => state.user )

	const config = useMemo(() => {
		return auth ? RouteConfig : AnonymousRouteConfig;
	}, [currentUser, auth])

	return (
		<Routes>
			{
				Object.values(config).map(({ element, path }) => (
					<Route
						path={path}
						element={(
							<Suspense fallback={<Loader />} >
								{element}
							</Suspense>
						)}
						key={path}
					/>
				))
			}
		</Routes>
	)
}

export default AppRouter