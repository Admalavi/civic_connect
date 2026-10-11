import {useEffect,useState} from 'react';import {Link,useNavigate,useParams} from 'react-router-dom';import toast from 'react-hot-toast';import {Camera,Map,ClipboardCheck} from 'lucide-react';
import {BarChart,Bar,LineChart,Line,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid} from 'recharts';
import api,{errMsg} from '../services/api';import useFetch from '../hooks/useFetch.js';import {useAuth} from '../context/AuthContext.jsx';
import IssueMap from '../components/IssueMap.jsx';import LocationPicker from '../components/LocationPicker.jsx';import ComplaintList from '../components/ComplaintList.jsx';
import {CATS,STATUSES,COLORS,inp,btn,fmt,Field,Badge,Stat,Empty} from '../utils/ui.jsx';

export const Home=()=><div><section className="py-16 text-center space-y-5"><h1 className="text-4xl md:text-5xl font-bold">Report. Track. <span className="text-teal-600">Fix your city.</span></h1><p className="max-w-xl mx-auto text-slate-600">Pin civic problems on a live map, attach photos, and follow every status change until they are resolved.</p>
 <div className="flex flex-wrap gap-3 justify-center"><Link to="/report" className={btn}>Report an Issue</Link><Link to="/map" className="px-4 py-2 border rounded-lg font-medium">View All Issues</Link></div></section>
 <section className="grid md:grid-cols-3 gap-4">{[[Map,'Map-based reporting','Click, drag or search to set the exact location.'],[Camera,'Photo evidence','Upload a photo so authorities see the problem.'],[ClipboardCheck,'Transparent tracking','A timeline shows each status change.']].map(([I,t,d])=><div key={t} className="border rounded-xl p-5"><I className="text-teal-600 mb-2"/><h3 className="font-semibold">{t}</h3><p className="text-sm text-slate-600">{d}</p></div>)}</section></div>;

export function Auth({mode}){const reg=mode==='register';const{login,register}=useAuth();const nav=useNavigate();const[f,setF]=useState({name:'',email:'',password:''});
 const go=async e=>{e.preventDefault();if(reg&&f.name.trim().length<2)return toast.error('Enter your name');if(f.password.length<(reg?6:1))return toast.error('Password must be 6+ characters');
  try{const u=await(reg?register(f):login(f));toast.success('Welcome '+u.name);nav(u.role==='admin'?'/admin':'/dashboard')}catch(e){toast.error(errMsg(e))}};
 return <form onSubmit={go} className="max-w-sm mx-auto border rounded-xl p-6 mt-8"><h1 className="text-2xl font-bold mb-4">{reg?'Create citizen account':'Log in'}</h1>
 {reg&&<Field label="Name"><input className={inp} value={f.name} onChange={e=>setF({...f,name:e.target.value})}/></Field>}<Field label="Email"><input type="email" required className={inp} value={f.email} onChange={e=>setF({...f,email:e.target.value})}/></Field>
 <Field label="Password"><input type="password" required className={inp} value={f.password} onChange={e=>setF({...f,password:e.target.value})}/></Field><button className={btn+' w-full justify-center'}>{reg?'Register':'Log in'}</button>
 <p className="text-sm mt-3 text-center">{reg?<Link to="/login" className="text-teal-700">Already registered? Log in</Link>:<Link to="/register" className="text-teal-700">New here? Register</Link>}</p></form>}

export function MapPage({admin}){const[f,setF]=useState({category:'',status:''});const{data,loading,err}=useFetch('/complaints/map',f);
 return <div className="space-y-3"><div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl font-bold mr-auto">{admin?'Admin Map View':'Civic Issue Map'}</h1>
 <select aria-label="Category" className={inp+' mt-0 w-auto'} value={f.category} onChange={e=>setF({...f,category:e.target.value})}><option value="">All categories</option>{CATS.map(c=><option key={c}>{c}</option>)}</select>
 <select aria-label="Status" className={inp+' mt-0 w-auto'} value={f.status} onChange={e=>setF({...f,status:e.target.value})}><option value="">All statuses</option>{STATUSES.map(c=><option key={c}>{c}</option>)}</select></div>
 <div className="flex gap-3 text-xs">{STATUSES.map(s=><span key={s} className="flex items-center gap-1"><i className="w-3 h-3 rounded-full" style={{background:COLORS[s]}}/>{s}</span>)}</div>
 {err&&<p className="text-red-600">{err}</p>}{loading&&!data?<p>Loading map…</p>:<IssueMap items={data||[]}/>}</div>}

