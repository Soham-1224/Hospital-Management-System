import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { getAdminStats, getAllDoctors, getAllPatients, getAllAppointments, updateAppointmentStatus } from '../services/api';
import { toast } from 'react-toastify';

const sidebarLinks = [
  { path:'/admin/dashboard',    icon:'◈', label:'Dashboard'    },
  { path:'/admin/doctors',      icon:'⚕', label:'Doctors'      },
  { path:'/admin/patients',     icon:'♡', label:'Patients'     },
  { path:'/admin/appointments', icon:'◷', label:'Appointments' },
];

function AdminHome() {
  const [stats, setStats] = useState(null);
  useEffect(() => { getAdminStats().then(r=>setStats(r.data)).catch(()=>{}); }, []);
  const cards = [
    { label:'Total Doctors',        value:stats?.totalDoctors,        icon:'⚕', bg:'rgba(201,168,76,0.10)',  color:'#c9a84c'  },
    { label:'Total Patients',       value:stats?.totalPatients,       icon:'♡', bg:'rgba(167,139,250,0.10)', color:'#a78bfa'  },
    { label:'Total Appointments',   value:stats?.totalAppointments,   icon:'◷', bg:'rgba(45,212,191,0.10)',  color:'#2dd4bf'  },
    { label:'Pending Appointments', value:stats?.pendingAppointments, icon:'⚡', bg:'rgba(251,191,36,0.10)',  color:'#fbbf24'  },
  ];
  return (
    <div className="fade-up">
      <div className="page-header">
        <div><h2>Overview</h2><p>Hospital performance at a glance</p></div>
      </div>
      <div className="four-col" style={{ marginBottom:'24px' }}>
        {cards.map(c => (
          <div key={c.label} className="stat-card">
            <div className="stat-icon" style={{ background:c.bg }}>
              <span style={{ fontSize:'18px', color:c.color }}>{c.icon}</span>
            </div>
            <div>
              <div className="stat-val">{stats ? c.value : '—'}</div>
              <div className="stat-lbl">{c.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="panel">
        <div className="panel-title">Recent Activity</div>
        <p style={{ fontSize:'13px', color:'var(--white-dim)', lineHeight:'1.6' }}>All systems operational. Use the sidebar to manage doctors, patients, and appointments.</p>
      </div>
    </div>
  );
}

function DoctorsTab() {
  const [doctors, setDoctors] = useState([]);
  useEffect(() => { getAllDoctors().then(r=>setDoctors(r.data)); }, []);
  return (
    <div className="fade-up">
      <div className="page-header"><div><h2>Doctors</h2><p>{doctors.length} registered physicians</p></div></div>
      <div className="panel">
        <table>
          <thead><tr><th>Physician</th><th>Specialization</th><th>Qualification</th><th>Experience</th><th>Fee</th><th>Availability</th></tr></thead>
          <tbody>
            {doctors.map(d => (
              <tr key={d.id}>
                <td><strong>{d.user?.name}</strong><div style={{ fontSize:'11px', color:'var(--gold)', marginTop:'2px' }}>{d.user?.email}</div></td>
                <td>{d.specialization}</td><td>{d.qualification}</td>
                <td>{d.yearsOfExperience} yrs</td>
                <td style={{ color:'var(--green)', fontWeight:'500' }}>₹{d.consultationFee}</td>
                <td style={{ fontSize:'11px' }}>{d.availableDays}<br/>{d.availableTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PatientsTab() {
  const [patients, setPatients] = useState([]);
  useEffect(() => { getAllPatients().then(r=>setPatients(r.data)); }, []);
  return (
    <div className="fade-up">
      <div className="page-header"><div><h2>Patients</h2><p>{patients.length} registered patients</p></div></div>
      <div className="panel">
        <table>
          <thead><tr><th>Patient</th><th>Gender</th><th>Blood Group</th><th>Phone</th><th>Address</th></tr></thead>
          <tbody>
            {patients.map(p => (
              <tr key={p.id}>
                <td><strong>{p.user?.name}</strong><div style={{ fontSize:'11px', color:'var(--purple)', marginTop:'2px' }}>{p.user?.email}</div></td>
                <td>{p.gender}</td>
                <td><span style={{ background:'var(--red-dim)', color:'var(--red)', border:'1px solid rgba(248,113,113,0.18)', padding:'2px 8px', borderRadius:'6px', fontSize:'11px', fontWeight:'500' }}>{p.bloodGroup}</span></td>
                <td>{p.phoneNumber}</td><td>{p.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AppointmentsTab() {
  const [appointments, setAppointments] = useState([]);
  useEffect(() => { getAllAppointments().then(r=>setAppointments(r.data)); }, []);
  const handleStatus = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      setAppointments(prev => prev.map(a => a.id===id ? {...a, status} : a));
      toast.success('Status updated');
    } catch { toast.error('Failed'); }
  };
  return (
    <div className="fade-up">
      <div className="page-header"><div><h2>Appointments</h2><p>{appointments.length} total appointments</p></div></div>
      <div className="panel">
        <table>
          <thead><tr><th>Patient</th><th>Doctor</th><th>Date & Time</th><th>Status</th><th>Manage</th></tr></thead>
          <tbody>
            {appointments.map(a => (
              <tr key={a.id}>
                <td><strong>{a.patient?.user?.name}</strong></td>
                <td>{a.doctor?.user?.name}<div style={{ fontSize:'11px', color:'var(--teal)', marginTop:'2px' }}>{a.doctor?.specialization}</div></td>
                <td>{a.appointmentDate}<div style={{ fontSize:'11px', color:'var(--white-dim)' }}>{a.appointmentTime}</div></td>
                <td><span className={`badge badge-${a.status?.toLowerCase()}`}>{a.status}</span></td>
                <td>
                  <select value={a.status} onChange={e=>handleStatus(a.id, e.target.value)}
                    style={{ padding:'5px 8px', background:'var(--white-faint)', border:'1px solid var(--border)', borderRadius:'7px', color:'var(--white)', fontSize:'11px', cursor:'pointer' }}>
                    <option>PENDING</option><option>CONFIRMED</option><option>COMPLETED</option><option>CANCELLED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div style={{ minHeight:'100vh', position:'relative', zIndex:1 }}>
      <Navbar title="Admin Console" />
      <div style={{ display:'flex' }}>
        <Sidebar links={sidebarLinks} />
        <main style={{ flex:1, padding:'32px', maxWidth:'calc(100% - 220px)' }}>
          <Routes>
            <Route path="dashboard"    element={<AdminHome />} />
            <Route path="doctors"      element={<DoctorsTab />} />
            <Route path="patients"     element={<PatientsTab />} />
            <Route path="appointments" element={<AppointmentsTab />} />
            <Route path="*"            element={<Navigate to="dashboard" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
