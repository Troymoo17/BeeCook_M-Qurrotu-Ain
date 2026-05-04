import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getCategories } from "../services/api";
import type { Category } from "../types";

const categoryImages: Record<string, string> = {
  "Main Course": "/assets/category/category-main-course.png",
  Beverages: "/assets/category/category-beverages.png",
  Appetizer: "/assets/category/category-appetizer.png",
  "Side Dish": "/assets/category/category-side-dish.png",
  Dessert: "/assets/category/category-dessert.png",
};

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);

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

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Navbar />
      {/* GLOW Left */}
      {/* <img
        src="/assets/glow.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute z-0 hidden md:block"
        style={{ top: 270, left: -39, width: 490, height: 492, opacity: 0.3 }}
      /> */}
      {/* GLOW Right */}
      {/* <img
        src="/assets/glow.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute z-0 hidden md:block"
        style={{ top: 905, left: 1014, width: 495, height: 488, opacity: 0.6 }}
      /> */}

      {/* ===================== HERO SECTION ===================== */}
      <section className="relative px-6 md:px-12 py-12 md:py-20">
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-8">
          {/* Left content */}
          <div className="w-full md:max-w-md text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6">
              Where{" "}
              <span className="relative inline-block text-yellow-500">
                Quality
                <img
                  src="/assets/stars.png"
                  alt=""
                  aria-hidden="true"
                  className="absolute -top-4 -right-6 h-6 md:h-8"
                />
              </span>
              <br />
              Meets <span className="font-black text-gray-900">Flavor.</span>
            </h1>

            <Link
              to="/list"
              className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium inline-block hover:bg-gray-700 transition"
            >
              Eksplor Sekarang
            </Link>

            <div className="flex items-center gap-3 mt-6 justify-center md:justify-start">
              <div className="flex -space-x-2">
                <img
                  src="/assets/avatar/people1.png"
                  alt="user"
                  className="h-8 w-8 rounded-full object-cover border-2 border-white"
                />
                <img
                  src="/assets/avatar/people2.png"
                  alt="user"
                  className="h-8 w-8 rounded-full object-cover border-2 border-white"
                />
                <img
                  src="/assets/avatar/people3.png"
                  alt="user"
                  className="h-8 w-8 rounded-full object-cover border-2 border-white"
                />
              </div>
              <span className="text-sm text-gray-600">1.000+ Pengguna</span>
            </div>
          </div>

          {/* Right hero image */}
          <div className="w-full sm:w-3/4 md:w-[520px] lg:w-[600px]">
            <img
              src="/assets/hero-image.png"
              alt="Hero Food"
              className="w-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* ===================== KATEGORI SECTION ===================== */}
      <section className="relative py-12 md:py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-10 md:mb-14">
            Eksplor berdasarkan{" "}
            <span className="relative inline-block text-yellow-500">
              Kategori
              <img
                src="/assets/line-doodle.png"
                alt=""
                aria-hidden="true"
                className="absolute left-0 -bottom-3 md:-bottom-4 w-full h-auto pointer-events-none select-none"
              />
            </span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 md:gap-6 place-items-center">
            {categories.map((cat) => (
              <Link
                to={`/list?category_id=${cat.id}`}
                key={cat.id}
                className="flex flex-col items-center gap-3 hover:scale-105 transition"
              >
                <img
                  src={categoryImages[cat.name] ?? "/assets/category.svg"}
                  alt={cat.name}
                  className="h-20 w-20 md:h-28 md:w-28 rounded-full object-cover shadow-sm"
                />
                <span className="text-sm md:text-base font-semibold">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== SUBSCRIBE SECTION ===================== */}
      <section className="relative py-12 md:py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">
          {/* Left: text + form */}
          <div className="w-full md:max-w-md text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Dapatan menu menarik setiap hari
            </h2>
            <p className="text-gray-500 text-sm md:text-base mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto md:mx-0">
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 gap-2 flex-1 bg-white">
                <span className="text-gray-400 text-sm">✉</span>
                <input
                  type="email"
                  placeholder="you@email.com"
                  className="outline-none text-sm flex-1 w-full bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition whitespace-nowrap"
              >
                Langganan
              </button>
            </form>
          </div>
          <div
            className="relative flex-shrink-0 mx-auto overflow-hidden"
            style={{
              width: 404,
              height: 605,
              maxWidth: "100%",
              borderRadius: 228.5,
            }}
          >
            <img
              src="/assets/Rectangle.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <img
              src="/assets/people-chef-subscribe.png"
              alt="Chef"
              className="absolute object-contain"
              style={{
                width: "80%",
                height: "auto",
                bottom: "-5%",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