export function Report(){const nav=useNavigate();const[f,setF]=useState({title:'',description:'',category:'',address:''});const[pos,setPos]=useState(null);const[file,setFile]=useState(null);const[prev,setPrev]=useState('');const[dups,setDups]=useState([]);const[busy,setBusy]=useState(false);
 useEffect(()=>{if(pos&&f.category)api.get('/complaints/duplicates',{params:{lat:pos[0],lng:pos[1],category:f.category}}).then(r=>setDups(r.data)).catch(()=>{});else setDups([])},[pos,f.category]);
 const pick=e=>{const x=e.target.files[0];if(!x)return;if(!/^image\/(jpe?g|png|webp)$/.test(x.type)||x.size>5e6){e.target.value='';return toast.error('Use a JPG/PNG/WEBP image up to 5MB')}setFile(x);setPrev(URL.createObjectURL(x))};
 const submit=async e=>{e.preventDefault();if(f.title.trim().length<5)return toast.error('Title needs 5+ characters');if(f.description.trim().length<10)return toast.error('Description needs 10+ characters');if(!f.category)return toast.error('Choose a category');if(!pos)return toast.error('Select a location on the map');
  const d=new FormData();Object.entries(f).forEach(([k,v])=>d.append(k,v));d.append('lat',pos[0]);d.append('lng',pos[1]);if(file)d.append('photo',file);setBusy(true);
  try{const{data}=await api.post('/complaints',d);toast.success('Submitted: '+data.complaintId);nav('/complaints/'+data.complaintId)}catch(e){toast.error(errMsg(e))}finally{setBusy(false)}};
 return <form onSubmit={submit} className="grid lg:grid-cols-2 gap-6"><div><h1 className="text-2xl font-bold mb-3">Report a New Issue</h1>
 <Field label="Title"><input className={inp} value={f.title} onChange={e=>setF({...f,title:e.target.value})}/></Field><Field label="Description"><textarea rows={4} className={inp} value={f.description} onChange={e=>setF({...f,description:e.target.value})}/></Field>
 <Field label="Category"><select className={inp} value={f.category} onChange={e=>setF({...f,category:e.target.value})}><option value="">Select…</option>{CATS.map(c=><option key={c}>{c}</option>)}</select></Field>
 <Field label="Address / landmark (optional)"><input className={inp} value={f.address} onChange={e=>setF({...f,address:e.target.value})}/></Field>
 <Field label="Photo (JPG/PNG/WEBP, max 5MB)"><input type="file" accept="image/jpeg,image/png,image/webp" className={inp} onChange={pick}/></Field>{prev&&<img src={prev} alt="Preview" className="h-32 rounded mb-3"/>}
 <div className="flex gap-2"><button disabled={busy} className={btn}>{busy?'Submitting…':'Submit'}</button><button type="button" onClick={()=>nav(-1)} className="px-4 py-2 border rounded-lg">Cancel</button></div></div>
 <div className="space-y-3"><LocationPicker pos={pos} setPos={setPos}/>{!!dups.length&&<div className="border border-amber-400 bg-amber-50 rounded-lg p-3 text-sm"><b>Possible duplicates nearby</b> (rule-based check):<ul className="list-disc ml-5">{dups.map(d=><li key={d._id}><Link target="_blank" className="text-teal-700 underline" to={'/complaints/'+d.complaintId}>{d.title}</Link> – {d.status}</li>)}</ul>You can still submit if yours is different.</div>}</div></form>}

