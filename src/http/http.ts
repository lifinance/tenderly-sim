import { AxiosResponse } from 'axios'

import { instance } from './http.axios'

export const http = () => ({
  get: instance.get.bind(instance),
  post: instance.post.bind(instance),
})

export type HttpResponse<T> = AxiosResponse<T>
