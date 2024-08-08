import { RouteConfig } from '@/types'
import { lazy } from 'react'
export const routes: RouteConfig[] = [
	{
		path: '/',
		element: lazy(() => import('@/layouts/EntryLayout')),
	},
]
