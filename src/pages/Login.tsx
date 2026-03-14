// src/pages/LoginPage.tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom' // 1. Agregamos useNavigate
import { useAuthContext } from '../context/AuthContext'

export function Login() {
  const { signIn, signUp } = useAuthContext()
  const navigate = useNavigate() // 2. Inicializamos el hook de navegación
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isSignUp) {
        await signUp(email, password)
        alert('¡Cuenta creada! Revisa tu correo para confirmar.')
      } else {
        await signIn(email, password)
        // 3. ¡ESTA ES LA CLAVE! Redirigir al Home tras el éxito
        navigate('/') 
      }
    } catch (err: any) {
      alert(err.message || 'Error en la autenticación')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      maxWidth: '400px', margin: '4rem auto', padding: '2rem',
      border: '1px solid #e2e8f0', borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
    }}>
      <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
      </h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type='email' placeholder='Tu email' value={email}
          onChange={e => setEmail(e.target.value)} required 
          style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
        />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <input 
            type='password' placeholder='Tu contraseña' value={password}
            onChange={e => setPassword(e.target.value)} required 
            style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />
          
          {!isSignUp && (
            <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: '#3b82f6', textDecoration: 'none', alignSelf: 'flex-end' }}>
              ¿Olvidaste tu contraseña?
            </Link>
          )}
        </div>
        
        <button 
          type='submit' 
          disabled={loading}
          style={{ 
            padding: '0.75rem', borderRadius: '6px', border: 'none', 
            backgroundColor: '#7c3aed', color: 'white', fontWeight: 'bold', 
            cursor: 'pointer', marginTop: '0.5rem'
          }}
        >
          {loading ? 'Cargando...' : isSignUp ? 'Registrarse' : 'Entrar'}
        </button>
      </form>

      <button 
        onClick={() => setIsSignUp(!isSignUp)}
        style={{ 
          marginTop: '1.5rem', background: 'none', border: 'none', 
          color: '#64748b', cursor: 'pointer', width: '100%',
          textAlign: 'center', fontSize: '0.9rem'
        }}
      >
        {isSignUp ? '¿Ya tienes cuenta? Entra' : '¿No tienes cuenta? Regístrate'}
      </button>
    </div>
  )
}