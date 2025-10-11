import AdminLayout from '@/components/AdminLayout';

export default function AdminTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}