import AdminLayout from '@/components/AdminLayout';

export default function CommentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}