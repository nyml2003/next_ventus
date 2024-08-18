export interface RouteConfig {
  path: string
  element: React.LazyExoticComponent<() => React.JSX.Element>
  children?: () => Promise<any>
}
export enum DarkMode {
  Light = 'light',
  Dark = 'dark',
}
