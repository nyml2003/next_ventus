import { ApiConfig, ApiEnum, ApiMap } from './apis'
import axios from 'axios'

export const useApi = () => {
  const api = {
    instance: axios.create({
      baseURL: 'https://ventusvocatflumen.cn/api/',
      timeout: 10000,
    }),
    async handle<Request, Response>(apiEnum: ApiEnum, request: Request): Promise<Response> {
      const config = ApiMap[apiEnum]
      switch (config.method) {
        case 'GET': {
          const response = await this.instance.get(config.url, {
            params: request,
          })
          return response.data
        }
        case 'POST': {
          const response = await this.instance.post(config.url, request)
          return response.data
        }
      }
    },
  }
  return {
    api,
  }
}
