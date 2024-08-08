import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { RouteConfig } from '@/types'
import { Suspense } from 'react'
import { Spin } from '@douyinfe/semi-ui'

const fallback = (
	<div className="flex justify-center items-center h-full">
		<Spin size="large" />
	</div>
)

interface RouterProps {
	routes: RouteConfig[]
	isRoot?: boolean
}

const Router: React.FC<RouterProps> = (props: RouterProps): React.ReactElement | null => {
	const { routes, isRoot = false } = props

	const renderRoutes = (routes: RouteConfig[]) => {
		return (
			<>
				{routes.map((route: RouteConfig, index: number) => {
					const { path, element } = route
					const Element = element as React.ComponentType
					return (
						<Route
							key={index}
							path={path}
							element={
								<Suspense fallback={fallback}>
									<Element />
								</Suspense>
							}
						/>
					)
				})}
			</>
		)
	}

	return (
		routes &&
		(isRoot ? (
			<BrowserRouter>
				<Routes>{renderRoutes(routes)}</Routes>
			</BrowserRouter>
		) : (
			<Routes>{renderRoutes(routes)}</Routes>
		))
	)
}

export default Router
