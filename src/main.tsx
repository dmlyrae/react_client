import ReactDOM from 'react-dom/client'
import App from 'src/app/App.tsx'
import 'src/app/styles/index.css'
import { ErrorBoundary } from './app/providers/ErrorBoundary'
import { BrowserRouter } from 'react-router-dom'
import { setupStore } from './app/store'
import { Provider } from 'react-redux'

const store = setupStore()

ReactDOM.createRoot(document.getElementById('root')!).render( 
	<ErrorBoundary>
		<Provider store={store} >
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>
	</ErrorBoundary>
)