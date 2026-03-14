import { useState, useRef, useEffect } from 'react'
import type { Tarea, TareaUpdate } from '../types/database'

interface Props {
  tarea: Tarea
  onActualizar: (id: string, cambios: TareaUpdate) => Promise<void>
  onEliminar: (id: string) => Promise<void>
}

export function TaskItem({ tarea, onActualizar, onEliminar }: Props) {
  const [eliminando, setEliminando] = useState(false)
  const [editando, setEditando] = useState(false)
  const [nuevoTitulo, setNuevoTitulo] = useState(tarea.titulo)
  const inputRef = useRef<HTMLInputElement>(null)

  // Foco automático al abrir el input
  useEffect(() => {
    if (editando) inputRef.current?.focus()
  }, [editando])

  const handleGuardar = async () => {
    if (nuevoTitulo.trim() === '') {
      setNuevoTitulo(tarea.titulo)
      setEditando(false)
      return
    }
    
    if (nuevoTitulo !== tarea.titulo) {
      await onActualizar(tarea.id, { titulo: nuevoTitulo })
    }
    setEditando(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleGuardar()
    if (e.key === 'Escape') {
      setNuevoTitulo(tarea.titulo)
      setEditando(false)
    }
  }

  return (
    <div style={{ 
      display:'flex', gap:'1rem', alignItems:'center',
      padding:'1rem', border:'1px solid #e2e8f0', borderRadius:'8px',
      marginBottom:'0.5rem', opacity: eliminando ? 0.5 : 1,
      background: 'white'
    }}>
      <input 
        type='checkbox' 
        checked={!!tarea.completada} 
        onChange={() => onActualizar(tarea.id, { completada: !tarea.completada })} 
        style={{ cursor: 'pointer' }}
      />

      <div style={{ flex: 1 }}>
        {editando ? (
          <input
            ref={inputRef}
            value={nuevoTitulo}
            onChange={(e) => setNuevoTitulo(e.target.value)}
            onBlur={handleGuardar}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%',
              padding: '4px 8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              border: '2px solid #3b82f6',
              borderRadius: '4px',
              outline: 'none'
            }}
          />
        ) : (
          <strong style={{
            textDecoration: tarea.completada ? 'line-through' : 'none',
            color: tarea.completada ? '#94a3b8' : '#1a1a1a' 
          }}>
            {tarea.titulo}
          </strong>
        )}
        
        {tarea.descripcion && !editando && (
          <p style={{ margin:0, color:'#64748b', fontSize:'0.9rem' }}>
            {tarea.descripcion}
          </p>
        )}
      </div>

      {/* --- BOTONES DE ACCIÓN --- */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {!editando && (
          <button 
            onClick={() => setEditando(true)}
            style={{ 
            color: '#c4eb36', 
            cursor: 'pointer', 
            background: 'none', 
            border: 'none',
            fontSize: '1.1rem',
            padding: '4px'
            }}
            title="Editar título"
          >
            Editar ✏️
          </button>
        )}
        
        <button 
          onClick={() => !eliminando && onEliminar(tarea.id)} 
          disabled={eliminando}
          style={{ 
            color: '#ef4444', 
            cursor: 'pointer', 
            background: 'none', 
            border: 'none',
            fontSize: '1.1rem',
            padding: '4px'
          }}
          title="Eliminar tarea"
        >
          Eliminar 🗑
        </button>
      </div>
    </div>
  )
}