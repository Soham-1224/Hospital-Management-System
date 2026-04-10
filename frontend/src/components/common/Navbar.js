import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const roleColors = {
    ADMIN:   { bg: 'rgba(201,168,76,0.12)',   color: '#c9a84c',  border: 'rgba(201,168,76,0.25)' },
    DOCTOR:  { bg: 'rgba(45,212,191,0.10)',   color: '#2dd4bf',  border: 'rgba(45,212,191,0.2)'  },
    PATIENT: { bg: 'rgba(167,139,250,0.10)',  color: '#a78bfa',  border: 'rgba(167,139,250,0.2)' },
  };
  const rc = roleColors[user?.role] || roleColors.PATIENT;

  return (
    <nav style={{
      height: '62px', background: 'rgba(8,13,26,0.92)',
      backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(238,242,255,0.07)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          background: 'linear-gradient(135deg, #c9a84c, #e8c97a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '15px', flexShrink: 0,
        }}>+</div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--white)', letterSpacing: '0.01em' }}>
            MediCare HMS
          </div>
          <div style={{ fontSize: '10px', color: 'var(--white-dim)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {title}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '13px', color: 'var(--white)', fontWeight: '500' }}>{user?.name}</div>
          <div style={{ fontSize: '10px', color: 'var(--white-dim)', marginTop: '1px' }}>{user?.email}</div>
        </div>
        <div style={{
          padding: '3px 10px', borderRadius: '20px', fontSize: '10px',
          fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase',
          background: rc.bg, color: rc.color, border: `1px solid ${rc.border}`,
        }}>{user?.role}</div>
        <button onClick={handleLogout} className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: '12px' }}>
          Sign out
        </button>
      </div>
    </nav>
  );
}
