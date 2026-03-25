import Link from 'next/link'
import { 
  Linkedin, 
  Sparkles, 
  Mail, 
  MapPin,
  Twitter,
  Github,
  Youtube
} from 'lucide-react'

const footerLinks = {
  product: [
    { name: 'Fonctionnalités', href: '#features' },
    { name: 'Tarifs', href: '#pricing' },
    { name: 'Intégrations', href: '#' },
    { name: 'API', href: '#' },
  ],
  company: [
    { name: 'À propos', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Carrières', href: '#' },
    { name: 'Presse', href: '#' },
  ],
  resources: [
    { name: 'Centre d\'aide', href: '#' },
    { name: 'Tutoriels', href: '#' },
    { name: 'Webinaires', href: '#' },
    { name: 'Modèles', href: '#' },
  ],
  legal: [
    { name: 'Confidentialité', href: '#' },
    { name: 'CGU', href: '#' },
    { name: 'Cookies', href: '#' },
    { name: 'Mentions légales', href: '#' },
  ],
}

const socialLinks = [
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'LinkedIn', href: '#', icon: Linkedin },
  { name: 'GitHub', href: '#', icon: Github },
  { name: 'YouTube', href: '#', icon: Youtube },
]

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0077B5] to-[#00A0DC]">
                <Linkedin className="h-6 w-6 text-white" />
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-amber-400" />
              </div>
              <span className="text-xl font-bold text-white">
                LinkedInBoost
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-6 max-w-xs">
              Optimisez votre présence LinkedIn avec l'intelligence artificielle. 
              Gagnez du temps, augmentez votre visibilité.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="h-9 w-9 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-[#0077B5] transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-semibold text-white mb-4">Produit</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Entreprise</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Ressources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Légal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} LinkedInBoost. Tous droits réservés.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="h-4 w-4" />
              <span>Fait avec ❤️ en France</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
