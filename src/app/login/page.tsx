'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Login fonctionnalité - En cours de développement')
  }

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0077B5 0%, #00A0DC 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '8px',
          color: '#0077B5'
        }}>
          LinkedInBoost
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#666',
          marginBottom: '32px'
        }}>
          Connectez-vous à votre compte
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #0077B5 0%, #00A0DC 100%)',
              color: 'white',
              padding: '14px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Se connecter
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          color: '#666'
        }}>
          Pas encore de compte ?{' '}
          <a href="/register" style={{
            color: '#0077B5',
            fontWeight: '600',
            textDecoration: 'none'
          }}>
            S'inscrire
          </a>
        </p>

        <div style={{
          textAlign: 'center',
          marginTop: '20px'
        }}>
          <a href="/" style={{
            color: '#0077B5',
            textDecoration: 'none'
          }}>
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </main>
  )
}
