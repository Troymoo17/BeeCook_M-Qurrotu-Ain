export interface Category {
  id: number
  name: string
  slug: string
  image: string | null
  file_id: string | null
}

export interface Ingredient {
  id: number
  description: string
}

export interface RecipeStep {
  id: number
  description: string
  sort_number: number
}

export interface Nutrition {
  id: number
  calory: number
  protein: number
  carbohydrate: number
  fat: number
}

export interface Menu {
  id: number
  name: string
  slug: string
  description: string
  cooking_duration: number
  file_id: string | null
  image: string | null
  category_id: number
  category: {
    name: string
    slug: string
  }
  ingredients: Ingredient[]
  recipes: RecipeStep[]
  nutrition: Nutrition
}

export interface ApiResponse<T> {
  code: number
  status: string
  message: string
  data: T | null
}