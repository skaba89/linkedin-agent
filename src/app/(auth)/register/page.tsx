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
import { Card, CardContent } from '@/components/ui/card'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { useAuthStore } from '@/lib/store'
import { Linkedin, Mail, Lock, Eye, EyeOff, Loader2, User, Building2, Briefcase, Check } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const registerSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().min(1, 'L\'email est requis').email('Email invalide'),
  password: z.string()
    .min(1, 'Le mot de passe est requis')
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string().min(1, 'Confirmez votre mot de passe'),
  accountType: z.enum(['individual', 'company', 'agency'], {
    required_error: 'Veuillez sélectionner un type de compte',
  }),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Vous devez accepter les conditions d\'utilisation',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

type RegisterFormValues = z.infer<typeof registerSchema>

const accountTypes = [
  {
    value: 'individual' as const,
    label: 'Particulier',
    description: 'Optimiser mon profil personnel',
    features: ['Profil LinkedIn personnel', 'Génération de contenu', 'Analytics personnels'],
    icon: User,
  },
  {
    value: 'company' as const,
    label: 'Entreprise',
    description: 'Gérer ma marque employeur',
    features: ['Page entreprise LinkedIn', 'Équipe & collaboration', 'Analytics avancés'],
    icon: Building2,
  },
  {
    value: 'agency' as const,
    label: 'Agence',
    description: 'Gérer plusieurs clients',
    features: ['Multi-clients', 'Workspaces séparés', 'Reporting client'],
    icon: Briefcase,
  },
]

export default function RegisterPage() {
  const router = useRouter()
  const { setUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      accountType: undefined,
      acceptTerms: false,
    },
  })

  const selectedAccountType = form.watch('accountType')

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          accountType: data.accountType,
        }),
      })

      const result = await response.json()

      if (result.success && result.data) {
        setUser(result.data)
        toast.success('Compte créé avec succès !')
        router.push('/dashboard')
      } else {
        toast.error(result.error || 'Erreur lors de la création du compte')
      }
    } catch {
      toast.error('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout 
      title="Créer un compte" 
      subtitle="Rejoignez LinkedInBoost et optimisez votre présence LinkedIn."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input placeholder="Jean" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Dupont" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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

          {/* Account Type Selection */}
          <FormField
            control={form.control}
            name="accountType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Type de compte</FormLabel>
                <p className="text-sm text-muted-foreground mb-3">Choisissez le type de compte qui correspond à vos besoins</p>
                <div className="grid grid-cols-1 gap-4">
                  {accountTypes.map((type) => (
                    <Card
                      key={type.value}
                      className={cn(
                        'cursor-pointer transition-all hover:shadow-md',
                        field.value === type.value 
                          ? 'border-2 border-[#0077B5] bg-[#0077B5]/5 shadow-sm' 
                          : 'border hover:border-[#0077B5]/30'
                      )}
                      onClick={() => field.onChange(type.value)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                            field.value === type.value 
                              ? 'bg-[#0077B5] text-white' 
                              : 'bg-gray-100 text-gray-600'
                          )}>
                            {field.value === type.value ? (
                              <Check className="h-6 w-6" />
                            ) : (
                              <type.icon className="h-6 w-6" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-base">{type.label}</span>
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">{type.description}</div>
                            <div className="flex flex-wrap gap-2">
                              {type.features.map((feature, idx) => (
                                <span 
                                  key={idx}
                                  className="text-xs px-2 py-1 rounded-full bg-muted"
                                >
                                  ✓ {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder="••••••••" 
                        className="pl-10" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Password Requirements */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>Le mot de passe doit contenir au moins 6 caractères.</p>
          </div>

          {/* Terms */}
          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-start gap-2">
                  <Checkbox 
                    id="acceptTerms" 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                    className="mt-0.5"
                  />
                  <label htmlFor="acceptTerms" className="text-sm text-gray-600 cursor-pointer leading-relaxed">
                    J'accepte les{' '}
                    <Link href="#" className="text-[#0077B5] hover:underline">conditions d'utilisation</Link>
                    {' '}et la{' '}
                    <Link href="#" className="text-[#0077B5] hover:underline">politique de confidentialité</Link>
                  </label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#0077B5] to-[#00A0DC] hover:from-[#005885] hover:to-[#0077B5]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création du compte...
              </>
            ) : (
              'Créer mon compte'
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

      {/* Login Link */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Déjà un compte ?{' '}
        <Link href="/login" className="text-[#0077B5] font-medium hover:underline">
          Se connecter
        </Link>
      </p>
    </AuthLayout>
  )
}
