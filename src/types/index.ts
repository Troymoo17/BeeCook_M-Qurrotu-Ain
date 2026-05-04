export interface Category {
  id: number
  name: string
  image: string | null
}

export interface Ingredient {
  id: number
  description: string
}

export interface Recipe {
  id: number
  description: string
  sort_number: number
}

export interface Nutrition {
  calory: string
  protein: string
  carbohydrate: string
  fat: string
}

export interface Menu {
  id: number
  name: string
  slug: string
  description: string
  cooking_duration: string
  category_id: number
  category: Category
  image: string | null
  file_id: string | null
  ingredients: Ingredient[]
  recipes: Recipe[]
  nutritions: Nutrition
}

export interface ApiResponse<T> {
  code: number
  status: string
  message: string
  data: T | null
}

export interface PaginatedData<T> {
  data: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}