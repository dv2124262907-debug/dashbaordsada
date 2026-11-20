import './style.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Studio Ana Heloísa Brow & Beauty', description: 'Um espaço dedicado ao cuidado e à beleza de cada detalhe.' };
export default function Layout({children}:{children:React.ReactNode}) { return <html lang="pt-BR"><body>{children}</body></html>; }
