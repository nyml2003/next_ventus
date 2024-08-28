import { ApiConfig, ApiEnum, ApiMap } from '@/apis';
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { reject } from 'lodash';
import { message } from 'antd';
import { IngoreError } from '@/types';
type FulfillInterceptor<V> = (value: V) => V | Promise<V>;

type RequestFulfillInterceptor = FulfillInterceptor<InternalAxiosRequestConfig>;
type RequestRejectInterceptor = (error: any) => any;

type ResponseFulfillInterceptor = FulfillInterceptor<AxiosResponse>;
type ResponseRejectInterceptor = (error: any) => any;

type RequestInterceptor = {
  fulfill: (api: Api) => RequestFulfillInterceptor;
  reject?: (api: Api) => RequestRejectInterceptor;
};

type ResponseInterceptor = {
  fulfill: (api: Api) => ResponseFulfillInterceptor;
  reject?: (api: Api) => ResponseRejectInterceptor;
};

interface Api {
  lastRequestTime: number;
  instance: AxiosInstance;
  controller: AbortController;
  request<Request, Response>(apiEnum: ApiEnum, request: Request): Promise<Response>;
  get<Request, Response>(apiEnum: ApiEnum, request: Request): Promise<Response>;
  post<Request, Response>(apiEnum: ApiEnum, request: Request): Promise<Response>;
  addRequestInterceptor(interceptor: RequestInterceptor): void;
  addResponseInterceptor(interceptor: ResponseInterceptor): void;
}

// export const throttleInterceptor = (interval: number, api: Api): RequestInterceptor => {
//   if (interval <= 0) {
//     return {
//       fulfill: () => (config: InternalAxiosRequestConfig) => {
//         return config;
//       },
//       reject: () => (error: any) => {
//         return Promise.reject(error);
//       },
//     };
//   }
//   return {
//     fulfill: (api: Api) => (config: InternalAxiosRequestConfig) => {
//       return new Promise((resolve, reject) => {
//         const now = Date.now();
//         //计算经过的时间
//         const timePassed = now - api.lastRequestTime;
//         if (timePassed < interval) {
//           setTimeout(() => {
//             resolve(config);
//           }, interval - timePassed);
//           reject(new Error('请求次数过多'));
//         } else {
//           api.lastRequestTime = now;
//           resolve(config);
//         }
//       });
//     },
//     reject: (api: Api) => (error: any) => {
//       return new Promise((resolve, reject) => {
//         if (error.message === '请求次数过多') {
//           api.controller.abort();
//           resolve('请求次数过多，请稍后再试');
//         } else {
//           reject(error);
//         }
//       });
//     },
//   };
// };

export const DefaultHeaderInterceptor: () => RequestInterceptor = () => ({
  fulfill: () => {
    return (config: InternalAxiosRequestConfig) => {
      config.headers['Content-Type'] = 'application/json';
      //config.headers['X-Content-Type-Options'] = 'nosniff';
      config.headers['Cache-Control'] = 'public, max-age=31536000';
      return config;
    };
  },
});

export const Ingore404Interceptor: () => ResponseInterceptor = () => ({
  fulfill: () => {
    return (response: AxiosResponse) => {
      return response;
    };
  },
  reject: (api: Api) => {
    return (error: any) => {
      if (error.response.status === 404) {
        api.controller.abort();
        return Promise.reject(new IngoreError());
      }
      return Promise.reject(error);
    };
  },
});

export const SimulateServerLagInterceptor: () => ResponseInterceptor = () => ({
  fulfill: () => {
    return (response: AxiosResponse) => {
      // 模拟服务器卡顿，永远不返回
      return new Promise<AxiosResponse>(resolve => {
        setTimeout(() => {
          resolve(response);
        }, 100000);
      });
    };
  },
  reject: (api: Api) => {
    return (error: any) => {
      api.controller.abort();
      return Promise.reject(error);
    };
  },
});

export const requestInterceptor1: RequestInterceptor = {
  fulfill: (api: Api) => {
    return (config: InternalAxiosRequestConfig) => {
      console.log('requestInterceptor1');
      return config;
    };
  },
};

export const requestInterceptor2: RequestInterceptor = {
  fulfill: (api: Api) => {
    return (config: InternalAxiosRequestConfig) => {
      console.log('requestInterceptor2');
      return config;
    };
  },
};

export const responseInterceptor1: ResponseInterceptor = {
  fulfill: (api: Api) => {
    return (response: AxiosResponse) => {
      console.log('responseInterceptor1');
      return response;
    };
  },
};

export const responseInterceptor2: ResponseInterceptor = {
  fulfill: (api: Api) => {
    return (response: AxiosResponse) => {
      console.log('responseInterceptor2');
      return response;
    };
  },
};

export const useApi = () => {
  const api: Api = {
    lastRequestTime: 0,
    instance: axios.create({
      baseURL: 'https://ventusvocatflumen.cn/api/',
      timeout: 10000,
    }),
    controller: new AbortController(),
    async request<Request, Response>(apiEnum: ApiEnum, request: Request): Promise<Response> {
      const config: ApiConfig = ApiMap[apiEnum];
      switch (config.method) {
        case 'GET': {
          return this.get(apiEnum, request);
        }
        case 'POST': {
          return this.post(apiEnum, request);
        }
      }
    },
    async get<Request, Response>(apiEnum: ApiEnum, request: Request): Promise<Response> {
      const config: ApiConfig = ApiMap[apiEnum];
      const response = await this.instance.get(config.url, {
        params: request,
      });
      return response.data;
    },
    async post<Request, Response>(apiEnum: ApiEnum, request: Request): Promise<Response> {
      const config: ApiConfig = ApiMap[apiEnum];
      const response = await this.instance.post(config.url, request);
      return response.data;
    },
    addRequestInterceptor(interceptor: RequestInterceptor) {
      const fulfilled = interceptor.fulfill(this);
      const rejected = interceptor.reject && interceptor.reject(this);
      this.instance.interceptors.request.use(fulfilled, rejected);
    },
    addResponseInterceptor(interceptor: ResponseInterceptor) {
      const fulfilled = interceptor.fulfill(this);
      const rejected = interceptor.reject && interceptor.reject(this);
      this.instance.interceptors.response.use(fulfilled, rejected);
    },
  };
  //api.addRequestInterceptor(DefaultHeaderInterceptor());
  //api.addRequestInterceptor(throttleInterceptor(1000, api));
  //api.addResponseInterceptor(Ingore404Interceptor());
  //api.addResponseInterceptor(SimulateServerLagInterceptor());

  api.addRequestInterceptor(requestInterceptor1);
  api.addRequestInterceptor(requestInterceptor2);
  api.addResponseInterceptor(responseInterceptor1);
  api.addResponseInterceptor(responseInterceptor2);
  return {
    api,
  };
};
