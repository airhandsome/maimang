import AdminLayout from '@/components/AdminLayout';

export default function WorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}