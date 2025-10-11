import AdminLayout from '@/components/AdminLayout';

export default function ActivitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}