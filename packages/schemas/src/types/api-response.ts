export interface ApiError {
  field?: string
  message: string
}

export interface ApiResponse<T> {
  statusCode: number
  message: string
  data: T | null
  errors?: ApiError[] | null
}
