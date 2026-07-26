import { useState, useEffect } from 'react'
import axios from 'axios'
import PageLayout from '../components/PageLayout'

function Deliveries() {
  const [deliveries, setDeliveries] = useState([])
  const [orders, setOrders] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [newDelivery, setNewDelivery] = useState({ order_id: '', delivery_person: '', estimated_time: '' })
  const token = localStorage.getItem('token')

  const fetchData = async () => {
    const [d, o] = await Promise.all([
      axios.get(`${import.meta.env.VITE_API_URL}/api/deliveries`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, { headers: { Authorization: `Bearer ${token}` } }),
    ])
    setDeliveries(d.data)
    setOrders(o.data)
  }

  useEffect(() => { fetchData() }, [])

  const addDelivery = async () => {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/deliveries`, newDelivery, { headers: { Authorization: `Bearer ${token}` } })
    setNewDelivery({ order_id: '', delivery_person: '', estimated_time: '' })
    setShowForm(false)
    fetchData()
  }

  const updateStatus = async (id, status) => {
    await axios.patch(`${import.meta.env.VITE_API_URL}/api/deliveries/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } })
    fetchData()
  }

  const getStatusColor = (status) => {
    if (status === 'pending') return { bg: 'rgba(245,158,11,0.3)', color: '#fcd34d' }
    if (status === 'on_the_way') return { bg: 'rgba(59,130,246,0.3)', color: '#93c5fd' }
    return { bg: 'rgba(34,197,94,0.3)', color: '#86efac' }
  }

  const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }

  return (
    <PageLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'white', margin: '0 0 4px' }}>🚚 Deliveries</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '14px' }}>Track and manage deliveries</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #16a34a, #25D366)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
          + Assign Delivery
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', padding: '20px', marginBottom: '20px' }}>
          <div style={{ color: 'white', fontWeight: '500', fontSize: '15px', marginBottom: '16px' }}>Assign new delivery</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Select order</label>
              <select style={inputStyle} value={newDelivery.order_id} onChange={e => setNewDelivery({ ...newDelivery, order_id: e.target.value })}>
                <option value="">Select order</option>
                {orders.map(o => <option key={o.id} value={o.id} style={{ color: 'black' }}>#{o.id} - {o.customer_name || 'Unknown'}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Delivery person</label>
              <input style={inputStyle} placeholder="e.g. Ravi Kumar" value={newDelivery.delivery_person} onChange={e => setNewDelivery({ ...newDelivery, delivery_person: e.target.value })} />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Estimated time</label>
              <input style={inputStyle} placeholder="e.g. 30 mins" value={newDelivery.estimated_time} onChange={e => setNewDelivery({ ...newDelivery, estimated_time: e.target.value })} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={addDelivery} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #16a34a, #25D366)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Assign</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
              {['Order', 'Customer', 'Delivery Person', 'Est. Time', 'Status', 'Update'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deliveries.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>No deliveries yet!</td></tr>
            ) : (
              deliveries.map(d => {
                const sc = getStatusColor(d.status)
                return (
                  <tr key={d.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)' }}>#{d.order_id}</td>
                    <td style={{ padding: '14px 16px', color: 'white', fontWeight: '500' }}>{d.customer_name || 'Unknown'}</td>
                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)' }}>{d.delivery_person}</td>
                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)' }}>{d.estimated_time}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: sc.bg, color: sc.color }}>{d.status}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <select value={d.status} onChange={e => updateStatus(d.id, e.target.value)} style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer' }}>
                        <option value="pending" style={{ color: 'black' }}>Pending</option>
                        <option value="on_the_way" style={{ color: 'black' }}>On the way</option>
                        <option value="delivered" style={{ color: 'black' }}>Delivered</option>
                      </select>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </PageLayout>
  )
}

export default Deliveries