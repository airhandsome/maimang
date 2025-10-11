import AdminLayout from '@/components/AdminLayout';

export default function MaterialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}