import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import * as XLSX from 'xlsx'
import { useNavigate } from 'react-router-dom'

function TabButton({active, onClick, children}){
  return <button style={{marginRight:8, padding:8, background: active ? '#333' : '#eee', color: active? '#fff':'#000'}} onClick={onClick}>{children}</button>
}

export default function AdminDashboard(){
  const [session, setSession] = useState(null)
  const [tab, setTab] = useState('data-input')
  const [salesmen, setSalesmen] = useState([])
  const [paste, setPaste] = useState('')
  const [targets, setTargets] = useState([])
  const [productFocus, setProductFocus] = useState([])
  const [programs, setPrograms] = useState([])
  const nav = useNavigate()

  useEffect(()=>{
    supabase.auth.getSession().then(r=>setSession(r.data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s)=> setSession(s))
    fetchSalesmen(); fetchTargets(); fetchProductFocus(); fetchPrograms()
    return ()=> listener.unsubscribe()
  },[])

  async function fetchSalesmen(){
    const { data } = await supabase.from('users').select('*').eq('role','salesman').order('name')
    setSalesmen(data || [])
  }
  async function fetchTargets(){
    const { data } = await supabase.from('targets').select('*')
    setTargets(data||[])
  }
  async function fetchProductFocus(){
    const { data } = await supabase.from('product_focus').select('*')
    setProductFocus(data||[])
  }
  async function fetchPrograms(){
    const { data } = await supabase.from('programs').select('*').order('created_at', {ascending:false})
    setPrograms(data||[])
  }

  async function handlePasteImport(){
    const lines = paste.split('\n').map(l=>l.trim()).filter(Boolean)
    for(const line of lines){
      const idx = line.lastIndexOf(' ')
      if(idx === -1) continue
      const name = line.slice(0, idx).trim()
      const valueStr = line.slice(idx+1).trim().replace(/,/g,'')
      const value = parseFloat(valueStr) || 0
      // find or create salesman
      let s = salesmen.find(x=> x.name.toLowerCase() === name.toLowerCase())
      if(!s){
        const { data } = await supabase.from('users').insert([{ name, email: name+'@example.com', password: 'nopass', role:'salesman' }]).select()
        s = data?.[0]
        await fetchSalesmen()
      }
      await supabase.from('daily_data').insert([{ salesman_id: s.id, kpi_name: 'Imported', value, date: new Date().toISOString().slice(0,10) }])
    }
    alert('Import selesai')
    setPaste('')
    fetchSalesmen()
  }

  async function exportExcel(){
    const { data } = await supabase.from('daily_data').select('*, users:users(name)').limit(10000)
    const formatted = (data||[]).map(r=>({ salesman: r.users?.name || r.salesman_id, kpi: r.kpi_name, value: r.value, date: r.date }))
    const ws = XLSX.utils.json_to_sheet(formatted)
    const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'data')
    XLSX.writeFile(wb, 'daily_export.xlsx')
  }

  async function handleLogout(){
    await supabase.auth.signOut()
    nav('/login')
  }

  return (
    <div style={{padding:20}}>
      <h2>Admin Dashboard</h2>
      <div style={{marginBottom:12}}>User: {session?.user?.email || 'unknown'} <button onClick={handleLogout} style={{marginLeft:12}}>Logout</button></div>

      <div style={{marginBottom:12}}>
        <TabButton active={tab==='data-input'} onClick={()=>setTab('data-input')}>Data Input</TabButton>
        <TabButton active={tab==='targets'} onClick={()=>setTab('targets')}>Targets</TabButton>
        <TabButton active={tab==='product'} onClick={()=>setTab('product')}>Product Focus</TabButton>
        <TabButton active={tab==='programs'} onClick={()=>setTab('programs')}>Programs</TabButton>
        <TabButton active={tab==='data-manage'} onClick={()=>setTab('data-manage')}>Data Management</TabButton>
      </div>

      {tab==='data-input' && (
        <section>
          <h3>1. Data Input (paste)</h3>
          <textarea value={paste} onChange={e=>setPaste(e.target.value)} rows={8} cols={80} placeholder='Format per line: [Salesman Name] [Value]'></textarea>
          <br/>
          <button onClick={handlePasteImport}>Import</button>
        </section>
      )}

      {tab==='targets' && (
        <section>
          <h3>2. Targets</h3>
          <p>Per-salesman KPI targets (editable)</p>
          <ul>
            {targets.map(t=> <li key={t.id}>{t.kpi_name} - {t.target_value} (salesman: {t.salesman_id})</li>)}
          </ul>
          <p>Use SQL editor in Supabase or contact developer to add UI edits (scaffold provided).</p>
        </section>
      )}

      {tab==='product' && (
        <section>
          <h3>3. Product Focus</h3>
          <ul>{productFocus.map(p=> <li key={p.id}>{p.product_name} - {p.target_value} (salesman: {p.salesman_id})</li>)}</ul>
          <p>CRUD UI scaffolded; can be extended further.</p>
        </section>
      )}

      {tab==='programs' && (
        <section>
          <h3>4. Programs</h3>
          <button onClick={fetchPrograms}>Refresh Programs</button>
          <ul>
            {programs.map(p=> <li key={p.id}><strong>{p.title}</strong> - {p.description} {p.image_url && <span> (image)</span>}</li>)}
          </ul>
          <p>Program creation with image upload will use Supabase Storage (can be added).</p>
        </section>
      )}

      {tab==='data-manage' && (
        <section>
          <h3>5. Data Management</h3>
          <button onClick={exportExcel}>Export Excel</button>
          <p>Data can be exported as Excel and downloaded.</p>
        </section>
      )}

      <hr/>
      <h4>Salesmen</h4>
      <ul>{salesmen.map(s=> <li key={s.id}>{s.name} ({s.email})</li>)}</ul>
    </div>
  )
}
