export default function HomePage() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0077B5 0%, #00A0DC 100%)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>
        LinkedInBoost
      </h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem', opacity: 0.9 }}>
        Maximisez votre impact sur LinkedIn
      </p>
      
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '2rem', 
        borderRadius: '16px',
        marginBottom: '2rem'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Application déployée avec succès !</h2>
        <p>Version 1.0 - Render</p>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a 
          href="/login"
          style={{
            padding: '14px 36px',
            background: 'white',
            color: '#0077B5',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '1rem'
          }}
        >
          Se connecter
        </a>
        <a 
          href="/register"
          style={{
            padding: '14px 36px',
            background: 'transparent',
            color: 'white',
            border: '2px solid white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '1rem'
          }}
        >
          S'inscrire gratuitement
        </a>
      </div>
    </main>
  )
}
