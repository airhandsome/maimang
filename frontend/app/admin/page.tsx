'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Wheat,
  BookOpen,
  Eye,
  Users,
  Heart,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import http from '@/lib/http';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Article {
  id: string;
  title: string;
  author: string;
  category: string;
  publishDate: string;
  views: number;
  likes: number;
  featured: boolean;
}

interface Stats {
  totalArticles: number;
  totalViews: number;
  totalMembers: number;
  totalLikes: number;
}

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [articlesData, statsData] = await Promise.all([
        http.get<Article[]>('/articles'),
        http.get<Stats>('/stats'),
      ]);
      setArticles(articlesData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!articleToDelete) return;

    try {
      await http.delete(`/articles/${articleToDelete}`);
      toast({
        title: '删除成功',
        description: '文章已成功删除。',
      });
      setArticles(articles.filter((a) => a.id !== articleToDelete));
      setDeleteDialogOpen(false);
      setArticleToDelete(null);
    } catch (error) {
      toast({
        title: '删除失败',
        description: '请稍后再试。',
        variant: 'destructive',
      });
    }
  };

  const confirmDelete = (id: string) => {
    setArticleToDelete(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-harvest">
                <Wheat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">管理后台</h1>
                <p className="text-sm text-gray-600">麦芒文学社</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回前台
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">总文章数</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.totalArticles || 0}</p>
                </div>
                <BookOpen className="h-10 w-10 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">总浏览量</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.totalViews || 0}</p>
                </div>
                <Eye className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">社团成员</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.totalMembers || 0}</p>
                </div>
                <Users className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">总点赞数</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.totalLikes || 0}</p>
                </div>
                <Heart className="h-10 w-10 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>文章管理</CardTitle>
            <Link href="/admin/articles/new">
              <Button className="gradient-harvest text-white">
                <Plus className="mr-2 h-4 w-4" />
                新建文章
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">加载中...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>标题</TableHead>
                      <TableHead>作者</TableHead>
                      <TableHead>分类</TableHead>
                      <TableHead>发布日期</TableHead>
                      <TableHead className="text-center">浏览</TableHead>
                      <TableHead className="text-center">点赞</TableHead>
                      <TableHead className="text-center">状态</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {articles.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell className="font-medium">{article.title}</TableCell>
                        <TableCell>{article.author}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{article.category}</Badge>
                        </TableCell>
                        <TableCell>{article.publishDate}</TableCell>
                        <TableCell className="text-center">{article.views}</TableCell>
                        <TableCell className="text-center">{article.likes}</TableCell>
                        <TableCell className="text-center">
                          {article.featured && (
                            <Badge className="bg-amber-500">精选</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/articles/${article.id}`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => confirmDelete(article.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              此操作无法撤销。确定要删除这篇文章吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
