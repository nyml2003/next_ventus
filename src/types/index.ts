import React, { LazyExoticComponent } from 'react'
export interface RouteConfig {
	path: string
	element: LazyExoticComponent<React.ComponentType<unknown>>
}
