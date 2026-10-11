import {createContext,useContext,useEffect,useState} from 'react';import api from '../services/api';
const C=createContext();export const useAuth=()=>useContext(C);
export function AuthProvider({children}){const[user,setUser]=useState(null);const[ready,setReady]=useState(false);
 useEffect(()=>{if(!localStorage.token)return setReady(true);api.get('/auth/me').then(r=>setUser(r.data)).catch(()=>localStorage.removeItem('token')).finally(()=>setReady(true))},[]);
 const auth=async(p,b)=>{const{data}=await api.post('/auth/'+p,b);localStorage.token=data.token;setUser(data.user);return data.user};
 const logout=()=>{localStorage.removeItem('token');setUser(null)};
 return <C.Provider value={{user,ready,login:b=>auth('login',b),register:b=>auth('register',b),logout}}>{children}</C.Provider>}
