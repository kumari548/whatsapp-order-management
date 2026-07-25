import { useState, useEffect } from 'react'
import axios from 'axios'
import PageLayout from '../components/PageLayout'

function Inventory() {
  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [newItem, setNewItem] = useState({ item_name: '', quantity: '', unit: '', low_stock_alert: '' })

  const token = localStorage.getItem('token')

  const fetchInventory = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/inventory', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setItems(res.data)
    } catch (err) {
      console.error('Failed to fetch inventory:', err)
    }
  }

  useEffect(() => { fetchInventory() }, [])

  const addItem = async () => {
    try {
      await axios.post('http://localhost:3000/api/inventory', newItem, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setNewItem({ item_name: '', quantity: '', unit: '', low_stock_alert: '' })
      setShowForm(false)
      fetchInventory()
    } catch (err) {
      console.error('Failed to add item:', err)
    }
  }

  const updateQuantity = async (id, quantity) => {
    try {
      await axios.patch(`http://localhost:3000/api/inventory/${id}`, { quantity }, { headers: { Authorization: `Bearer ${token}` } })
      fetchInventory()
    } catch (err) {
      console.error('Failed to update quantity:', err)
    }
  }

  const updateItem = async (id, item_name, unit, low_stock_alert) => {
    try {
      await axios.patch(`http://localhost:3000/api/inventory/${id}`, { item_name, unit, low_stock_alert }, { headers: { Authorization: `Bearer ${token}` } })
      fetchInventory()
    } catch (err) {
      console.error('Failed to update item:', err)
    }
  }

  const lowStockItems = items.filter(i => i.quantity <= i.low_stock_alert)

  const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }

  return (
    <PageLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'white', margin: '0 0 4px' }}>Inventory</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '14px' }}>Track your stock levels</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 20px', backgroundImage: 'linear-gradient(135deg, #16a34a, #25D366)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
          + Add Item
        </button>
      </div>

      {lowStockItems.length > 0 && (
        <div style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <div>
            <div style={{ color: '#fcd34d', fontWeight: '500', fontSize: '14px' }}>Low stock alert!</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>{lowStockItems.map(i => i.item_name).join(', ')} running low</div>
          </div>
        </div>
      )}

      {showForm && (
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', padding: '20px', marginBottom: '20px' }}>
          <div style={{ color: 'white', fontWeight: '500', fontSize: '15px', marginBottom: '16px' }}>Add new item</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            {[
              { label: 'Item name', key: 'item_name', placeholder: 'e.g. Rice', type: 'text' },
              { label: 'Quantity', key: 'quantity', placeholder: 'e.g. 50', type: 'number' },
              { label: 'Unit', key: 'unit', placeholder: 'e.g. kg', type: 'text' },
              { label: 'Low stock alert at', key: 'low_stock_alert', placeholder: 'e.g. 10', type: 'number' },
            ].map(field => (
              <div key={field.key}>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>{field.label}</label>
                <input style={inputStyle} type={field.type} placeholder={field.placeholder} value={newItem[field.key]} onChange={e => setNewItem({ ...newItem, [field.key]: e.target.value })} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={addItem} style={{ padding: '10px 20px', backgroundImage: 'linear-gradient(135deg, #16a34a, #25D366)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Save item</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
              {['Item', 'Quantity', 'Unit', 'Low Stock Alert', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>No items yet — click "+ Add Item" to get started!</td></tr>
            ) : (
              items.map(item => (
                <tr key={item.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '14px 16px', color: 'white', fontWeight: '500' }}>
                    {editingId === item.id ? <input style={{ ...inputStyle, width: '120px' }} value={editData.item_name} onChange={e => setEditData({ ...editData, item_name: e.target.value })} /> : item.item_name}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.85)' }}>{item.quantity}</td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)' }}>
                    {editingId === item.id ? <input style={{ ...inputStyle, width: '80px' }} value={editData.unit} onChange={e => setEditData({ ...editData, unit: e.target.value })} /> : item.unit}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)' }}>
                    {editingId === item.id ? <input style={{ ...inputStyle, width: '80px' }} type="number" value={editData.low_stock_alert} onChange={e => setEditData({ ...editData, low_stock_alert: e.target.value })} /> : item.low_stock_alert}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {item.quantity <= item.low_stock_alert
                      ? <span style={{ background: 'rgba(245,158,11,0.3)', color: '#fcd34d', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>⚠️ Low</span>
                      : <span style={{ background: 'rgba(34,197,94,0.3)', color: '#86efac', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>✅ OK</span>
                    }
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {editingId === item.id ? (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => { updateItem(item.id, editData.item_name, editData.unit, editData.low_stock_alert); setEditingId(null) }} style={{ padding: '5px 12px', borderRadius: '6px', backgroundImage: 'linear-gradient(135deg, #16a34a, #25D366)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Save</button>
                        <button onClick={() => setEditingId(null)} style={{ padding: '5px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <button onClick={() => updateQuantity(item.id, parseInt(item.quantity) - 1)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontSize: '16px' }}>-</button>
                        <button onClick={() => updateQuantity(item.id, parseInt(item.quantity) + 1)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontSize: '16px' }}>+</button>
                        <button onClick={() => { setEditingId(item.id); setEditData({ item_name: item.item_name, unit: item.unit, low_stock_alert: item.low_stock_alert }) }} style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontSize: '12px' }}>✏️ Edit</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </PageLayout>
  )
}

export default Inventory