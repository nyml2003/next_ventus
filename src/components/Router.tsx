import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React, { Suspense } from 'react'
import { RouteConfig } from '@/types'
import Fallback from '@/components/Fallback'

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
          return <Route key={index} path={path} element={<Element />} />
        })}
      </>
    )
  }

  return (
    routes &&
    (isRoot ? (
      <Suspense fallback={Fallback}>
        <BrowserRouter>
          <Routes>{renderRoutes(routes)}</Routes>
        </BrowserRouter>
      </Suspense>
    ) : (
      <Routes>{renderRoutes(routes)}</Routes>
    ))
  )
}

export default Router
