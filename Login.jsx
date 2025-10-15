import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [busy,setBusy] = useState(false)
  const nav = useNavigate()

  async function handleLogin(e){
    e.preventDefault()
    setBusy(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if(error){
      alert('Login failed: ' + error.message)
      return
    }
    nav('/admin')
  }

  return (
    <div style={{padding:20}}>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div><label>Email: <input value={email} onChange={e=>setEmail(e.target.value)} required/></label></div>
        <div><label>Password: <input type='password' value={password} onChange={e=>setPassword(e.target.value)} required/></label></div>
        <div style={{marginTop:10}}><button type='submit' disabled={busy}>{busy? 'Signing...' : 'Sign in'}</button></div>
      </form>
      <p>Use admin emails you created in Supabase and password <code>admin123</code>.</p>
    </div>
  )
}
