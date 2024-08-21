export interface ApiConfig {
  url: string
  method: 'GET' | 'POST'
}

export enum ApiEnum {
  GetMaze = 'GetMaze',
  GetArticleList = 'GetArticleList',
}

export const ApiMap: Record<ApiEnum, ApiConfig> = {
  GetMaze: {
    url: '/maze/create',
    method: 'GET',
  },
  GetArticleList: {
    url: '/blog/rest/',
    method: 'GET',
  },
}
