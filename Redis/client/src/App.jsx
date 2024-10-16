import React, { useState } from 'react'
import './App.css' // Make sure to create this file for the styles

const App = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-logo">Logo</div>
        <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
          <a href="/">Home</a>
          <a href="/products">Products</a>
          <a href="/orders">Orders</a>
        </div>
        <div className="navbar-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>
      <div className="content">
        {/* Your main content goes here */}
        <h1>Welcome to the App</h1>
      </div>
    </div>
  )
}

export default App