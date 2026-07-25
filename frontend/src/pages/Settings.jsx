import { useState } from 'react'
import PageLayout from '../components/PageLayout'

function Settings() {
  const [shopName, setShopName] = useState('ShopOrders')
  const [businessHours, setBusinessHours] = useState('9:00 AM - 9:00 PM')
  const [deliveryCharge, setDeliveryCharge] = useState('0')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    localStorage.setItem('shopName', shopName)
    localStorage.setItem('businessHours', businessHours)
    localStorage.setItem('deliveryCharge', deliveryCharge)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }

  return (
    <PageLayout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'white', margin: '0 0 4px' }}>⚙️ Settings</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '14px' }}>Configure your shop settings</p>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', padding: '24px', maxWidth: '600px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[
            { label: 'Shop Name', value: shopName, setter: setShopName, placeholder: 'e.g. Kumar Kirana Store' },
            { label: 'Business Hours', value: businessHours, setter: setBusinessHours, placeholder: 'e.g. 9:00 AM - 9:00 PM' },
            // { label: 'Delivery Charge (₹)', value: deliveryCharge, setter: setDeliveryCharge, placeholder: 'e.g. 30' },
          ].map(field => (
            <div key={field.label}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginBottom: '8px', fontWeight: '500' }}>{field.label}</label>
              <input style={inputStyle} value={field.value} onChange={e => field.setter(e.target.value)} placeholder={field.placeholder} />
            </div>
          ))}

          <button onClick={handleSave} style={{ padding: '12px 24px', background: saved ? 'rgba(52,211,153,0.3)' : 'linear-gradient(135deg, #16a34a, #25D366)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', alignSelf: 'flex-start' }}>
            {saved ? '✅ Saved!' : 'Save settings'}
          </button>
        </div>
      </div>
    </PageLayout>
  )
}

export default Settings