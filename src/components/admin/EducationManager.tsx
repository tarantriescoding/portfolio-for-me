'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import { Plus, Pencil, Trash2, Loader2, GraduationCap } from 'lucide-react';
import type { EducationData } from '@/lib/types';

const emptyForm = {
  degree: '',
  institution: '',
  field: '',
  startYear: '',
  endYear: '',
  grade: '',
  description: '',
  logoUrl: '',
  order: 0,
};

interface EducationManagerProps {
  education: EducationData[];
  onUpdated: () => void;
}

export function EducationManager({ education: initialEducation, onUpdated }: EducationManagerProps) {
  const [education, setEducation] = useState<EducationData[]>(initialEducation);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<EducationData | null>(null);
  const [deletingItem, setDeletingItem] = useState<EducationData | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/education');
      const data = await res.json();
      setEducation(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load education');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (initialEducation.length > 0 && education.length === 0) {
      setEducation(initialEducation);
    }
  }, [initialEducation]);

  const openAdd = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (item: EducationData) => {
    setEditingItem(item);
    setForm({
      degree: item.degree,
      institution: item.institution,
      field: item.field,
      startYear: item.startYear,
      endYear: item.endYear,
      grade: item.grade,
      description: item.description,
      logoUrl: item.logoUrl,
      order: item.order,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.degree.trim() || !form.institution.trim()) {
      toast.error('Degree and institution are required');
      return;
    }
    setSaving(true);
    try {
      const url = editingItem ? `/api/education/${editingItem.id}` : '/api/education';
      const method = editingItem ? 'PUT' : 'POST';
      const body = editingItem ? { ...form, id: editingItem.id } : form;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to save education');
      toast.success(editingItem ? 'Education updated' : 'Education added');
      setDialogOpen(false);
      fetchData();
      onUpdated();
    } catch {
      toast.error('Failed to save education');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/education/${deletingItem.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete education');
      toast.success('Education entry deleted');
      setDeleteOpen(false);
      fetchData();
      onUpdated();
    } catch {
      toast.error('Failed to delete education');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Education</h2>
          <p className="text-muted-foreground mt-1">
            Manage your educational background
          </p>
        </div>
        <Button onClick={openAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="h-4 w-4" />
          Add Education
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : education.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <GraduationCap className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No education entries yet.</p>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="text-muted-foreground">Degree</TableHead>
                <TableHead className="text-muted-foreground hidden sm:table-cell">Institution</TableHead>
                <TableHead className="text-muted-foreground">Years</TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">Grade</TableHead>
                <TableHead className="text-right text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {education.map((item) => (
                <TableRow key={item.id} className="border-border">
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">{item.degree}</div>
                      <div className="text-sm text-muted-foreground sm:hidden">{item.institution}</div>
                      {item.field && (
                        <div className="text-sm text-muted-foreground">{item.field}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {item.institution}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.startYear} - {item.endYear}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {item.grade ? (
                      <Badge variant="secondary" className="text-xs">
                        {item.grade}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
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
            <DialogTitle>{editingItem ? 'Edit Education' : 'Add Education'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update education details' : 'Add a new education entry'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edu-degree">Degree</Label>
                <Input
                  id="edu-degree"
                  value={form.degree}
                  onChange={(e) => setForm((p) => ({ ...p, degree: e.target.value }))}
                  placeholder="B.S."
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edu-field">Field</Label>
                <Input
                  id="edu-field"
                  value={form.field}
                  onChange={(e) => setForm((p) => ({ ...p, field: e.target.value }))}
                  placeholder="Computer Science"
                  className="bg-muted/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edu-institution">Institution</Label>
              <Input
                id="edu-institution"
                value={form.institution}
                onChange={(e) => setForm((p) => ({ ...p, institution: e.target.value }))}
                placeholder="University of..."
                className="bg-muted/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edu-start">Start Year</Label>
                <Input
                  id="edu-start"
                  value={form.startYear}
                  onChange={(e) => setForm((p) => ({ ...p, startYear: e.target.value }))}
                  placeholder="2020"
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edu-end">End Year</Label>
                <Input
                  id="edu-end"
                  value={form.endYear}
                  onChange={(e) => setForm((p) => ({ ...p, endYear: e.target.value }))}
                  placeholder="2024"
                  className="bg-muted/50"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edu-grade">Grade / GPA</Label>
                <Input
                  id="edu-grade"
                  value={form.grade}
                  onChange={(e) => setForm((p) => ({ ...p, grade: e.target.value }))}
                  placeholder="3.8 / 4.0"
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edu-logo">Logo URL</Label>
                <Input
                  id="edu-logo"
                  value={form.logoUrl}
                  onChange={(e) => setForm((p) => ({ ...p, logoUrl: e.target.value }))}
                  placeholder="https://..."
                  className="bg-muted/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edu-desc">Description</Label>
              <Textarea
                id="edu-desc"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Activities, achievements, etc."
                rows={3}
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edu-order">Order</Label>
              <Input
                id="edu-order"
                type="number"
                value={form.order}
                onChange={(e) =>
                  setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))
                }
                className="w-20 bg-muted/50"
              />
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
            <AlertDialogTitle>Delete Education</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the entry for &quot;{deletingItem?.degree} at {deletingItem?.institution}&quot;? This action cannot be undone.
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
