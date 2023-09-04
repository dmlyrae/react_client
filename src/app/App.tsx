import { Suspense, useEffect } from 'react'
import "src/app/styles/App.css"
import { classNames } from 'src/shared/lib/classNames/classNames'
import AppRouter from './providers/router/RouterProvider'
import Layout from './ui/Layout'
import { Loader } from 'src/shared/ui/loader/Loader'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useAppDispatch, useAppSelector } from 'src/shared/lib/hooks/redux'
import { userAuthByJWT } from './actions/userActions'
import { useNavigate } from 'react-router-dom'

function App() {

	const queryClient = new QueryClient();
	const { currentUser, auth, jwtFailed } = useAppSelector( state => state.user )
	const dispatch = useAppDispatch()
	const navigate = useNavigate();

	useEffect(() => {
		if (auth) return;
		if (jwtFailed) {
			navigate('/login', {replace: true})
		}
		if (!currentUser.role || currentUser.role === 'anonymous') {
			dispatch(userAuthByJWT({}))
		} 
		if (auth && currentUser.role !== "admin") {
			navigate('/requests', {replace: true})
		}
		navigate('/login', {replace: true})
	}, [currentUser.role, auth, jwtFailed])
	return (
		<div 
			className={classNames('app', {}, [])} 
			data-id={"app"}
		>
			<Suspense fallback={<Loader />}>
				<Layout> 
					<QueryClientProvider client={queryClient}>
						<AppRouter />
					</QueryClientProvider>
				</Layout>
			</Suspense>
		</div>
	)
}

export default App