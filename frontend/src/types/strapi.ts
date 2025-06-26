export interface StrapiSystemFields {
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  locale?: string
}

export interface StrapiMedia {
  url: string
  alternativeText?: string
  caption?: string
  width?: number
  height?: number
  formats?: {
    thumbnail?: MediaFormat
    small?: MediaFormat
    medium?: MediaFormat
    large?: MediaFormat
    xlarge?: MediaFormat
  }
}

export interface MediaFormat {
  url: string
  width: number
  height: number
  size: number
}

export interface StrapiResponse<T> {
  data: T
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface StrapiCollectionResponse<T> {
  data: T[]
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
} 