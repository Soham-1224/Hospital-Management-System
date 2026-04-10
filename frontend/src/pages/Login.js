import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login as loginApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await loginApi(form);
      login(res.data);
      toast.success('Welcome back!');
      const role = res.data.role;
      if (role === 'ADMIN') navigate('/admin/dashboard');
      else if (role === 'DOCTOR') navigate('/doctor/dashboard');
      else navigate('/patient/dashboard');
    } catch (err) {
      toast.error(err.response?.data || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', position: 'relative',
    }}>
      <div style={{ position: 'absolute', top: '15%', right: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(45,212,191,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ display: 'inline-flex', width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #c9a84c, #e8c97a)', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '16px', boxShadow: '0 8px 32px rgba(201,168,76,0.25)' }}>+</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: '500', color: 'var(--white)', marginBottom: '6px' }}>MediCare HMS</h1>
          <p style={{ fontSize: '13px', color: 'var(--white-dim)' }}>Hospital Management System</p>
        </div>

        <div style={{ background: 'rgba(238,242,255,0.03)', border: '1px solid rgba(238,242,255,0.07)', borderRadius: '20px', padding: '32px', backdropFilter: 'blur(24px)' }}>
          <div style={{ fontSize: '11px', fontWeight: '500', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '22px' }}>Sign in to your account</div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@hospital.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: '12px', fontSize: '14px', justifyContent: 'center', marginTop: '8px' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="gold-line" style={{ margin: '22px 0' }} />
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--white-dim)' }}>
            New to MediCare?{' '}
            <Link to="/register" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: '500' }}>Create an account</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(238,242,255,0.25)', marginTop: '20px', letterSpacing: '0.04em' }}>
          SECURE · HIPAA-INSPIRED · ENTERPRISE GRADE
        </p>
      </div>
    </div>
  );
}
