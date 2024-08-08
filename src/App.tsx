import React from 'react'
import Router from '@/router'
import { routes } from '@/router/routes'
const App: React.FC = () => {
	return (
		<div className="App">
			<Router routes={routes} isRoot />
		</div>
	)
}
export default App
