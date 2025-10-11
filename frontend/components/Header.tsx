'use client';

import Link from 'next/link';
import { Wheat, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import { apiMe } from '@/lib/auth';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [initials, setInitials] = useState('您');

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) {
      setAuthed(false);
      setIsAdmin(false);
      return;
    }
    (async () => {
      try {
        const me = await apiMe(token);
        setAuthed(true);
        setIsAdmin(me.role === 'admin');
        setInitials('我');
      } catch {
        setAuthed(false);
        setIsAdmin(false);
      }
    })();
  }, []);

  const navigation = [
    { name: '首页', href: '/' },
    { name: '文章', href: '/articles' },
    { name: '文学活动', href: '/activities' },
    { name: '关于我们', href: '/about' },
    { name: '联系我们', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-cream/90 backdrop-blur-sm shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center py-4 px-4 md:px-8" aria-label="Global">
        <div className="flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center mr-1 spin-slow">
              <Wheat className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-serif"><span className="text-gold">麦</span><span className="text-foreground">芒</span><span className="text-mint">文学社</span></span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">打开主菜单</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-4 py-2 text-foreground hover:text-gold transition-all duration-300 text-base font-medium hover-lift"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:ml-8">
          {!authed ? (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="outline" size="sm" className="rounded-full">登录</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-gold text-white hover:bg-amber-400 rounded-full shadow-sm">注册</Button>
              </Link>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt="avatar" />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>账户</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">个人中心</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile/works">我的作品</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile/activities">我的活动</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile/edit">账号设置</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin">管理后台</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/';
                  }}
                >
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-base font-medium text-gray-900 hover:bg-amber-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/admin"
              className="block rounded-lg px-3 py-2 text-base font-medium text-gray-900 hover:bg-amber-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              管理后台
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
