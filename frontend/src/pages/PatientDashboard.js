import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getPatientByUserId, getPatientAppointments, getAllDoctors, bookAppointment, cancelAppointment, analyzeSymptoms, updatePatient } from '../services/api';
import { toast } from 'react-toastify';

const sidebarLinks = [
  { path:'/patient/dashboard',    icon:'◈', label:'Dashboard'        },
  { path:'/patient/book',         icon:'+', label:'Book Appointment'  },
  { path:'/patient/appointments', icon:'◷', label:'My Appointments'  },
  { path:'/patient/ai-checker',   icon:'⟡', label:'AI Symptom Check' },
  { path:'/patient/profile',      icon:'○', label:'My Profile'       },
];

function PatientHome({ patient, appointments }) {
  const upcoming = appointments.filter(a=>a.status==='PENDING'||a.status==='CONFIRMED');
  const stats = [
    { label:'Total',     value:appointments.length,                                   icon:'◷', bg:'rgba(45,212,191,0.10)',  color:'#2dd4bf' },
    { label:'Upcoming',  value:upcoming.length,                                        icon:'⚡', bg:'rgba(251,191,36,0.10)',  color:'#fbbf24' },
    { label:'Completed', value:appointments.filter(a=>a.status==='COMPLETED').length, icon:'✓', bg:'rgba(74,222,128,0.10)',  color:'#4ade80' },
    { label:'Cancelled', value:appointments.filter(a=>a.status==='CANCELLED').length, icon:'✕', bg:'rgba(248,113,113,0.10)', color:'#f87171' },
  ];
  return (
    <div className="fade-up">
      <div className="page-header">
        <div>
          <h2>Welcome back, {patient?.user?.name?.split(' ')[0]}</h2>
          <p>Your health dashboard</p>
        </div>
      </div>
      <div className="four-col" style={{ marginBottom:'20px' }}>
        {stats.map(s=>(
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background:s.bg }}><span style={{ fontSize:'16px', color:s.color }}>{s.icon}</span></div>
            <div><div className="stat-val">{s.value}</div><div className="stat-lbl">{s.label}</div></div>
          </div>
        ))}
      </div>
      {patient && (
        <div className="hc-grid" style={{ marginBottom:'20px' }}>
          {[
            { icon:'♥', label:'Blood Group', value:patient.bloodGroup },
            { icon:'♀♂', label:'Gender',     value:patient.gender     },
            { icon:'◷',  label:'Date of Birth',value:patient.dateOfBirth },
            { icon:'☏',  label:'Phone',      value:patient.phoneNumber },
          ].map(i=>(
            <div key={i.label} className="hc-item">
              <div style={{ fontSize:'20px', marginBottom:'6px', color:'var(--gold)' }}>{i.icon}</div>
              <div className="hc-val">{i.value||'—'}</div>
              <div className="hc-lbl">{i.label}</div>
            </div>
          ))}
        </div>
      )}
      <div className="panel">
        <div className="panel-title">Upcoming Appointments</div>
        {upcoming.length===0
          ? <p style={{ fontSize:'13px', color:'var(--white-dim)' }}>No upcoming appointments. Book one now!</p>
          : upcoming.slice(0,4).map(a=>(
            <div key={a.id} className="appt-row">
              <div>
                <div style={{ fontSize:'14px', fontWeight:'500', color:'var(--white)' }}>Dr. {a.doctor?.user?.name}</div>
                <div style={{ fontSize:'12px', color:'var(--teal)', marginTop:'2px' }}>{a.doctor?.specialization}</div>
              </div>
              <div style={{ textAlign:'right', display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'6px' }}>
                <div style={{ fontSize:'12px', color:'var(--white-dim)' }}>{a.appointmentDate} · {a.appointmentTime}</div>
                <span className={`badge badge-${a.status?.toLowerCase()}`}>{a.status}</span>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

function BookAppointment({ patient, appointments, setAppointments }) {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ doctorId:'', date:'', time:'', symptoms:'' });
  const [loading, setLoading] = useState(false);
  useEffect(() => { getAllDoctors().then(r=>setDoctors(r.data)); }, []);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const filtered = doctors.filter(d =>
    d.specialization?.toLowerCase().includes(search.toLowerCase()) ||
    d.user?.name?.toLowerCase().includes(search.toLowerCase())
  );
  const handleBook = async (e) => {
    e.preventDefault();
    if(!patient?.id) return toast.error('Patient profile not found');
    setLoading(true);
    try {
      const res = await bookAppointment({...form, patientId:patient.id});
      setAppointments(prev=>[res.data, ...prev]);
      toast.success('Appointment booked!');
      setForm({ doctorId:'', date:'', time:'', symptoms:'' });
    } catch(err) { toast.error(err.response?.data || 'Booking failed');
    } finally { setLoading(false); }
  };
  return (
    <div className="fade-up">
      <div className="page-header"><div><h2>Book Appointment</h2><p>Choose a doctor and schedule your visit</p></div></div>
      <div className="two-col">
        <div className="panel" style={{ margin:0 }}>
          <div className="panel-title">Select Physician</div>
          <input className="search-input" placeholder="Search by name or specialization..." value={search} onChange={e=>setSearch(e.target.value)} />
          <div style={{ maxHeight:'420px', overflowY:'auto', paddingRight:'4px' }}>
            {filtered.map(d=>(
              <div key={d.id} className={`doctor-card ${String(form.doctorId)===String(d.id)?'selected':''}`}
                onClick={()=>set('doctorId', String(d.id))}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div>
                    <div style={{ fontSize:'14px', fontWeight:'500', color:'var(--white)', marginBottom:'3px' }}>Dr. {d.user?.name}</div>
                    <div style={{ fontSize:'12px', color:'var(--teal)', marginBottom:'3px' }}>{d.specialization}</div>
                    <div style={{ fontSize:'11px', color:'var(--white-dim)' }}>{d.qualification} · {d.yearsOfExperience} yrs exp</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontFamily:'Playfair Display, serif', fontSize:'16px', color:'var(--green)', fontWeight:'500' }}>₹{d.consultationFee}</div>
                    <div style={{ fontSize:'10px', color:'var(--white-dim)', marginTop:'3px' }}>{d.availableDays}</div>
                    <div style={{ fontSize:'10px', color:'var(--white-dim)' }}>{d.availableTime}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel" style={{ margin:0 }}>
          <div className="panel-title">Appointment Details</div>
          <form onSubmit={handleBook}>
            <div className="form-group"><label>Preferred Date</label><input type="date" value={form.date} onChange={e=>set('date',e.target.value)} min={new Date().toISOString().split('T')[0]} required /></div>
            <div className="form-group"><label>Preferred Time</label><input type="time" value={form.time} onChange={e=>set('time',e.target.value)} required /></div>
            <div className="form-group">
              <label>Describe Your Symptoms</label>
              <textarea rows={6} value={form.symptoms} onChange={e=>set('symptoms',e.target.value)}
                placeholder="Describe what you're feeling, since when, severity, any relevant medical history..."
                required style={{ resize:'vertical' }} />
            </div>
            {!form.doctorId && <p style={{ fontSize:'12px', color:'var(--amber)', marginBottom:'12px' }}>← Please select a physician first</p>}
            <button type="submit" className="btn btn-gold" style={{ width:'100%', padding:'12px', justifyContent:'center', fontSize:'14px' }}
              disabled={loading||!form.doctorId}>
              {loading ? 'Booking...' : 'Confirm Appointment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function MyAppointments({ appointments, setAppointments }) {
  const handleCancel = async (id) => {
    if(!window.confirm('Cancel this appointment?')) return;
    try {
      await cancelAppointment(id);
      setAppointments(prev=>prev.map(a=>a.id===id?{...a,status:'CANCELLED'}:a));
      toast.success('Appointment cancelled');
    } catch { toast.error('Failed'); }
  };
  return (
    <div className="fade-up">
      <div className="page-header"><div><h2>My Appointments</h2><p>Your complete appointment history</p></div></div>
      <div className="panel">
        {appointments.length===0
          ? <p style={{ fontSize:'13px', color:'var(--white-dim)' }}>No appointments yet.</p>
          : <table>
              <thead><tr><th>Doctor</th><th>Specialization</th><th>Date</th><th>Time</th><th>Status</th><th>Notes</th><th>Action</th></tr></thead>
              <tbody>
                {appointments.map(a=>(
                  <tr key={a.id}>
                    <td><strong>Dr. {a.doctor?.user?.name}</strong></td>
                    <td>{a.doctor?.specialization}</td>
                    <td>{a.appointmentDate}</td>
                    <td>{a.appointmentTime}</td>
                    <td><span className={`badge badge-${a.status?.toLowerCase()}`}>{a.status}</span></td>
                    <td style={{ maxWidth:'160px', fontSize:'11px', color:'var(--white-dim)' }}>{a.notes||'—'}</td>
                    <td>{(a.status==='PENDING'||a.status==='CONFIRMED') && <button className="btn btn-red btn-sm" onClick={()=>handleCancel(a.id)}>Cancel</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        }
      </div>
    </div>
  );
}

function AIChecker() {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const handleAnalyze = async () => {
    if(!symptoms.trim()) return toast.error('Please describe your symptoms');
    setLoading(true); setResult('');
    try { const res = await analyzeSymptoms(symptoms); setResult(res.data.analysis); }
    catch { toast.error('AI service unavailable. Please try again.'); }
    finally { setLoading(false); }
  };
  const fmt = (text) => text.split('\n').map((line,i)=>{
    if(!line.trim()) return <br key={i}/>;
    if(line.match(/^\*\*/)||line.match(/^[1-4]\./)||line.match(/^(Possible|Recommended|Urgency|General)/i))
      return <div key={i} style={{ fontSize:'11px', fontWeight:'500', letterSpacing:'0.07em', textTransform:'uppercase', color:'var(--gold)', margin:'14px 0 6px' }}>{line.replace(/\*\*/g,'')}</div>;
    if(line.toLowerCase().includes('disclaimer')||line.toLowerCase().includes('not a medical'))
      return <div key={i} style={{ fontSize:'11px', color:'var(--white-dim)', fontStyle:'italic', marginTop:'14px', padding:'10px 12px', background:'var(--white-faint)', borderRadius:'8px', lineHeight:'1.6', border:'1px solid var(--border)' }}>{line}</div>;
    return <div key={i} style={{ fontSize:'13px', color:'var(--white-dim)', lineHeight:'1.7', marginBottom:'3px' }}>{line}</div>;
  });
  return (
    <div className="fade-up">
      <div className="page-header"><div><h2>AI Symptom Checker</h2><p>Powered by Google Gemini AI</p></div></div>
      <div className="two-col">
        <div className="panel" style={{ margin:0 }}>
          <div className="panel-title">Describe Your Symptoms</div>
          <div className="form-group">
            <label>Symptoms</label>
            <textarea rows={9} value={symptoms} onChange={e=>setSymptoms(e.target.value)}
              placeholder="e.g. I have been experiencing severe headaches on one side for the past 3 days, accompanied by nausea and sensitivity to light..."
              style={{ resize:'vertical' }} />
          </div>
          <button className="btn btn-gold" style={{ width:'100%', padding:'12px', justifyContent:'center', fontSize:'14px' }}
            onClick={handleAnalyze} disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze Symptoms'}
          </button>
          <div style={{ marginTop:'14px', padding:'12px', background:'var(--red-dim)', border:'1px solid rgba(248,113,113,0.15)', borderRadius:'var(--radius)', fontSize:'11px', color:'var(--red)', lineHeight:'1.6' }}>
            This AI tool provides general guidance only and does not constitute a medical diagnosis. Always consult a qualified physician.
          </div>
        </div>
        <div className="panel" style={{ margin:0 }}>
          <div className="panel-title">AI Analysis</div>
          {loading && (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'14px', padding:'48px 0', color:'var(--white-dim)' }}>
              <div style={{ width:'40px', height:'40px', border:'2px solid var(--border)', borderTop:'2px solid var(--gold)', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
              <p style={{ fontSize:'13px' }}>Analyzing your symptoms...</p>
            </div>
          )}
          {!loading && !result && (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'12px', padding:'48px 0', color:'var(--white-dim)' }}>
              <div style={{ fontSize:'48px', opacity:0.3 }}>⟡</div>
              <p style={{ fontSize:'13px' }}>Your analysis will appear here</p>
            </div>
          )}
          {result && <div style={{ lineHeight:'1.7' }}>{fmt(result)}</div>}
        </div>
      </div>
    </div>
  );
}

function PatientProfile({ patient, setPatient }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  useEffect(() => { if(patient) setForm({...patient}); }, [patient]);
  const handleSave = async () => {
    try { const res = await updatePatient(patient.id, form); setPatient(res.data); setEditing(false); toast.success('Profile updated'); }
    catch { toast.error('Update failed'); }
  };
  if(!patient) return <div className="loading">Loading...</div>;
  const fields = [
    { label:'Full Name',    value:patient.user?.name,  key:null },
    { label:'Email',        value:patient.user?.email, key:null },
    { label:'Gender',       value:form.gender,         key:'gender'          },
    { label:'Blood Group',  value:form.bloodGroup,     key:'bloodGroup'      },
    { label:'Phone',        value:form.phoneNumber,    key:'phoneNumber'     },
    { label:'Address',      value:form.address,        key:'address'         },
    { label:'Emergency Contact', value:form.emergencyContact, key:'emergencyContact' },
  ];
  return (
    <div className="fade-up">
      <div className="page-header">
        <div><h2>My Profile</h2><p>Manage your health information</p></div>
        <button className="btn btn-gold" onClick={()=>editing?handleSave():setEditing(true)}>
          {editing?'Save Changes':'Edit Profile'}
        </button>
      </div>
      <div className="panel">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          {fields.map(f=>(
            <div key={f.label} className="form-group" style={{ marginBottom:0 }}>
              <label>{f.label}</label>
              {editing&&f.key
                ? <input value={form[f.key]||''} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} />
                : <div style={{ padding:'11px 14px', background:'var(--white-faint)', border:'1px solid var(--border)', borderRadius:'var(--radius)', fontSize:'13px', color:'var(--white-dim)' }}>{f.value||'—'}</div>
              }
            </div>
          ))}
          <div className="form-group" style={{ marginBottom:0, gridColumn:'1/-1' }}>
            <label>Medical History</label>
            {editing
              ? <textarea rows={3} value={form.medicalHistory||''} onChange={e=>setForm(p=>({...p,medicalHistory:e.target.value}))} style={{ resize:'vertical' }} />
              : <div style={{ padding:'11px 14px', background:'var(--white-faint)', border:'1px solid var(--border)', borderRadius:'var(--radius)', fontSize:'13px', color:'var(--white-dim)', minHeight:'60px' }}>{patient.medicalHistory||'—'}</div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PatientDashboard() {
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  useEffect(() => {
    if(user?.userId) {
      getPatientByUserId(user.userId).then(r=>{
        setPatient(r.data);
        getPatientAppointments(r.data.id).then(res=>setAppointments(res.data));
      }).catch(()=>toast.error('Failed to load profile'));
    }
  }, [user]);
  return (
    <div style={{ minHeight:'100vh', position:'relative', zIndex:1 }}>
      <Navbar title="Patient Portal" />
      <div style={{ display:'flex' }}>
        <Sidebar links={sidebarLinks} />
        <main style={{ flex:1, padding:'32px' }}>
          <Routes>
            <Route path="dashboard"    element={<PatientHome patient={patient} appointments={appointments} />} />
            <Route path="book"         element={<BookAppointment patient={patient} appointments={appointments} setAppointments={setAppointments} />} />
            <Route path="appointments" element={<MyAppointments appointments={appointments} setAppointments={setAppointments} />} />
            <Route path="ai-checker"   element={<AIChecker />} />
            <Route path="profile"      element={<PatientProfile patient={patient} setPatient={setPatient} />} />
            <Route path="*"            element={<Navigate to="dashboard" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
