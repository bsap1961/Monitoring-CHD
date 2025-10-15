import React from 'react'
import { Link } from 'react-router-dom'

export default function App(){
  return (
    <div style={{padding:20}}>
      <h1>Sales Monitoring</h1>
      <p>Modes:</p>
      <ul>
        <li><Link to='/admin'>Admin (login required)</Link></li>
        <li><Link to='/salesman'>Salesman view</Link></li>
      </ul>
      <p>Deploy notes: visit /login to sign in as admin.</p>
    </div>
  )
}
