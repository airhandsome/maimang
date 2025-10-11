import './globals.css';
import type { Metadata } from 'next';
import { Noto_Serif_SC, Noto_Sans_SC, Nunito, Quicksand } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';

const notoSerif = Noto_Serif_SC({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
});

const notoSans = Noto_Sans_SC({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
});

const nunito = Nunito({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-nunito',
});

const quicksand = Quicksand({
  weight: ['500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-quicksand',
});

export const metadata: Metadata = {
  title: '麦芒文学社 - 用文字收获青春',
  description: '麦芒文学社是一个充满活力的文学创作平台，汇聚青年作家的优秀作品，用文字记录青春，用故事传递梦想。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" rel="stylesheet" />
      </head>
      <body className={`${notoSans.variable} ${notoSerif.variable} ${nunito.variable} ${quicksand.variable} font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
