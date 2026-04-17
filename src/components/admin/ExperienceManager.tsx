'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, Briefcase } from 'lucide-react';
import type { ExperienceData } from '@/lib/types';

const emptyForm = {
  company: '',
  position: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  techStack: '',
  logoUrl: '',
  order: 0,
};

interface ExperienceManagerProps {
  experience: ExperienceData[];
  onUpdated: () => void;
}

function parseTechStack(techStack: string): string[] {
  try {
    return JSON.parse(techStack);
  } catch {
    return techStack.split(',').map((s) => s.trim()).filter(Boolean);
  }
}

export function ExperienceManager({ experience: initialExperience, onUpdated }: ExperienceManagerProps) {
  const [experience, setExperience] = useState<ExperienceData[]>(initialExperience);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<ExperienceData | null>(null);
  const [deletingItem, setDeletingItem] = useState<ExperienceData | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/experience');
      const data = await res.json();
      setExperience(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load experience');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (initialExperience.length > 0 && experience.length === 0) {
      setExperience(initialExperience);
    }
  }, [initialExperience]);

  const openAdd = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (item: ExperienceData) => {
    setEditingItem(item);
    const techArray = parseTechStack(item.techStack);
    setForm({
      company: item.company,
      position: item.position,
      startDate: item.startDate,
      endDate: item.endDate,
      current: item.current,
      description: item.description,
      techStack: techArray.join(', '),
      logoUrl: item.logoUrl,
      order: item.order,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.company.trim() || !form.position.trim()) {
      toast.error('Company and position are required');
      return;
    }
    setSaving(true);
    try {
      const techStackArray = form.techStack
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const payload = {
        ...form,
        techStack: JSON.stringify(techStackArray),
      };
      const url = editingItem ? `/api/experience/${editingItem.id}` : '/api/experience';
      const method = editingItem ? 'PUT' : 'POST';
      const body = editingItem ? { ...payload, id: editingItem.id } : payload;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to save experience');
      toast.success(editingItem ? 'Experience updated' : 'Experience added');
      setDialogOpen(false);
      fetchData();
      onUpdated();
    } catch {
      toast.error('Failed to save experience');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/experience/${deletingItem.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete experience');
      toast.success('Experience entry deleted');
      setDeleteOpen(false);
      fetchData();
      onUpdated();
    } catch {
      toast.error('Failed to delete experience');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Experience</h2>
          <p className="text-muted-foreground mt-1">
            Manage your work experience
          </p>
        </div>
        <Button onClick={openAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="h-4 w-4" />
          Add Experience
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : experience.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <Briefcase className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No experience entries yet.</p>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="text-muted-foreground">Position</TableHead>
                <TableHead className="text-muted-foreground hidden sm:table-cell">Company</TableHead>
                <TableHead className="text-muted-foreground">Duration</TableHead>
                <TableHead className="text-right text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experience.map((item) => (
                <TableRow key={item.id} className="border-border">
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">{item.position}</div>
                      <div className="text-sm text-muted-foreground sm:hidden">{item.company}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {item.company}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm">
                        {item.startDate} - {item.current ? 'Present' : item.endDate}
                      </span>
                      {item.current && (
                        <Badge className="bg-emerald-600 text-white border-0 text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(item)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDeletingItem(item);
                          setDeleteOpen(true);
                        }}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update experience details' : 'Add a new work experience entry'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exp-position">Position</Label>
                <Input
                  id="exp-position"
                  value={form.position}
                  onChange={(e) => setForm((p) => ({ ...p, position: e.target.value }))}
                  placeholder="Software Engineer"
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp-company">Company</Label>
                <Input
                  id="exp-company"
                  value={form.company}
                  onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                  placeholder="Acme Inc."
                  className="bg-muted/50"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exp-start">Start Date</Label>
                <Input
                  id="exp-start"
                  value={form.startDate}
                  onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                  placeholder="Jan 2023"
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp-end">End Date</Label>
                <Input
                  id="exp-end"
                  value={form.endDate}
                  onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                  placeholder="Dec 2024"
                  disabled={form.current}
                  className="bg-muted/50"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="exp-current"
                checked={form.current}
                onCheckedChange={(v) => setForm((p) => ({ ...p, current: v, endDate: v ? '' : p.endDate }))}
              />
              <Label htmlFor="exp-current">Currently working here</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp-desc">Description</Label>
              <Textarea
                id="exp-desc"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Key responsibilities and achievements..."
                rows={4}
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp-tech">Tech Stack (comma-separated)</Label>
              <Input
                id="exp-tech"
                value={form.techStack}
                onChange={(e) => setForm((p) => ({ ...p, techStack: e.target.value }))}
                placeholder="React, Node.js, AWS"
                className="bg-muted/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exp-logo">Logo URL</Label>
                <Input
                  id="exp-logo"
                  value={form.logoUrl}
                  onChange={(e) => setForm((p) => ({ ...p, logoUrl: e.target.value }))}
                  placeholder="https://..."
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp-order">Order</Label>
                <Input
                  id="exp-order"
                  type="number"
                  value={form.order}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))
                  }
                  className="w-20 bg-muted/50"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingItem ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Experience</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingItem?.position} at {deletingItem?.company}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={saving}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
