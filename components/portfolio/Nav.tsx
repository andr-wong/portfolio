'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const pathname = usePathname()
  const active = pathname === '/personal' ? 'personal' : 'professional'

  return (
    <nav className="nav">
      <Link href="/" className="nav-mark">
        <span className="dot" />
        <span>AW / Adelaide</span>
      </Link>
      <div className="nav-links">
        <Link href="/" className={`nav-link ${active === 'professional' ? 'active' : ''}`}>
          Professional
        </Link>
        <Link href="/personal" className={`nav-link ${active === 'personal' ? 'active' : ''}`}>
          Personal
        </Link>
        <a href="#contact" className="nav-link">Contact</a>
      </div>
    </nav>
  )
}
