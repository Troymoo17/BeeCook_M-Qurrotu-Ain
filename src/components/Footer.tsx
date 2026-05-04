import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white px-6 md:px-12 py-10 md:py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Logo */}
        <div>
          <img src="/assets/logo/logo-beecook-white.png" alt="BeeCook" className="h-8 mb-4" />
        </div>

        {/* Partnership */}
        <div>
          <h4 className="font-bold mb-4">Partnership</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="#" className="hover:text-white">Layanan</Link></li>
            <li><Link to="#" className="hover:text-white">Kontributor</Link></li>
            <li><Link to="#" className="hover:text-white">Iklan</Link></li>
            <li><Link to="#" className="hover:text-white">Karir</Link></li>
          </ul>
        </div>

        {/* Bantuan */}
        <div>
          <h4 className="font-bold mb-4">Bantuan</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="#" className="hover:text-white">FAQ</Link></li>
            <li><Link to="#" className="hover:text-white">Kontak Kami</Link></li>
            <li><Link to="#" className="hover:text-white">Aksesibilitas</Link></li>
          </ul>
        </div>

        {/* Sosmed */}
        <div className="flex gap-4 items-start sm:justify-end md:justify-start">
          <img src="/assets/sosmed/socmed-tiktok.png" alt="TikTok" className="h-6 w-6 object-contain" />
          <img src="/assets/sosmed/socmed-facebook.png" alt="Facebook" className="h-6 w-6 object-contain" />
          <img src="/assets/sosmed/socmed-instagram.png" alt="Instagram" className="h-6 w-6 object-contain" />
          <img src="/assets/sosmed/socmed-x.png" alt="X" className="h-6 w-6 object-contain" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-500 text-center sm:text-left">BECOOK MEDIA | ALL RIGHTS RESERVED</p>
      </div>
    </footer>
  )
}
