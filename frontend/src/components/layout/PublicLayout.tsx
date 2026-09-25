import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Leaf, Menu, X, ArrowUpRight } from 'lucide-react';
import { useAuthStore } from '../../services/authStore';

export const PublicLayout: React.FC = () => {
  const [open,setOpen]=useState(false);
  const location=useLocation();
  const {user}=useAuthStore();
  const requestedDesign = new URLSearchParams(location.search).get('design');
  const direction = requestedDesign === 'blue' || requestedDesign === 'clay' ? requestedDesign : 'sage';
  useEffect(() => {
    const wasDark = document.documentElement.classList.contains('dark');
    document.documentElement.classList.remove('dark');
    return () => { if (wasDark) document.documentElement.classList.add('dark'); };
  }, []);
  const nav=[['How it works','/how-it-works'],['Our approach','/about'],['Find care','/doctors']];
  return <div className={`public-wellness direction-${direction}`}><a href="#main-content" className="skip-link">Skip to content</a><header className="wellness-header"><Link to="/" className="wellness-brand" aria-label="Vitamin Deficiency home"><span className="brand-mark"><Leaf size={23}/></span><span>Vitamin Deficiency<small>NUTRITION & WELLBEING</small></span></Link><nav aria-label="Main navigation" className={open?'wellness-nav is-open':'wellness-nav'}>{nav.map(([label,url])=><Link key={url} to={url} aria-current={location.pathname===url?'page':undefined} onClick={()=>setOpen(false)}>{label}</Link>)}<Link className="nav-account" to={user?'/dashboard':'/login'} onClick={()=>setOpen(false)}>{user?'My dashboard':'Sign in'} <ArrowUpRight size={16}/></Link></nav><button className="menu-control" onClick={()=>setOpen(!open)} aria-expanded={open} aria-label={open?'Close navigation':'Open navigation'}>{open?<X/>:<Menu/>}</button></header><main id="main-content"><Outlet/></main><footer className="wellness-footer"><div className="footer-top"><Link className="wellness-brand" to="/"><Leaf size={25}/><span>Vitamin Deficiency<small>A LITTLE MORE UNDERSTANDING.</small></span></Link><p>Thoughtful tools for everyday nutrition<br/>and conversations about your health.</p><div><Link to="/about">Our approach</Link><Link to="/disclaimer">Medical disclaimer</Link><Link to="/doctors">Find care</Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Vitamin Deficiency</span><span>Educational support. Not a diagnosis.</span></div></footer></div>;
};
