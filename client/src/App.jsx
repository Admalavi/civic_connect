import {Routes,Route} from 'react-router-dom';import {Layout,Guard} from './components/Layout.jsx';
import {Home,Auth,MapPage,Report,Details,MyComplaints,AdminComplaints,Dash,Profile,NotFound} from './pages/Pages.jsx';
export default function App(){return <Routes><Route element={<Layout/>}>
 <Route path="/" element={<Home/>}/><Route path="/login" element={<Auth mode="login"/>}/><Route path="/register" element={<Auth mode="register"/>}/><Route path="/map" element={<MapPage/>}/><Route path="/complaints/:id" element={<Details/>}/>
 <Route path="/report" element={<Guard role="citizen"><Report/></Guard>}/><Route path="/my-complaints" element={<Guard role="citizen"><MyComplaints/></Guard>}/><Route path="/dashboard" element={<Guard role="citizen"><Dash/></Guard>}/><Route path="/profile" element={<Guard role="citizen"><Profile/></Guard>}/>
 <Route path="/admin" element={<Guard role="admin"><Dash admin/></Guard>}/><Route path="/admin/complaints" element={<Guard role="admin"><AdminComplaints/></Guard>}/><Route path="/admin/map" element={<Guard role="admin"><MapPage admin/></Guard>}/>
 <Route path="*" element={<NotFound/>}/></Route></Routes>}
