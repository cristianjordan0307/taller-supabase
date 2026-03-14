import { useState } from 'react'
import { authService } from '../services/authService'
import { Link } from 'react-router-dom'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await authService.resetPassword(email)
      if (error) throw error
      setMensaje('📩 ¡Correo enviado! Revisa tu bandeja de entrada.')
    } catch (err: any) {
      alert(err.message || 'Error al enviar el correo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth:'400px', margin:'4rem auto', padding:'2rem', border:'1px solid #e2e8f0', borderRadius:'12px' }}>
      <h1>Recuperar Clave</h1>
      {mensaje ? (
        <p style={{ color: 'green' }}>{mensaje}</p>
      ) : (
        <form onSubmit={handleReset} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          <p>Te enviaremos un enlace para restablecer tu contraseña.</p>
          <input type='email' placeholder='Tu email' value={email} onChange={e => setEmail(e.target.value)} required />
          <button type='submit' disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </button>
        </form>
      )}
      <Link to="/login" style={{ display:'block', marginTop:'1rem', color:'#3b82f6', textDecoration:'none' }}>
        Volver al login
      </Link>
    </div>
  )
}