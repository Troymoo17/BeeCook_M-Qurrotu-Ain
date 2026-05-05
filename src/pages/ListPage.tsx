import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Clock } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getMenus, getCategories } from "../services/api";
import type { Category } from "../types";

interface Menu {
  id: number;
  name: string;
  slug: string;
  cooking_duration: number;
  file_id: string | null;
  category: { name: string; slug: string };
}

const getImageUrl = (file_id: string | null) => {
  if (!file_id) return "/assets/hero-image.png";
  return `https://drive.google.com/thumbnail?id=${file_id}&sz=w400`;
};

export default function ListPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page") ?? 1);
  const categoryId = searchParams.get("category_id") ?? "";
  const search = searchParams.get("search") ?? "";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getMenus(currentPage, 9, search, categoryId);
        if (res.code === 200) {
          setMenus(res.data.menus ?? []);
          setTotalPages(res.data.totalPages ?? 1);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, categoryId, search]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        if (res.code === 200) setCategories(res.data.categories ?? []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const setCategory = (id: string) => {
    setSearchParams({ category_id: id, page: "1" });
  };

  const setPage = (page: number) => {
    setSearchParams({ category_id: categoryId, page: String(page) });
  };

  const trendingMenu = menus[0];

  // Pagination dengan ellipsis
  const buildPages = () => {
    const pages: (number | "dots")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3);
      if (currentPage > 4) pages.push("dots");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Glow kanan — GANTI ASSET */}
      <img
        src="/assets/hero-glow.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute right-0 top-[300px] w-[400px] opacity-40 hidden md:block"
      />

      <Navbar />

      {/* Trending Banner */}
      {trendingMenu && (
        <section className="relative mx-4 md:mx-12 mt-6 rounded-3xl overflow-hidden h-56 md:h-72">
          <img
            src={getImageUrl(trendingMenu.file_id)}
            alt={trendingMenu.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-10">
            <p className="text-yellow-400 text-sm md:text-base font-semibold mb-1">
              Sedang Trending
            </p>
            <h2 className="text-white text-2xl md:text-4xl font-bold">
              {trendingMenu.name}
            </h2>
          </div>
        </section>
      )}

      {/* Filter Kategori */}
      <section className="px-4 md:px-12 mt-8">
        <div className="flex gap-9 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setCategory("")}
           className={`w-53.25 h-20.5 rounded-xl text-sm font-semibold whitespace-nowrap transition shadow-sm ${
              categoryId === ""
                ? "bg-[#E8B431] text-white"
                : "bg-[#111827] text-white hover:bg-[#1a2436]"
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(String(cat.id))}
              className={`w-53.25 h-20.5 rounded-xl text-sm font-semibold whitespace-nowrap transition shadow-sm ${
                categoryId === String(cat.id)
                  ? "bg-[#E8B431] text-white"
                  : "bg-[#111827] text-white hover:bg-[#1a2436]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Grid Menu */}
      <section className="mt-8 px-4 md:px-0">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Memuat data...</div>
        ) : menus.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            Tidak ada menu ditemukan.
          </div>
        ) : (
          <div
            className="flex flex-wrap justify-center"
            style={{ gap: "45px" }}
          >
            {menus.map((menu) => (
              <Link
                to={`/list/${menu.slug}`}
                key={menu.id}
                className="bg-white rounded-2xl shadow hover:shadow-md transition overflow-hidden w-full sm:w-[368px]"
                style={{ height: "431px" }}
              >
                <img
                  src={getImageUrl(menu.file_id)}
                  alt={menu.name}
                  style={{ width: "368px", height: "272px" }}
                  className="object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-md">
                      {menu.category.name}
                    </span>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <Clock className="h-4 w-4" />
                      <span>{menu.cooking_duration} m</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base leading-snug">
                    {menu.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10 mb-6 text-sm">
            <button
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-gray-700 disabled:opacity-40"
            >
              « Previous
            </button>
            {buildPages().map((p, i) =>
              p === "dots" ? (
                <span key={`d-${i}`} className="px-2 text-gray-400">
                  ···
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-full ${
                    p === currentPage
                      ? "bg-gray-200 text-gray-900 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              ),
            )}
            <button
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-gray-700 disabled:opacity-40"
            >
              Next »
            </button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
