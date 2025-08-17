'use client'
import { usePathname } from 'next/navigation'
import Navbar from './NavBar'

export default function NavBarClientWrapper() {
  const pathname = usePathname()
  if (pathname.startsWith('/winners')) return null
  return <Navbar />
}
