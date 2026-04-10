import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getDoctorByUserId, getDoctorAppointments, addAppointmentNotes, updateAppointmentStatus, updateDoctor } from '../services/api';
import { toast } from 'react-toastify';

const sidebarLinks = [
  { path:'/doctor/dashboard',    icon:'◈', label:'Dashboard'    },
  { path:'/doctor/appointments', icon:'◷', label:'Appointments' },
  { path:'/doctor/profile',      icon:'○', label:'My Profile'   },
];

function DoctorHome({ doctor, appointments }) {
  const stats = [
    { label:'Total',     value:appointments.length,                                      icon:'◷', bg:'rgba(45,212,191,0.10)',  color:'#2dd4bf' },
    { label:'Pending',   value:appointments.filter(a=>a.status==='PENDING').length,      icon:'⚡', bg:'rgba(251,191,36,0.10)',  color:'#fbbf24' },
    { label:'Confirmed', value:appointments.filter(a=>a.status==='CONFIRMED').length,    icon:'✓', bg:'rgba(74,222,128,0.10)',  color:'#4ade80' },
    { label:'Completed', value:appointments.filter(a=>a.status==='COMPLETED').length,    icon:'★', bg:'rgba(201,168,76,0.10)',  color:'#c9a84c' },
  ];
  const upcoming = appointments.filter(a=>a.status==='PENDING'||a.status==='CONFIRMED').slice(0,5);
  return (
    <div className="fade-up">
      <div className="page-header">
        <div>
          <h2>Good day, Dr. {doctor?.user?.name?.split(' ').pop()}</h2>
          <p>{doctor?.specialization} · {doctor?.qualification}</p>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:'11px', color:'var(--white-dim)', letterSpacing:'0.06em', textTransform:'uppercase' }}>Consultation Fee</div>
          <div style={{ fontFamily:'Playfair Display, serif', fontSize:'22px', color:'var(--gold)', marginTop:'2px' }}>₹{doctor?.consultationFee}</div>
        </div>
      </div>
      <div className="four-col" style={{ marginBottom:'24px' }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background:s.bg }}><span style={{ fontSize:'16px', color:s.color }}>{s.icon}</span></div>
            <div><div className="stat-val">{s.value}</div><div className="stat-lbl">{s.label}</div></div>
          </div>
        ))}
      </div>
      <div className="panel">
        <div className="panel-title">Upcoming Appointments</div>
        {upcoming.length===0
          ? <p style={{ fontSize:'13px', color:'var(--white-dim)' }}>No upcoming appointments.</p>
          : upcoming.map(a => (
            <div key={a.id} className="appt-row">
              <div>
                <div style={{ fontSize:'14px', fontWeight:'500', color:'var(--white)' }}>{a.patient?.user?.name}</div>
                <div style={{ fontSize:'12px', color:'var(--white-dim)', marginTop:'3px' }}>{a.symptoms?.substring(0,60)}...</div>
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

function DoctorAppointments({ appointments, setAppointments }) {
  const [modal, setModal] = useState(null);
  const [notes, setNotes] = useState('');

  const handleStatus = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      setAppointments(prev => prev.map(a => a.id===id ? {...a, status} : a));
      toast.success('Updated');
    } catch { toast.error('Failed'); }
  };

  const handleNotes = async () => {
    try {
      await addAppointmentNotes(modal, notes);
      setAppointments(prev => prev.map(a => a.id===modal ? {...a, notes, status:'COMPLETED'} : a));
      toast.success('Notes saved');
      setModal(null); setNotes('');
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="fade-up">
      <div className="page-header"><div><h2>Appointments</h2><p>Manage your patient schedule</p></div></div>
      <div className="panel">
        <table>
          <thead><tr><th>Patient</th><th>Date</th><th>Time</th><th>Symptoms</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {appointments.map(a => (
              <tr key={a.id}>
                <td><strong>{a.patient?.user?.name}</strong></td>
                <td>{a.appointmentDate}</td>
                <td>{a.appointmentTime}</td>
                <td style={{ maxWidth:'180px', fontSize:'12px' }}>{a.symptoms}</td>
                <td><span className={`badge badge-${a.status?.toLowerCase()}`}>{a.status}</span></td>
                <td>
                  <div style={{ display:'flex', gap:'6px' }}>
                    {a.status==='PENDING' && (
                      <button className="btn btn-teal btn-sm" onClick={()=>handleStatus(a.id,'CONFIRMED')}>Confirm</button>
                    )}
                    {(a.status==='CONFIRMED'||a.status==='PENDING') && (
                      <button className="btn btn-ghost btn-sm" onClick={()=>{setModal(a.id);setNotes('');}}>Notes</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-wrap">
          <div className="modal">
            <h3>Consultation Notes</h3>
            <p className="modal-sub">Add diagnosis and prescription for this appointment</p>
            <div className="form-group">
              <label>Diagnosis & Prescription</label>
              <textarea rows={5} value={notes} onChange={e=>setNotes(e.target.value)}
                placeholder="Patient diagnosis, medications prescribed, follow-up instructions..."
                style={{ resize:'vertical' }} />
            </div>
            <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end', marginTop:'8px' }}>
              <button className="btn btn-ghost" onClick={()=>setModal(null)}>Cancel</button>
              <button className="btn btn-gold" onClick={handleNotes}>Save & Complete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DoctorProfile({ doctor, setDoctor }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  useEffect(() => { if(doctor) setForm({...doctor}); }, [doctor]);
  const handleSave = async () => {
    try { const res = await updateDoctor(doctor.id, form); setDoctor(res.data); setEditing(false); toast.success('Profile updated'); }
    catch { toast.error('Update failed'); }
  };
  if(!doctor) return <div className="loading">Loading...</div>;
  const fields = [
    { label:'Full Name',     value:doctor.user?.name,     key:null },
    { label:'Email',         value:doctor.user?.email,    key:null },
    { label:'Specialization',value:form.specialization,   key:'specialization' },
    { label:'Qualification', value:form.qualification,    key:'qualification'  },
    { label:'Experience (yrs)',value:form.yearsOfExperience, key:'yearsOfExperience', type:'number' },
    { label:'Fee (₹)',       value:form.consultationFee,  key:'consultationFee', type:'number' },
    { label:'Available Days',value:form.availableDays,    key:'availableDays'  },
    { label:'Available Time',value:form.availableTime,    key:'availableTime'  },
    { label:'Phone',         value:form.phoneNumber,      key:'phoneNumber'    },
  ];
  return (
    <div className="fade-up">
      <div className="page-header">
        <div><h2>My Profile</h2><p>Manage your professional information</p></div>
        <button className="btn btn-gold" onClick={() => editing ? handleSave() : setEditing(true)}>
          {editing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>
      <div className="panel">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          {fields.map(f => (
            <div key={f.label} className="form-group" style={{ marginBottom:0 }}>
              <label>{f.label}</label>
              {editing && f.key
                ? <input type={f.type||'text'} value={form[f.key]||''} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} />
                : <div style={{ padding:'11px 14px', background:'var(--white-faint)', border:'1px solid var(--border)', borderRadius:'var(--radius)', fontSize:'13px', color:'var(--white-dim)' }}>{f.value||'—'}</div>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  useEffect(() => {
    if(user?.userId) {
      getDoctorByUserId(user.userId).then(r => {
        setDoctor(r.data);
        getDoctorAppointments(r.data.id).then(res=>setAppointments(res.data));
      }).catch(()=>toast.error('Failed to load profile'));
    }
  }, [user]);
  return (
    <div style={{ minHeight:'100vh', position:'relative', zIndex:1 }}>
      <Navbar title="Doctor Portal" />
      <div style={{ display:'flex' }}>
        <Sidebar links={sidebarLinks} />
        <main style={{ flex:1, padding:'32px' }}>
          <Routes>
            <Route path="dashboard"    element={<DoctorHome doctor={doctor} appointments={appointments} />} />
            <Route path="appointments" element={<DoctorAppointments appointments={appointments} setAppointments={setAppointments} />} />
            <Route path="profile"      element={<DoctorProfile doctor={doctor} setDoctor={setDoctor} />} />
            <Route path="*"            element={<Navigate to="dashboard" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
