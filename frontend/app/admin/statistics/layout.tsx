import AdminLayout from '@/components/AdminLayout';

export default function StatisticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}