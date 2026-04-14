import { AxiosInstance, AxiosResponse } from 'axios'

import { instance } from './http.axios'

export const http = (): Pick<AxiosInstance, 'get' | 'post'> => ({
  get: instance.get.bind(instance),
  post: instance.post.bind(instance),
})

export type HttpResponse<T> = AxiosResponse<T>
