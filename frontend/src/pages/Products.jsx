import { useState, useEffect } from 'react'
import axios from 'axios'
import PageLayout from '../components/PageLayout'

function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category_id: '', stock: '', unit: '', image_url: '' })
  const token = localStorage.getItem('token')

  const fetchData = async () => {
    const [p, c] = await Promise.all([
      axios.get('http://localhost:3000/api/products', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('http://localhost:3000/api/categories', { headers: { Authorization: `Bearer ${token}` } }),
    ])
    setProducts(p.data)
    setCategories(c.data)
  }

  useEffect(() => { fetchData() }, [])

  const handleImageUpload = (e, setter, current) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setter({ ...current, image_url: reader.result })
    reader.readAsDataURL(file)
  }

  const addProduct = async () => {
    try {
      await axios.post('http://localhost:3000/api/products', newProduct, { headers: { Authorization: `Bearer ${token}` } })
      setNewProduct({ name: '', price: '', category_id: '', stock: '', unit: '', image_url: '' })
      setShowForm(false)
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  const deleteProduct = async (id) => {
    await axios.delete(`http://localhost:3000/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    fetchData()
  }

  const updateProduct = async (id) => {
    await axios.patch(`http://localhost:3000/api/products/${id}`, editData, { headers: { Authorization: `Bearer ${token}` } })
    setEditingId(null)
    fetchData()
  }

  const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }

  return (
    <PageLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'white', margin: '0 0 4px' }}>🛍 Products</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '14px' }}>Manage your product catalog</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #16a34a, #25D366)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
          + Add Product
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', padding: '20px', marginBottom: '20px' }}>
          <div style={{ color: 'white', fontWeight: '500', fontSize: '15px', marginBottom: '16px' }}>Add new product</div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '10px', overflow: 'hidden', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {newProduct.image_url ? <img src={newProduct.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '24px' }}>🖼️</span>}
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Product image</label>
              <label style={{ display: 'inline-block', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontSize: '12px', cursor: 'pointer' }}>
                📷 Choose image
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, setNewProduct, newProduct)} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            {[
              { label: 'Product name', key: 'name', placeholder: 'e.g. Basmati Rice', type: 'text' },
              { label: 'Price (₹)', key: 'price', placeholder: 'e.g. 120', type: 'number' },
              { label: 'Stock', key: 'stock', placeholder: 'e.g. 50', type: 'number' },
              { label: 'Unit', key: 'unit', placeholder: 'e.g. kg', type: 'text' },
            ].map(field => (
              <div key={field.key}>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>{field.label}</label>
                <input style={inputStyle} type={field.type} placeholder={field.placeholder} value={newProduct[field.key]} onChange={e => setNewProduct({ ...newProduct, [field.key]: e.target.value })} />
              </div>
            ))}
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Category</label>
              <select style={inputStyle} value={newProduct.category_id} onChange={e => setNewProduct({ ...newProduct, category_id: e.target.value })}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id} style={{ color: 'black' }}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={addProduct} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #16a34a, #25D366)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Save product</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
        {products.length === 0 ? (
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', padding: '40px' }}>No products yet — click "+ Add Product"!</div>
        ) : (
          products.map(p => (
            <div key={p.id} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', overflow: 'hidden' }}>
              {editingId === p.id ? (
                <div style={{ padding: '18px' }}>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }}>
                      {editData.image_url ? <img src={editData.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>🖼️</div>}
                    </div>
                    <label style={{ alignSelf: 'center', padding: '6px 12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: 'white', fontSize: '11px', cursor: 'pointer' }}>
                      📷 Change
                      <input type="file" accept="image/*" onChange={e => handleImageUpload(e, setEditData, editData)} style={{ display: 'none' }} />
                    </label>
                  </div>
                  <input style={{ ...inputStyle, marginBottom: '8px' }} value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} placeholder="Name" />
                  <input style={{ ...inputStyle, marginBottom: '8px' }} type="number" value={editData.price} onChange={e => setEditData({ ...editData, price: e.target.value })} placeholder="Price" />
                  <input style={{ ...inputStyle, marginBottom: '8px' }} type="number" value={editData.stock} onChange={e => setEditData({ ...editData, stock: e.target.value })} placeholder="Stock" />
                  <input style={{ ...inputStyle, marginBottom: '10px' }} value={editData.unit} onChange={e => setEditData({ ...editData, unit: e.target.value })} placeholder="Unit" />
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => updateProduct(p.id)} style={{ flex: 1, padding: '6px', borderRadius: '6px', background: 'linear-gradient(135deg, #16a34a, #25D366)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Save</button>
                    <button onClick={() => setEditingId(null)} style={{ flex: 1, padding: '6px', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ width: '100%', height: '140px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {p.image_url ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '36px', opacity: 0.3 }}>🖼️</span>}
                  </div>
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div style={{ color: 'white', fontWeight: '600', fontSize: '15px' }}>{p.name}</div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => { setEditingId(p.id); setEditData({ name: p.name, price: p.price, stock: p.stock, unit: p.unit, category_id: p.category_id, image_url: p.image_url }) }} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '6px', padding: '3px 8px', cursor: 'pointer', fontSize: '12px' }}>✏️</button>
                        <button onClick={() => deleteProduct(p.id)} style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5', borderRadius: '6px', padding: '3px 8px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#34d399', fontSize: '18px', fontWeight: '600' }}>₹{p.price}</span>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>{p.stock} {p.unit} left</span>
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
                      {categories.find(c => c.id === p.category_id)?.name || 'No category'}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </PageLayout>
  )
}

export default Products