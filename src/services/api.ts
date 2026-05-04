const BASE_URL = import.meta.env.VITE_BASE_URL

export const getCategories = async () => {
  const res = await fetch(`${BASE_URL}/category`)
  return res.json()
}

export const getMenus = async (page = 1, limit = 9, search = '', category_id = '') => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
    category_id: String(category_id),
  })
  const res = await fetch(`${BASE_URL}/menu?${params}`)
  return res.json()
}

export const getMenuBySlug = async (slug: string) => {
  const res = await fetch(`${BASE_URL}/menu/detail/${slug}`)
  return res.json()
}

export const getMenuById = async (id: number) => {
  const res = await fetch(`${BASE_URL}/menu/find/${id}`)
  return res.json()
}

export const createMenu = async (body: object) => {
  const res = await fetch(`${BASE_URL}/menu`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

export const updateMenu = async (id: number, body: object) => {
  const res = await fetch(`${BASE_URL}/menu/update/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

export const deleteMenu = async (id: number) => {
  const res = await fetch(`${BASE_URL}/menu/delete/${id}`, {
    method: 'DELETE',
  })
  return res.json()
}

export const uploadMenuImage = async (id: number, file: File) => {
  const formData = new FormData()
  formData.append('image', file)
  const res = await fetch(`${BASE_URL}/menu/upload/${id}`, {
    method: 'PUT',
    body: formData,
  })
  return res.json()
}