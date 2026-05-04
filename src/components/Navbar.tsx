import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const navLink = (path: string, label: string) => {
    const isActive = location.pathname === path
    return (
      <Link
        key={path}
        to={path}
        onClick={() => setOpen(false)}
        className={`font-medium text-sm ${isActive ? 'text-yellow-500' : 'text-gray-800 hover:text-yellow-500'}`}
      >
        {label}
      </Link>
    )
  }

  const links: [string, string][] = [
    ['/', 'Beranda'],
    ['/list', 'Resep'],
    ['/manage', 'Kelola'],
  ]

  return (
    <nav className="w-full px-6 md:px-12 py-4 flex items-center justify-between relative z-20 bg-white">
      <Link to="/">
        <img src="/assets/logo/logo-beecook-color.png" alt="BeeCook" className="h-7 md:h-8" />
      </Link>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-8">
        {links.map(([p, l]) => navLink(p, l))}
      </div>

      {/* Mobile hamburger */}
      <button
        type="button"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="md:hidden p-2 text-gray-800"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {open ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile dropdown menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-md flex flex-col px-6 py-4 gap-4">
          {links.map(([p, l]) => navLink(p, l))}
        </div>
      )}
    </nav>
  )
}
