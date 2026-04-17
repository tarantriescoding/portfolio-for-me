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
import { Plus, Pencil, Trash2, Loader2, ExternalLink, Star } from 'lucide-react';
import type { ProjectData } from '@/lib/types';

const emptyForm = {
  title: '',
  description: '',
  imageUrl: '',
  githubUrl: '',
  liveUrl: '',
  techStack: '',
  featured: false,
  order: 0,
};

interface ProjectsManagerProps {
  projects: ProjectData[];
  onUpdated: () => void;
}

function parseTechStack(techStack: string): string[] {
  try {
    return JSON.parse(techStack);
  } catch {
    return techStack.split(',').map((s) => s.trim()).filter(Boolean);
  }
}

export function ProjectsManager({ projects: initialProjects, onUpdated }: ProjectsManagerProps) {
  const [projects, setProjects] = useState<ProjectData[]>(initialProjects);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);
  const [deletingProject, setDeletingProject] = useState<ProjectData | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (initialProjects.length > 0 && projects.length === 0) {
      setProjects(initialProjects);
    }
  }, [initialProjects]);

  const openAdd = () => {
    setEditingProject(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (project: ProjectData) => {
    setEditingProject(project);
    const techArray = parseTechStack(project.techStack);
    setForm({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
      techStack: techArray.join(', '),
      featured: project.featured,
      order: project.order,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Project title is required');
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
      const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';
      const body = editingProject ? { ...payload, id: editingProject.id } : payload;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to save project');
      toast.success(editingProject ? 'Project updated' : 'Project added');
      setDialogOpen(false);
      fetchProjects();
      onUpdated();
    } catch {
      toast.error('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProject) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${deletingProject.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete project');
      toast.success('Project deleted');
      setDeleteOpen(false);
      fetchProjects();
      onUpdated();
    } catch {
      toast.error('Failed to delete project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Projects</h2>
          <p className="text-muted-foreground mt-1">
            Manage your portfolio projects
          </p>
        </div>
        <Button onClick={openAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <p className="text-muted-foreground">No projects yet. Add your first project!</p>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="text-muted-foreground">Project</TableHead>
                <TableHead className="text-muted-foreground hidden sm:table-cell">Tech Stack</TableHead>
                <TableHead className="text-muted-foreground">Featured</TableHead>
                <TableHead className="text-muted-foreground">Order</TableHead>
                <TableHead className="text-right text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id} className="border-border">
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground flex items-center gap-2">
                        {project.title}
                        {project.featured && (
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 max-w-[300px]">
                        {project.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex flex-wrap gap-1 max-w-[300px]">
                      {parseTechStack(project.techStack).slice(0, 3).map((tech, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {parseTechStack(project.techStack).length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{parseTechStack(project.techStack).length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={project.featured ? 'default' : 'secondary'}
                      className={
                        project.featured
                          ? 'bg-emerald-600 text-white border-0'
                          : ''
                      }
                    >
                      {project.featured ? 'Featured' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{project.order}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(project)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDeletingProject(project);
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
            <DialogTitle>{editingProject ? 'Edit Project' : 'Add Project'}</DialogTitle>
            <DialogDescription>
              {editingProject ? 'Update project details' : 'Add a new project to your portfolio'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="project-title">Title</Label>
              <Input
                id="project-title"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="My Awesome Project"
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-desc">Description</Label>
              <Textarea
                id="project-desc"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="A brief description of the project..."
                rows={3}
                className="bg-muted/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project-github">GitHub URL</Label>
                <Input
                  id="project-github"
                  value={form.githubUrl}
                  onChange={(e) => setForm((p) => ({ ...p, githubUrl: e.target.value }))}
                  placeholder="https://github.com/..."
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-live">Live URL</Label>
                <Input
                  id="project-live"
                  value={form.liveUrl}
                  onChange={(e) => setForm((p) => ({ ...p, liveUrl: e.target.value }))}
                  placeholder="https://..."
                  className="bg-muted/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-image">Image URL</Label>
              <Input
                id="project-image"
                value={form.imageUrl}
                onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-tech">Tech Stack (comma-separated)</Label>
              <Input
                id="project-tech"
                value={form.techStack}
                onChange={(e) => setForm((p) => ({ ...p, techStack: e.target.value }))}
                placeholder="React, TypeScript, Tailwind CSS"
                className="bg-muted/50"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.featured}
                  onCheckedChange={(v) => setForm((p) => ({ ...p, featured: v }))}
                />
                <Label>Featured</Label>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <Label htmlFor="project-order">Order</Label>
                <Input
                  id="project-order"
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
              {editingProject ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingProject?.title}&quot;? This action cannot be undone.
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
