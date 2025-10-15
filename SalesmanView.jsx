import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function SalesmanView(){
  const [salesmen, setSalesmen] = useState([])
  const [selected, setSelected] = useState('')
  const [kpis, setKpis] = useState([])
  const [tab, setTab] = useState('overview')

  useEffect(()=>{ fetchSalesmen() },[])

  async function fetchSalesmen(){
    const { data } = await supabase.from('users').select('*').eq('role','salesman').order('name')
    setSalesmen(data || [])
  }

  async function loadKPIsFor(id){
    setSelected(id)
    const { data } = await supabase.from('daily_data').select('*').eq('salesman_id', id).order('date', {ascending:false}).limit(100)
    setKpis(data||[])
  }

  const overview = () => {
    // calculate aggregates for selected
    const totalKCH = kpis.filter(k=>k.kpi_name.toLowerCase().includes('kch')).reduce((s,v)=>s+Number(v.value||0),0)
    const totalBintang = kpis.filter(k=>k.kpi_name.toLowerCase().includes('bintang')).reduce((s,v)=>s+Number(v.value||0),0)
    const totalSales = totalKCH + totalBintang
    return (
      <div>
        <h3>Overview</h3>
        <p>KCH: {totalKCH}</p>
        <p>Bintang Toedjoe: {totalBintang}</p>
        <p><strong>Total Sales: {totalSales}</strong></p>
      </div>
    )
  }

  return (
    <div style={{padding:20}}>
      <h2>Salesman View</h2>
      <div>
        <label>Select salesman: </label>
        <select onChange={e=>loadKPIsFor(e.target.value)} value={selected}>
          <option value=''>--choose--</option>
          {salesmen.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {selected && (
        <div style={{marginTop:12}}>
          <div style={{marginBottom:10}}>
            <button onClick={()=>setTab('overview')} style={{marginRight:6}}>Overview</button>
            <button onClick={()=>setTab('activity')} style={{marginRight:6}}>Activity</button>
            <button onClick={()=>setTab('emos')} style={{marginRight:6}}>EMOS</button>
            <button onClick={()=>setTab('product')} style={{marginRight:6}}>Product Focus</button>
            <button onClick={()=>setTab('programs')}>Programs</button>
          </div>

          {tab==='overview' && overview()}
          {tab==='activity' && <div><h3>Activity</h3><ul>{kpis.filter(k=>['Active Outlet','FBO3','PCO','IPC'].includes(k.kpi_name)).map(x=> <li key={x.id}>{x.kpi_name}: {x.value} ({x.date})</li>)}</ul></div>}
          {tab==='emos' && <div><h3>EMOS</h3><ul>{kpis.filter(k=>k.kpi_name.toLowerCase().includes('emos')).map(x=> <li key={x.id}>{x.kpi_name}: {x.value}</li>)}</ul></div>}
          {tab==='product' && <div><h3>Product Focus</h3><p>Targets and actuals per product (from product_focus table)</p></div>}
          {tab==='programs' && <div><h3>Programs</h3><p>Programs this month will appear here (from programs table)</p></div>}
        </div>
      )}
    </div>
  )
}
