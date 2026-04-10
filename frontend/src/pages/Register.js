import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register as registerApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SPECS = ['Cardiology','Neurology','Orthopedics','Dermatology','Pediatrics','General Medicine','ENT','Ophthalmology','Gynecology','Psychiatry','Oncology'];

export default function Register() {
  const [role, setRole] = useState('PATIENT');
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'PATIENT' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const set = (k,v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await registerApi({ ...form, role });
      login(res.data); toast.success('Account created!');
      if (role==='ADMIN') navigate('/admin/dashboard');
      else if (role==='DOCTOR') navigate('/doctor/dashboard');
      else navigate('/patient/dashboard');
    } catch (err) { toast.error(err.response?.data || 'Registration failed');
    } finally { setLoading(false); }
  };

  const roles = [
    { id:'PATIENT', label:'Patient',  icon:'🤒', desc:'Book & track appointments' },
    { id:'DOCTOR',  label:'Doctor',   icon:'👨‍⚕️', desc:'Manage your practice'     },
    { id:'ADMIN',   label:'Admin',    icon:'👑', desc:'Full system control'        },
  ];

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px', position:'relative' }}>
      <div style={{ position:'absolute', top:'20%', left:'8%', width:'350px', height:'350px', borderRadius:'50%', background:'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)', pointerEvents:'none' }} />

      <div style={{ width:'100%', maxWidth:'540px', position:'relative', zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:'28px' }}>
          <div style={{ display:'inline-flex', width:'48px', height:'48px', borderRadius:'14px', background:'linear-gradient(135deg, #c9a84c, #e8c97a)', alignItems:'center', justifyContent:'center', fontSize:'22px', marginBottom:'14px', boxShadow:'0 6px 24px rgba(201,168,76,0.22)' }}>+</div>
          <h1 style={{ fontFamily:'Playfair Display, serif', fontSize:'24px', fontWeight:'500', color:'var(--white)', marginBottom:'4px' }}>Create your account</h1>
          <p style={{ fontSize:'13px', color:'var(--white-dim)' }}>Join MediCare Hospital Management System</p>
        </div>

        <div style={{ background:'rgba(238,242,255,0.03)', border:'1px solid rgba(238,242,255,0.07)', borderRadius:'20px', padding:'28px', backdropFilter:'blur(24px)' }}>
          <div style={{ fontSize:'11px', letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'14px', fontWeight:'500' }}>Select your role</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', marginBottom:'22px' }}>
            {roles.map(r => (
              <div key={r.id} onClick={() => { setRole(r.id); set('role', r.id); }}
                style={{ padding:'12px', borderRadius:'10px', cursor:'pointer', textAlign:'center', transition:'all 0.2s',
                  border: role===r.id ? '1px solid rgba(201,168,76,0.35)' : '1px solid rgba(238,242,255,0.07)',
                  background: role===r.id ? 'rgba(201,168,76,0.08)' : 'rgba(238,242,255,0.02)',
                }}>
                <div style={{ fontSize:'20px', marginBottom:'4px' }}>{r.icon}</div>
                <div style={{ fontSize:'12px', fontWeight:'500', color: role===r.id ? 'var(--gold)' : 'var(--white)' }}>{r.label}</div>
                <div style={{ fontSize:'10px', color:'var(--white-dim)', marginTop:'2px' }}>{r.desc}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
              <div className="form-group" style={{ marginBottom:0 }}><label>Full Name</label><input placeholder="Dr. John Doe" value={form.name} onChange={e=>set('name',e.target.value)} required /></div>
              <div className="form-group" style={{ marginBottom:0 }}><label>Email</label><input type="email" placeholder="john@hospital.com" value={form.email} onChange={e=>set('email',e.target.value)} required /></div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'12px' }}>
              <div className="form-group" style={{ marginBottom:0 }}><label>Password</label><input type="password" placeholder="Min 6 characters" value={form.password} onChange={e=>set('password',e.target.value)} required /></div>
              <div className="form-group" style={{ marginBottom:0 }}><label>Phone</label><input placeholder="+91 9876543210" value={form.phoneNumber||''} onChange={e=>set('phoneNumber',e.target.value)} /></div>
            </div>

            {role==='DOCTOR' && (
              <div style={{ marginTop:'12px', padding:'16px', background:'rgba(45,212,191,0.04)', border:'1px solid rgba(45,212,191,0.1)', borderRadius:'10px' }}>
                <div style={{ fontSize:'10px', color:'var(--teal)', fontWeight:'500', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'12px' }}>Doctor Details</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                  <div className="form-group" style={{ marginBottom:0 }}><label>Specialization</label>
                    <select value={form.specialization||''} onChange={e=>set('specialization',e.target.value)} required>
                      <option value="">Select...</option>
                      {SPECS.map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom:0 }}><label>Qualification</label><input placeholder="MBBS, MD" value={form.qualification||''} onChange={e=>set('qualification',e.target.value)} required /></div>
                  <div className="form-group" style={{ marginBottom:0 }}><label>Experience (yrs)</label><input type="number" placeholder="5" value={form.yearsOfExperience||''} onChange={e=>set('yearsOfExperience',e.target.value)} required /></div>
                  <div className="form-group" style={{ marginBottom:0 }}><label>Consultation Fee (₹)</label><input type="number" placeholder="500" value={form.consultationFee||''} onChange={e=>set('consultationFee',e.target.value)} required /></div>
                  <div className="form-group" style={{ marginBottom:0 }}><label>Available Days</label><input placeholder="Mon-Fri" value={form.availableDays||''} onChange={e=>set('availableDays',e.target.value)} /></div>
                  <div className="form-group" style={{ marginBottom:0 }}><label>Available Time</label><input placeholder="9AM-5PM" value={form.availableTime||''} onChange={e=>set('availableTime',e.target.value)} /></div>
                </div>
              </div>
            )}

            {role==='PATIENT' && (
              <div style={{ marginTop:'12px', padding:'16px', background:'rgba(167,139,250,0.04)', border:'1px solid rgba(167,139,250,0.1)', borderRadius:'10px' }}>
                <div style={{ fontSize:'10px', color:'var(--purple)', fontWeight:'500', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'12px' }}>Patient Details</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                  <div className="form-group" style={{ marginBottom:0 }}><label>Date of Birth</label><input type="date" value={form.dateOfBirth||''} onChange={e=>set('dateOfBirth',e.target.value)} /></div>
                  <div className="form-group" style={{ marginBottom:0 }}><label>Gender</label>
                    <select value={form.gender||''} onChange={e=>set('gender',e.target.value)}>
                      <option value="">Select...</option><option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom:0 }}><label>Blood Group</label>
                    <select value={form.bloodGroup||''} onChange={e=>set('bloodGroup',e.target.value)}>
                      <option value="">Select...</option>
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b=><option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom:0 }}><label>Address</label><input placeholder="City, State" value={form.address||''} onChange={e=>set('address',e.target.value)} /></div>
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-gold" style={{ width:'100%', padding:'12px', fontSize:'14px', justifyContent:'center', marginTop:'20px' }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="gold-line" style={{ margin:'20px 0' }} />
          <p style={{ textAlign:'center', fontSize:'13px', color:'var(--white-dim)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'var(--gold)', textDecoration:'none', fontWeight:'500' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
