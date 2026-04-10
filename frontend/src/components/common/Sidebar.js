import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ links }) {
  return (
    <aside style={{
      width: '220px', minHeight: 'calc(100vh - 62px)',
      background: 'rgba(8,13,26,0.6)',
      borderRight: '1px solid rgba(238,242,255,0.06)',
      padding: '20px 10px', flexShrink: 0,
      backdropFilter: 'blur(12px)',
    }}>
      {links.map((link) => (
        <NavLink key={link.path} to={link.path}
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', textDecoration: 'none',
            borderRadius: '10px', marginBottom: '3px',
            fontSize: '13px', fontWeight: isActive ? '500' : '400',
            color: isActive ? '#c9a84c' : 'rgba(238,242,255,0.5)',
            background: isActive ? 'rgba(201,168,76,0.08)' : 'transparent',
            border: isActive ? '1px solid rgba(201,168,76,0.15)' : '1px solid transparent',
            transition: 'all 0.18s ease',
          })}>
          <span style={{ fontSize: '15px', width: '20px', textAlign: 'center' }}>{link.icon}</span>
          {link.label}
        </NavLink>
      ))}
    </aside>
  );
}
