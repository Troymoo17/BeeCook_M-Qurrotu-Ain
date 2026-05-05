import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getCategories, getMenuById, createMenu, updateMenu } from '../services/api'
import type { Category, IngredientField, RecipeField } from '../types'

export default function ManageFormPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [duration, setDuration] = useState('')
  const [ingredients, setIngredients] = useState<IngredientField[]>([
    { description: '' },
    { description: '' },
    { description: '' },
  ])
  const [recipes, setRecipes] = useState<RecipeField[]>([
    { description: '' },
    { description: '' },
    { description: '' },
  ])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories()
        if (res.code === 200) setCategories(res.data.categories ?? [])
      } catch (err) {
        console.error(err)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    if (!isEdit) return
    const fetchMenu = async () => {
      try {
        const res = await getMenuById(Number(id))
        if (res.code === 200) {
          const menu = res.data.menu
          setName(menu.name)
          setDescription(menu.description)
          setCategoryId(String(menu.category_id))
          setDuration(String(menu.cooking_duration))
          setIngredients(
            menu.ingredients.length > 0
              ? menu.ingredients.map((i: { description: string }) => ({
                  description: i.description,
                }))
              : [{ description: '' }]
          )
          setRecipes(
            menu.recipes
              .sort(
                (a: { sort_number: number }, b: { sort_number: number }) =>
                  a.sort_number - b.sort_number
              )
              .map((r: { description: string }) => ({ description: r.description }))
          )
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchMenu()
  }, [id, isEdit])

  const handleIngredientChange = (index: number, value: string) => {
    const updated = [...ingredients]
    updated[index].description = value
    setIngredients(updated)
  }

  const handleRecipeChange = (index: number, value: string) => {
    const updated = [...recipes]
    updated[index].description = value
    setRecipes(updated)
  }

  const handleSubmit = async () => {
    if (!name || !description || !categoryId || !duration) {
      alert('Harap isi semua field: Nama, Deskripsi, Kategori, dan Durasi!')
      return
    }

    setLoading(true)
    try {
      const body = {
        name,
        description,
        cooking_duration: duration,
        category_id: categoryId,
        ingredients: ingredients.filter((i) => i.description.trim() !== ''),
        recipes: recipes
          .filter((r) => r.description.trim() !== '')
          .map((r, index) => ({
            description: r.description,
            sort_number: String(index + 1),
          })),
        nutritions: {
          calory: '0',
          protein: '0',
          carbohydrate: '0',
          fat: '0',
        },
      }

      if (isEdit) {
        await updateMenu(Number(id), body)
      } else {
        await createMenu(body)
      }

      navigate('/manage')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="px-4 md:px-12 py-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/manage')}
            className="text-gray-500 hover:text-gray-800 text-sm flex items-center gap-1 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            ← Kembali
          </button>
          <h1 className="text-3xl font-bold">
            {isEdit ? 'Edit Resep' : 'Buat Resep Baru'}
          </h1>
        </div>

        {/* Informasi Utama */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Informasi Utama</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Nama Resep</label>
                <input
                  type="text"
                  placeholder="Nama Resep"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-yellow-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Kategori</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-yellow-400"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Durasi Masak</label>
                <input
                  type="number"
                  placeholder="60"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-yellow-400"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Deskripsi</label>
              <textarea
                placeholder="Isi deskripsi singkat tentang makanan"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={7}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-yellow-400 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Bahan & Instruksi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Bahan - Bahan</h2>
              <button
                onClick={() => setIngredients([...ingredients, { description: '' }])}
                className="border border-gray-300 text-sm px-3 py-1 rounded-lg hover:bg-gray-50"
              >
                Tambah Bahan
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {ingredients.map((ing, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Bahan ${index + 1}`}
                  value={ing.description}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-yellow-400"
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Instruksi Masak</h2>
              <button
                onClick={() => setRecipes([...recipes, { description: '' }])}
                className="border border-gray-300 text-sm px-3 py-1 rounded-lg hover:bg-gray-50"
              >
                Tambah Instruksi
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {recipes.map((rec, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Instruksi ${index + 1}`}
                  value={rec.description}
                  onChange={(e) => handleRecipeChange(index, e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-yellow-400"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-yellow-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Resep'}
          </button>
        </div>
      </div>
    </div>
  )
}