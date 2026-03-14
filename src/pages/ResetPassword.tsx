import { useState } from 'react'
import { authService } from '../services/authService'
import { useNavigate } from 'react-router-dom'

export function ResetPassword() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await authService.updatePassword(password)
      if (error) throw error
      alert('✅ Contraseña actualizada. Ya puedes iniciar sesión.')
      navigate('/login')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth:'400px', margin:'4rem auto', padding:'2rem', border:'1px solid #e2e8f0', borderRadius:'12px' }}>
      <h1>Nueva Contraseña</h1>
      <form onSubmit={handleUpdate} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        <input type='password' placeholder='Escribe tu nueva clave' value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
        <button type='submit' disabled={loading}>
          {loading ? 'Guardando...' : 'Cambiar contraseña'}
        </button>
      </form>
    </div>
  )
}
