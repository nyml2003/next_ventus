import { RouteConfig } from '@/types'
import { lazy } from 'react'
const routes: RouteConfig[] = [
  {
    path: '/*',
    element: lazy(() => import('@/layouts/EntryLayout')),
    children: () => import('@/layouts/EntryLayout/router'),
  },
  {
    path: '*',
    element: lazy(() => import('@/layouts/NotFoundLayout')),
  },
]

export default routes
