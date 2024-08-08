import { RouteConfig } from '@/types'
import { lazy } from 'react'
export const routes: RouteConfig[] = [
	{
		path: 'a',
		element: lazy(() => import('../pages/APage')),
	},
	{
		path: 'b',
		element: lazy(() => import('../pages/BPage')),
	},
]
