import type { Metadata } from 'next';
import { Inter, Rajdhani } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani'
});

export const metadata: Metadata = {
  title: 'Campeonato Unia - VALORANT',
  description: 'Acompanhe partidas personalizadas de VALORANT entre amigos',
  icons: {
    icon: '/img/favicon_unia.png'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.variable} ${rajdhani.variable} font-inter bg-valorant-dark text-white min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
