// DEMONSTRAÇÃO: localStorage não sincroniza dispositivos nem garante exclusividade concorrente. Não usar em produção.
export type Service={id:string;name:string;duration:number;price:string};
export type Booking={id:string;serviceId:string;serviceName:string;duration:number;date:string;time:string;name:string;phone:string;status:'pendente'|'confirmado'|'cancelado'|'concluído'};
export type Block={id:string;date:string;start:string;end:string};
export type State={services:Service[];bookings:Booking[];blocks:Block[];days:number[];start:string;end:string};
const key='ana-heloisa-demo-v1';
export const initial=():State=>({services:[{id:'s1',name:'Design de sobrancelhas',duration:30,price:''},{id:'s2',name:'Design com henna',duration:45,price:''},{id:'s3',name:'Brow lamination',duration:60,price:''}],bookings:[],blocks:[],days:[2,3,4,5,6],start:'09:00',end:'18:00'});
export function read():State {try {const raw=localStorage.getItem(key);return raw?JSON.parse(raw):initial()}catch{return initial()}}
export function save(s:State){localStorage.setItem(key,JSON.stringify(s));window.dispatchEvent(new Event('demo-change'))}
export function subscribe(fn:()=>void){window.addEventListener('storage',fn);window.addEventListener('demo-change',fn);return()=>{window.removeEventListener('storage',fn);window.removeEventListener('demo-change',fn)}}
export const minutes=(t:string)=>{const [h,m]=t.split(':').map(Number);return h*60+m};
export const clock=(m:number)=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
export const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Bahia',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
export function currentMinutes(){const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'America/Bahia',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date());return minutes(parts)}
export const dateLabel=(d:string)=>new Date(d+'T12:00:00Z').toLocaleDateString('pt-BR',{timeZone:'UTC',weekday:'long',day:'numeric',month:'long',year:'numeric'});
export function available(s:State,date:string,time:string,duration:number,exclude=''){if(!date||!time||!Number.isFinite(duration)||duration<=0)return false;const start=minutes(time),end=start+duration,weekday=new Date(date+'T12:00:00Z').getUTCDay();if(date<today()||(date===today()&&start<=currentMinutes())||!s.days.includes(weekday)||start<minutes(s.start)||end>minutes(s.end))return false;return !s.blocks.some(b=>b.date===date&&start<minutes(b.end)&&end>minutes(b.start))&&!s.bookings.some(b=>b.id!==exclude&&b.date===date&&b.status!=='cancelado'&&start<minutes(b.time)+b.duration&&end>minutes(b.time))}
export function slots(s:State,date:string,duration:number,exclude=''){const out:{time:string;free:boolean}[]=[];for(let n=minutes(s.start);n+duration<=minutes(s.end);n+=15)out.push({time:clock(n),free:available(s,date,clock(n),duration,exclude)});return out}
export const uid=()=>Math.random().toString(36).slice(2,10).toUpperCase();
