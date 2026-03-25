'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { useAuthStore } from '@/lib/store'
import { Linkedin, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const loginSchema = z.object({
  email: z.string().min(1, 'L\'email est requis').email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis').min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  remember: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (result.success && result.data) {
        setUser(result.data)
        toast.success('Connexion réussie !')
        router.push('/dashboard')
      } else {
        toast.error(result.error || 'Email ou mot de passe incorrect')
      }
    } catch {
      toast.error('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout 
      title="Connexion" 
      subtitle="Bienvenue ! Connectez-vous à votre compte LinkedInBoost."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      type="email" 
                      placeholder="vous@exemple.com" 
                      className="pl-10" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="••••••••" 
                      className="pl-10 pr-10" 
                      {...field} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="remember" 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                    Se souvenir de moi
                  </label>
                </div>
              )}
            />
            <Link href="#" className="text-sm text-[#0077B5] hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#0077B5] to-[#00A0DC] hover:from-[#005885] hover:to-[#0077B5]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              'Se connecter'
            )}
          </Button>
        </form>
      </Form>

      {/* Divider */}
      <div className="relative my-6">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-gray-500">
          ou
        </span>
      </div>

      {/* LinkedIn OAuth */}
      <Button 
        variant="outline" 
        className="w-full" 
        type="button"
      >
        <Linkedin className="mr-2 h-5 w-5 text-[#0077B5]" />
        Continuer avec LinkedIn
      </Button>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Pas encore de compte ?{' '}
        <Link href="/register" className="text-[#0077B5] font-medium hover:underline">
          Créer un compte
        </Link>
      </p>
    </AuthLayout>
  )
}
