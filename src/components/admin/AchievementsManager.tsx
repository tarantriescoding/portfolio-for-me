'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import type { AchievementData } from '@/lib/types';

const categories = [
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'award', label: 'Award' },
  { value: 'certification', label: 'Certification' },
  { value: 'publication', label: 'Publication' },
  { value: 'competition', label: 'Competition' },
  { value: 'open_source', label: 'Open Source' },
  { value: 'scholarship', label: 'Scholarship' },
];

const defaultIcons: Record<string, string> = {
  hackathon: '🚀',
  award: '🏆',
  certification: '📜',
  publication: '📄',
  competition: '⚔️',
  open_source: '💻',
  scholarship: '🎓',
};

const emptyForm = {
  title: '',
  description: '',
  date: '',
  category: 'award',
  icon: '🏆',
  credentialUrl: '',
  order: 0,
};

interface AchievementsManagerProps {
  achievements: AchievementData[];
  onUpdated: () => void;
}

export function AchievementsManager({
  achievements: initialAchievements,
  onUpdated,
}: AchievementsManagerProps) {
  const [achievements, setAchievements] = useState<AchievementData[]>(initialAchievements);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchAchievements = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/achievements');
      const data = await res.json();
      setAchievements(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialAchievements.length === 0) {
      fetchAchievements();
    }
  }, [initialAchievements.length, fetchAchievements]);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (achievement: AchievementData) => {
    setForm({
      title: achievement.title,
      description: achievement.description,
      date: achievement.date,
      category: achievement.category,
      icon: achievement.icon,
      credentialUrl: achievement.credentialUrl,
      order: achievement.order,
    });
    setEditingId(achievement.id);
    setDialogOpen(true);
  };

  const openDelete = (id: string) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    setSaving(true);
    try {
      const url = editingId
        ? `/api/achievements/${editingId}`
        : '/api/achievements';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success(editingId ? 'Achievement updated' : 'Achievement created');
        setDialogOpen(false);
        fetchAchievements();
        onUpdated();
      } else {
        toast.error('Failed to save achievement');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/achievements/${deletingId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Achievement deleted');
        fetchAchievements();
        onUpdated();
      } else {
        toast.error('Failed to delete achievement');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setDeleteOpen(false);
      setDeletingId(null);
    }
  };

  const handleCategoryChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      category: value,
      icon: defaultIcons[value] || '🏆',
    }));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full bg-zinc-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Achievements</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your awards, certifications, hackathons, and more
          </p>
        </div>
        <Button onClick={openCreate} className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono">
          <Plus className="w-4 h-4 mr-2" />
          Add Achievement
        </Button>
      </div>

      {/* List */}
      {achievements.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          <p className="text-lg mb-2">No achievements yet</p>
          <p className="text-sm font-mono">Click &quot;Add Achievement&quot; to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors group"
            >
              <span className="text-2xl shrink-0">{achievement.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-medium text-foreground truncate">
                    {achievement.title}
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-xs font-mono border-zinc-700 text-zinc-400 shrink-0"
                  >
                    {achievement.category}
                  </Badge>
                </div>
                {achievement.description && (
                  <p className="text-xs text-zinc-500 line-clamp-1">
                    {achievement.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  {achievement.date && (
                    <span className="text-xs text-zinc-600 font-mono">
                      {achievement.date}
                    </span>
                  )}
                  {achievement.credentialUrl && (
                    <a
                      href={achievement.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-500 hover:text-emerald-400 font-mono flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Credential
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-400 hover:text-emerald-400"
                  onClick={() => openEdit(achievement)}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-400 hover:text-red-400"
                  onClick={() => openDelete(achievement.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white font-mono">
              {editingId ? 'Edit Achievement' : 'New Achievement'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label className="text-zinc-400 text-sm">Icon (emoji)</Label>
                <Input
                  value={form.icon}
                  onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
                  placeholder="🏆"
                  className="bg-zinc-800/50 border-zinc-700 text-zinc-200 font-mono text-center text-xl h-12"
                />
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label className="text-zinc-400 text-sm">Category</Label>
                <Select value={form.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-zinc-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value} className="text-zinc-200 focus:bg-zinc-800 focus:text-emerald-400">
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400 text-sm">Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Won Smart India Hackathon"
                className="bg-zinc-800/50 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400 text-sm">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the achievement..."
                rows={3}
                className="bg-zinc-800/50 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 font-mono text-sm resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-400 text-sm">Date</Label>
                <Input
                  value={form.date}
                  onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                  placeholder="Jan 2024"
                  className="bg-zinc-800/50 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400 text-sm">Order</Label>
                <Input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  className="bg-zinc-800/50 border-zinc-700 text-zinc-200 font-mono text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400 text-sm">Credential URL</Label>
              <Input
                value={form.credentialUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, credentialUrl: e.target.value }))}
                placeholder="https://credential.link"
                className="bg-zinc-800/50 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 font-mono text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDialogOpen(false)}
              className="text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono"
            >
              {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Achievement</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              This action cannot be undone. This will permanently delete this achievement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-zinc-400 hover:text-zinc-200 bg-zinc-800 border-zinc-700 hover:bg-zinc-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-500 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
