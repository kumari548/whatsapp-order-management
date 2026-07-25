import { useState, useEffect } from 'react'
import PageLayout from '../components/PageLayout'

function Profile() {
  const [name, setName] = useState(localStorage.getItem('ownerName') || 'Aravind')
  const [phone, setPhone] = useState(localStorage.getItem('ownerPhone') || '')
  const [email, setEmail] = useState(localStorage.getItem('ownerEmail') || '')
  const [photo, setPhoto] = useState(localStorage.getItem('ownerPhoto') || '')
  const [saved, setSaved] = useState(false)

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setPhoto(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    localStorage.setItem('ownerName', name)
    localStorage.setItem('ownerPhone', phone)
    localStorage.setItem('ownerEmail', email)
    localStorage.setItem('ownerPhoto', photo)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }

  return (
    <PageLayout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'white', margin: '0 0 4px' }}>👤 Profile</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '14px' }}>Your personal details</p>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', padding: '24px', maxWidth: '600px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.3)', background: 'linear-gradient(135deg, #16a34a, #25D366)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>
            {photo ? <img src={photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'white', fontWeight: '600', fontSize: '18px' }}>{name || 'Shop Owner'}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '8px' }}>Shop Owner</div>
            <label style={{
              display: 'inline-block', padding: '6px 14px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px', color: 'white',
              fontSize: '12px', cursor: 'pointer',
            }}>
              📷 Change photo
              <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { label: 'Full Name', value: name, setter: setName, placeholder: 'e.g. Aravind Kumar' },
            { label: 'Phone Number', value: phone, setter: setPhone, placeholder: 'e.g. +91 98765 43210' },
            { label: 'Email', value: email, setter: setEmail, placeholder: 'e.g. aravind@shop.com' },
          ].map(field => (
            <div key={field.label}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginBottom: '8px', fontWeight: '500' }}>{field.label}</label>
              <input style={inputStyle} value={field.value} onChange={e => field.setter(e.target.value)} placeholder={field.placeholder} />
            </div>
          ))}

          <button onClick={handleSave} style={{ padding: '12px 24px', background: saved ? 'rgba(52,211,153,0.3)' : 'linear-gradient(135deg, #16a34a, #25D366)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', alignSelf: 'flex-start' }}>
            {saved ? '✅ Saved!' : 'Save profile'}
          </button>
        </div>
      </div>
    </PageLayout>
  )
}

export default Profile