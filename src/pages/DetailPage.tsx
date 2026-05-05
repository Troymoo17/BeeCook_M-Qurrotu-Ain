import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getMenuBySlug } from '../services/api'
import type { Menu } from '../types'

const getImageUrl = (file_id: string | null): string => {
  if (!file_id) return '/assets/hero-image.png'
  return `https://drive.google.com/thumbnail?id=${file_id}&sz=w800`
}

export default function DetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [menu, setMenu] = useState<Menu | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getMenuBySlug(slug ?? '')
        if (res.code === 200) setMenu(res.data.menu)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Memuat data...</p>
      </div>
    )
  }

  if (!menu) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Menu tidak ditemukan.</p>
      </div>
    )
  }

  const sortedRecipes = [...menu.recipes].sort((a, b) => a.sort_number - b.sort_number)

  const nutritionItems = [
    { label: 'Kalori', value: `${menu.nutrition.calory} kcal` },
    { label: 'Protein', value: `${menu.nutrition.protein}g` },
    { label: 'Lemak', value: `${menu.nutrition.fat}g` },
    { label: 'Karbohidrat', value: `${menu.nutrition.carbohydrate}g` },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Image */}
      <section className="relative mx-4 md:mx-12 mt-6 rounded-2xl overflow-hidden h-64 md:h-80">
        <img
          src={getImageUrl(menu.file_id)}
          alt={menu.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 md:p-10">
          <h1 className="text-white text-2xl md:text-4xl font-bold">{menu.name}</h1>
        </div>
      </section>

      {/* Info Kategori & Durasi */}
      <section className="mx-4 md:mx-12 mt-6 flex gap-8">
        <div className="flex items-center gap-3">
          <img src="/assets/category.svg" alt="kategori" className="h-8 w-8" />
          <div>
            <p className="text-xs text-gray-400">Kategori</p>
            <p className="font-semibold text-sm">{menu.category.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <img src="/assets/duration.svg" alt="durasi" className="h-8 w-8" />
          <div>
            <p className="text-xs text-gray-400">Durasi</p>
            <p className="font-semibold text-sm">{menu.cooking_duration} menit</p>
          </div>
        </div>
      </section>

      {/* Deskripsi */}
      <section className="mx-4 md:mx-12 mt-6">
        <p className="text-gray-600 text-sm leading-relaxed">{menu.description}</p>
      </section>

      {/* Informasi Nutrisi */}
      {menu.nutrition && (
        <section className="mx-4 md:mx-12 mt-10">
          <h2 className="text-xl font-bold mb-4">Infomasi Nutrisi</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {nutritionItems.map((item) => (
              <div
                key={item.label}
                className="border-2 border-yellow-400 rounded-xl p-4 text-center"
              >
                <p className="text-lg font-bold">{item.value}</p>
                <p className="text-xs text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bahan & Cara Masak */}
      <section className="mx-4 md:mx-12 mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        <div>
          <h2 className="text-xl font-bold mb-4">Bahan-bahan</h2>
          <ul className="space-y-2">
            {menu.ingredients.map((ing) => (
              <li key={ing.id} className="text-sm text-gray-700">
                {ing.description}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Cara Masak</h2>
          <ol className="space-y-4">
            {sortedRecipes.map((step) => (
              <li key={step.id} className="flex gap-3 items-start">
                <span className="bg-yellow-500 text-white text-sm font-bold rounded-full h-7 w-7 flex items-center justify-center shrink-0">
                  {step.sort_number}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Footer />
    </div>
  )
}