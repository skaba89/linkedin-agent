'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { 
  Linkedin, 
  Menu, 
  X, 
  Sparkles,
  ChevronDown
} from 'lucide-react'

const navigation = [
  { name: 'Fonctionnalités', href: '#features' },
  { name: 'Tarifs', href: '#pricing' },
  { name: 'Témoignages', href: '#testimonials' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0077B5] to-[#00A0DC] shadow-lg shadow-[#0077B5]/20 group-hover:shadow-[#0077B5]/40 transition-shadow">
              <Linkedin className="h-6 w-6 text-white" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-amber-400 animate-pulse" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#0077B5] to-[#00A0DC] bg-clip-text text-transparent">
              LinkedInBoost
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-600 hover:text-[#0077B5] transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0077B5] transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex md:items-center md:gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-600 hover:text-[#0077B5]">
                Connexion
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-[#0077B5] to-[#00A0DC] hover:from-[#005885] hover:to-[#0077B5] text-white shadow-lg shadow-[#0077B5]/20">
                Commencer gratuitement
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0077B5] to-[#00A0DC]">
                      <Linkedin className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-[#0077B5] to-[#00A0DC] bg-clip-text text-transparent">
                      LinkedInBoost
                    </span>
                  </Link>
                </div>

                <nav className="flex flex-col gap-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium text-gray-600 hover:text-[#0077B5] transition-colors py-2"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto flex flex-col gap-3 pt-8 border-t">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Connexion
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-[#0077B5] to-[#00A0DC] hover:from-[#005885] hover:to-[#0077B5]">
                      Commencer gratuitement
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
