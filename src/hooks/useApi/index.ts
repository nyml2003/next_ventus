import { ApiConfig, ApiEnum, ApiMap } from './apis'
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { throttle } from 'lodash'
type FulfillInterceptor<V> = (value: V) => V | Promise<V>

type RequestFulfillInterceptor = FulfillInterceptor<InternalAxiosRequestConfig>
type RequestRejectInterceptor = (error: any) => any

type ResponseFulfillInterceptor = FulfillInterceptor<AxiosResponse>
type ResponseRejectInterceptor = (error: any) => any

type RequestInterceptor = {
  fulfill: (api?: Api) => RequestFulfillInterceptor
  reject?: (api?: Api) => RequestRejectInterceptor
}

type ResponseInterceptor = {
  fulfill: (api?: Api) => ResponseFulfillInterceptor
  reject?: (api?: Api) => ResponseRejectInterceptor
}

interface Api {
  instance: AxiosInstance
  controller: AbortController
  request<Request, Response>(apiEnum: ApiEnum, request: Request): Promise<Response>
  get<Request, Response>(apiEnum: ApiEnum, request: Request): Promise<Response>
  post<Request, Response>(apiEnum: ApiEnum, request: Request): Promise<Response>
  addRequestInterceptor(interceptor: RequestInterceptor): void
  addResponseInterceptor(interceptor: ResponseInterceptor): void
}

export const throttleInterceptor: (interval: number) => RequestInterceptor = interval => ({
  fulfill: () => {
    return throttle((config: InternalAxiosRequestConfig) => {
      return config
    }, interval)
  },
  reject: () => {
    return (error: any) => {
      return Promise.reject(error)
    }
  },
})

export const handle404Interceptor: () => ResponseInterceptor = () => ({
  fulfill: () => {
    return (response: AxiosResponse) => {
      return response
    }
  },
  reject: (api?: Api) => {
    return (error: any) => {
      if (error.response.status === 404) {
        api?.controller.abort()
        return Promise.reject(
          'The resource you are looking for does not exist. Please check the URL and try again.',
        )
      }
      return Promise.reject(error)
    }
  },
})

export const useApi = () => {
  const api: Api = {
    instance: axios.create({
      baseURL: 'https://ventusvocatflumen.cn/api/',
      timeout: 10000,
    }),
    controller: new AbortController(),
    async request<Request, Response>(apiEnum: ApiEnum, request: Request): Promise<Response> {
      const config: ApiConfig = ApiMap[apiEnum]
      switch (config.method) {
        case 'GET': {
          return this.get(apiEnum, request)
        }
        case 'POST': {
          return this.post(apiEnum, request)
        }
      }
    },
    async get<Request, Response>(apiEnum: ApiEnum, request: Request): Promise<Response> {
      const config: ApiConfig = ApiMap[apiEnum]
      const response = await this.instance.get(config.url, {
        params: request,
      })
      return response.data
    },
    async post<Request, Response>(apiEnum: ApiEnum, request: Request): Promise<Response> {
      const config: ApiConfig = ApiMap[apiEnum]
      const response = await this.instance.post(config.url, request)
      return response.data
    },
    addRequestInterceptor(interceptor: RequestInterceptor) {
      const fulfilled = interceptor.fulfill(this)
      const rejected = interceptor.reject && interceptor.reject(this)
      this.instance.interceptors.request.use(fulfilled, rejected)
    },
    addResponseInterceptor(interceptor: ResponseInterceptor) {
      const fulfilled = interceptor.fulfill(this)
      const rejected = interceptor.reject && interceptor.reject(this)
      this.instance.interceptors.response.use(fulfilled, rejected)
    },
  }
  api.addRequestInterceptor(throttleInterceptor(5000))
  api.addResponseInterceptor(handle404Interceptor())
  return {
    api,
  }
}
