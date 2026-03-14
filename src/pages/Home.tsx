// src/pages/Home.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTasks } from '../hooks/useTask' // Asegúrate de que el nombre del archivo sea useTask o useTasks
import { useRealtimeTasks } from '../hooks/useRealtimeTasks'
import { usePresence } from '../hooks/usePresence'
import { useAuth } from '../hooks/useAuth'
import { TaskForm } from '../components/TaskForm'
import { TaskItem } from '../components/TaskItem'
import { RealtimeIndicator } from '../components/RealtimeIndicator'

export function Home() {
  // --- ESTADO PARA FILTROS ---
  const [filtro, setFiltro] = useState<'todas' | 'pendientes' | 'completadas'>('todas')

  const { tareas, loading, error, crearTarea, actualizarTarea, eliminarTarea } = useTasks()
  
  // Hooks para la funcionalidad de la barra de navegación
  const { conectado } = useRealtimeTasks()
  const { onlineUsers } = usePresence('dashboard')
  const { signOut } = useAuth()

  // --- LÓGICA DE FILTRADO ---
  const tareasFiltradas = tareas.filter(t => {
    if (filtro === 'pendientes') return !t.completada
    if (filtro === 'completadas') return !!t.completada
    return true // todas
  })

  // --- CONTADORES PARA LOS BOTONES ---
  const totalPendientes = tareas.filter(t => !t.completada).length
  const totalCompletadas = tareas.filter(t => !!t.completada).length

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <p>Cargando tareas...</p>
    </div>
  )
  
  if (error) return <div style={{ color: 'red', padding: '2rem' }}>Error: {error}</div>

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      
      {/* --- Barra de Navegación --- */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center', 
        marginBottom: '1.5rem',
        padding: '0.75rem 1rem', 
        background: '#f8fafc', 
        borderRadius: '10px' 
      }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to='/' style={{ textDecoration: 'none', color: '#1e293b', fontWeight: 600 }}>
            📋 Mis Tareas
          </Link>
          <Link to='/dashboard' style={{ textDecoration: 'none', color: '#64748b' }}>
            📊 Dashboard
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <RealtimeIndicator conectado={conectado} />
          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
            👥 {onlineUsers.length} en línea
          </span>
          <button onClick={signOut} style={{ 
            cursor: 'pointer',
            padding: '4px 12px',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            background: 'white',
            fontSize: '0.85rem'
          }}>
            Salir
          </button>
        </div>
      </nav>

      {/* --- Contenido Principal --- */}
      <h1 style={{ marginBottom: '1.5rem' }}>📋 Mis Tareas</h1>
      
      <TaskForm
        onCrear={async (titulo, descripcion) => { 
          await crearTarea({ titulo, descripcion }) 
        }}
      />

      {/* --- BOTONES DE FILTRO --- */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginTop: '2rem', 
        marginBottom: '1rem',
        borderBottom: '1px solid #f1f5f9',
        paddingBottom: '1rem'
      }}>
        <button 
          onClick={() => setFiltro('todas')}
          style={getButtonStyle(filtro === 'todas')}
        >
          Todas ({tareas.length})
        </button>
        <button 
          onClick={() => setFiltro('pendientes')}
          style={getButtonStyle(filtro === 'pendientes')}
        >
          Pendientes ({totalPendientes})
        </button>
        <button 
          onClick={() => setFiltro('completadas')}
          style={getButtonStyle(filtro === 'completadas')}
        >
          Completadas ({totalCompletadas})
        </button>
      </div>

      {/* --- LISTA FILTRADA --- */}
      <div style={{ marginTop: '1rem' }}>
        {tareasFiltradas.length === 0
          ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <p>No hay tareas en esta sección.</p>
            </div>
          )
          : tareasFiltradas.map(t => (
             <TaskItem 
  key={t.id} 
  tarea={t}
  // Ahora pasamos el objeto 'cambios' directamente
  onActualizar={async (id, cambios) => { 
    await actualizarTarea(id, cambios) 
  }}
  onEliminar={eliminarTarea}
/>
            ))
        }
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
        {totalCompletadas} / {tareas.length} completadas
      </p>
    </div>
  )
}

// Función auxiliar para estilos de botones
const getButtonStyle = (isActive: boolean): React.CSSProperties => ({
  padding: '8px 16px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.85rem',
  fontWeight: 500,
  transition: 'all 0.2s ease',
  backgroundColor: isActive ? '#1e293b' : '#f1f5f9',
  color: isActive ? 'white' : '#64748b',
})