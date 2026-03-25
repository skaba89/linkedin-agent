'use client'

import Link from 'next/link'
import { Linkedin, Sparkles, ArrowLeft } from 'lucide-react'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="w-full max-w-sm mx-auto">
          {/* Back Link */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0077B5] transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#0077B5] to-[#00A0DC] shadow-lg shadow-[#0077B5]/20">
              <Linkedin className="h-7 w-7 text-white" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-amber-400 animate-pulse" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#0077B5] to-[#00A0DC] bg-clip-text text-transparent">
              LinkedInBoost
            </span>
          </Link>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-500 mt-2">{subtitle}</p>
          </div>

          {/* Form Content */}
          {children}
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-[#0077B5] via-[#00669C] to-[#004D75] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Decorative Circles */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#00A0DC]/20 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center px-12 xl:px-20">
          <div className="max-w-md text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Propulsé par l'IA</span>
            </div>

            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Optimisez votre présence LinkedIn en quelques clics
            </h2>

            <p className="text-lg text-white/80 mb-8">
              LinkedInBoost utilise l'intelligence artificielle pour créer du contenu 
              engageant, optimiser votre profil et analyser vos performances.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-400" />
                <span>+10 000 utilisateurs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                <span>+500 000 posts générés</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-400" />
                <span>4.9/5 étoiles</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
