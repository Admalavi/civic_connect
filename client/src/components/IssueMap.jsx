import {useEffect} from 'react';import {MapContainer,TileLayer,Marker,Popup,useMap} from 'react-leaflet';import L from 'leaflet';import 'leaflet/dist/leaflet.css';import {Link} from 'react-router-dom';
import {COLORS,Badge,Empty} from '../utils/ui.jsx';
export const pin=c=>L.divIcon({className:'',html:`<div style="background:${c};width:22px;height:22px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 1px 4px #0006"></div>`,iconSize:[22,22],iconAnchor:[11,22],popupAnchor:[0,-22]});
const ll=i=>[i.location.coordinates[1],i.location.coordinates[0]];
function Fit({items}){const m=useMap();useEffect(()=>{if(items.length)m.fitBounds(items.map(ll),{padding:[40,40],maxZoom:16})},[items]);return null}
export const TILE=<TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>;
export default function IssueMap({items,h='h-[70vh]'}){
 return <div className={`relative ${h} rounded-xl overflow-hidden border`}><MapContainer center={[20.59,78.96]} zoom={5} className="h-full w-full">{TILE}<Fit items={items}/>
  {items.map(i=><Marker key={i._id} position={ll(i)} icon={pin(COLORS[i.status])}><Popup><div className="w-48 space-y-1">{i.photoUrl&&<img src={i.photoUrl} alt="" className="h-24 w-full object-cover rounded"/>}<div className="font-semibold">{i.title}</div><div className="text-xs">{i.category} · {i.complaintId}</div><Badge status={i.status}/><div><Link to={'/complaints/'+i.complaintId} className="text-teal-700 underline text-sm">View details</Link></div></div></Popup></Marker>)}</MapContainer>
  {!items.length&&<div className="absolute inset-0 z-[500] bg-white/80 flex items-center justify-center p-6"><Empty text="No complaints match yet. Be the first to report an issue!"/></div>}</div>}
