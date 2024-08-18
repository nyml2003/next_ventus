import { lazy } from 'react'
import { RouteConfig } from '@/types'
const routes: RouteConfig[] = [
  {
    path: '/game',
    element: lazy(() => import('../pages/GamePage')),
  },
]

export default routes
