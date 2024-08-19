export interface RouteConfig {
  path: string
  element: React.LazyExoticComponent<() => React.JSX.Element>
  children?: () => Promise<RouteConfig[]>
}
export enum DarkMode {
  Light = 'light',
  Dark = 'dark',
}