export function Details(){const{id}=useParams();const nav=useNavigate();const{user}=useAuth();const[c,setC]=useState();const[err,setErr]=useState('');const[st,setSt]=useState('');const[remark,setRemark]=useState('');
 const load=()=>api.get('/complaints/'+id).then(r=>{setC(r.data);setSt(r.data.status)}).catch(e=>setErr(errMsg(e)));useEffect(()=>{load()},[id]);
 const upd=async()=>{try{await api.patch(`/complaints/${id}/status`,{status:st,remark});toast.success('Status updated');setRemark('');load()}catch(e){toast.error(errMsg(e))}};
 const del=async()=>{if(!confirm('Withdraw this complaint? This cannot be undone.'))return;try{await api.delete('/complaints/'+id);toast.success('Withdrawn');nav('/my-complaints')}catch(e){toast.error(errMsg(e))}};
 if(err)return <Empty text={err}/>;if(!c)return <p>Loading…</p>;
 return <div className="grid lg:grid-cols-2 gap-6"><div className="space-y-3"><div className="flex items-center gap-2"><h1 className="text-2xl font-bold">{c.title}</h1><Badge status={c.status}/></div><p className="text-sm text-slate-500">{c.complaintId} · {c.category} · {fmt(c.createdAt)}</p>
 {c.photoUrl&&<img src={c.photoUrl} alt={c.title} className="rounded-xl max-h-72"/>}<p>{c.description}</p>{c.address&&<p className="text-sm">📍 {c.address}</p>}<p className="text-xs text-slate-500">Lat {c.location.coordinates[1].toFixed(6)}, Lng {c.location.coordinates[0].toFixed(6)}</p>
 {c.isOwner&&c.status==='Pending'&&<button onClick={del} className="px-3 py-1 border border-red-500 text-red-600 rounded-lg">Withdraw complaint</button>}
 {user?.role==='admin'&&<div className="border rounded-xl p-3 space-y-2"><b>Admin: update status</b><select aria-label="New status" className={inp} value={st} onChange={e=>setSt(e.target.value)}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select><input className={inp} placeholder="Remarks" value={remark} onChange={e=>setRemark(e.target.value)}/><button onClick={upd} className={btn}>Save</button></div>}</div>
 <div className="space-y-4"><IssueMap items={[c]} h="h-64"/><h2 className="font-semibold">Status timeline</h2><ol className="border-l-2 border-teal-600 ml-2 space-y-3">{c.statusHistory.map((h,i)=><li key={i} className="pl-4 text-sm"><b>{h.from?`${h.from} → ${h.to}`:h.to}</b> <span className="text-slate-500">{fmt(h.at)}{h.by?.name&&h.from?` · by ${h.by.name}`:''}</span>{h.remark&&<div>{h.remark}</div>}</li>)}</ol></div></div>}

export const MyComplaints=()=><div><h1 className="text-2xl font-bold mb-3">My Complaints</h1><ComplaintList mine/></div>;
export const AdminComplaints=()=><div><h1 className="text-2xl font-bold mb-3">Manage Complaints</h1><ComplaintList/></div>;

export function Dash({admin}){const{data:s,loading,err}=useFetch('/stats',{scope:admin?'all':'me'});if(err)return <Empty text={err}/>;if(loading)return <p>Loading…</p>;
 return <div className="space-y-6"><h1 className="text-2xl font-bold">{admin?'Admin Dashboard':'My Dashboard'}</h1><div className="grid grid-cols-2 lg:grid-cols-5 gap-3"><Stat label="Total" value={s.total}/><Stat label="Pending" value={s.pending} color={COLORS.Pending}/><Stat label="In Progress" value={s.inProgress} color={COLORS['In Progress']}/><Stat label="Resolved" value={s.resolved} color={COLORS.Resolved}/><Stat label="Resolution rate" value={s.resolutionRate+'%'}/></div>
 {s.total?<div className="grid lg:grid-cols-2 gap-4"><div className="border rounded-xl p-3 h-72"><b className="text-sm">By category</b><ResponsiveContainer><BarChart data={s.byCategory}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name" tick={{fontSize:10}}/><YAxis allowDecimals={false}/><Tooltip/><Bar dataKey="count" fill="#0f766e"/></BarChart></ResponsiveContainer></div>
 <div className="border rounded-xl p-3 h-72"><b className="text-sm">By date</b><ResponsiveContainer><LineChart data={s.byDate}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="date" tick={{fontSize:10}}/><YAxis allowDecimals={false}/><Tooltip/><Line dataKey="count" stroke="#0b2545"/></LineChart></ResponsiveContainer></div></div>:<Empty text="No complaints yet."/>}
 <div><h2 className="font-semibold mb-2">Recent complaints</h2><ul className="divide-y border rounded-xl">{s.recent.map(c=><li key={c._id} className="p-3 flex justify-between"><Link className="text-teal-700" to={'/complaints/'+c.complaintId}>{c.title}</Link><Badge status={c.status}/></li>)}</ul></div></div>}

export function Profile(){const{user}=useAuth();const{data:s}=useFetch('/stats',{scope:'me'});
 return <div className="max-w-md space-y-4"><h1 className="text-2xl font-bold">Profile</h1><div className="border rounded-xl p-4"><p><b>{user.name}</b></p><p className="text-sm text-slate-600">{user.email} · {user.role}</p><p className="text-xs text-slate-500">Joined {fmt(user.createdAt)}</p></div>
 {s&&<div className="grid grid-cols-2 gap-3"><Stat label="Submitted" value={s.total}/><Stat label="Resolved" value={s.resolved} color={COLORS.Resolved}/></div>}</div>}

export const NotFound=()=><div className="text-center py-20"><h1 className="text-5xl font-bold">404</h1><p className="my-3">Page not found.</p><Link to="/" className={btn}>Go home</Link></div>;
