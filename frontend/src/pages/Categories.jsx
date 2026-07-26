import { useState, useEffect } from 'react'
import axios from 'axios'
import PageLayout from '../components/PageLayout'

function Categories() {
  const [categories, setCategories] = useState([])
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const token = localStorage.getItem('token')

  const fetchCategories = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`, { headers: { Authorization: `Bearer ${token}` } })
    setCategories(res.data)
  }

  useEffect(() => { fetchCategories() }, [])

  const addCategory = async () => {
    if (!newName.trim()) return
    await axios.post(`${import.meta.env.VITE_API_URL}/api/categories`, { name: newName }, { headers: { Authorization: `Bearer ${token}` } })
    setNewName('')
    fetchCategories()
  }

  const deleteCategory = async (id) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/categories/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    fetchCategories()
  }

  const updateCategory = async (id) => {
    await axios.patch(`${import.meta.env.VITE_API_URL}/api/categories/${id}`, { name: editName }, { headers: { Authorization: `Bearer ${token}` } })
    setEditingId(null)
    fetchCategories()
  }

  const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', outline: 'none' }

  return (
    <PageLayout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'white', margin: '0 0 4px' }}>📂 Categories</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '14px' }}>Organize your products into categories</p>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', padding: '20px', marginBottom: '20px' }}>
        <div style={{ color: 'white', fontWeight: '500', marginBottom: '12px' }}>Add new category</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCategory()}
            placeholder="e.g. Groceries, Dairy, Snacks"
            style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', outline: 'none' }}
          />
          <button onClick={addCategory} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #16a34a, #25D366)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            Add
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
        {categories.length === 0 ? (
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', padding: '20px' }}>No categories yet!</div>
        ) : (
          categories.map(cat => (
            <div key={cat.id} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', padding: '16px' }}>
              {editingId === cat.id ? (
                <div>
                  <input
                    style={{ ...inputStyle, marginBottom: '10px' }}
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && updateCategory(cat.id)}
                    autoFocus
                  />
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => updateCategory(cat.id)} style={{ flex: 1, padding: '6px', borderRadius: '6px', background: 'linear-gradient(135deg, #16a34a, #25D366)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Save</button>
                    <button onClick={() => setEditingId(null)} style={{ flex: 1, padding: '6px', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: 'white', fontWeight: '500' }}>📂 {cat.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '4px' }}>{cat.product_count} products</div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => { setEditingId(cat.id); setEditName(cat.name) }} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px' }}>✏️</button>
                    <button onClick={() => deleteCategory(cat.id)} style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </PageLayout>
  )
}

export default Categories