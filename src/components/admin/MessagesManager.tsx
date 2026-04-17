'use client';

import { useState, useEffect, useCallback, Fragment } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Trash2, Mail, MailOpen, Eye, EyeOff, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import type { ContactMessageData } from '@/lib/types';

export function MessagesManager() {
  const [messages, setMessages] = useState<ContactMessageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingMsg, setDeletingMsg] = useState<ContactMessageData | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const toggleRead = async (msg: ContactMessageData) => {
    setTogglingId(msg.id);
    try {
      const res = await fetch(`/api/contact/${msg.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: !msg.isRead }),
      });
      if (!res.ok) throw new Error('Failed to toggle read status');
      toast.success(msg.isRead ? 'Marked as unread' : 'Marked as read');
      fetchMessages();
    } catch {
      toast.error('Failed to update message');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingMsg) return;
    try {
      const res = await fetch(`/api/contact/${deletingMsg.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete message');
      toast.success('Message deleted');
      setDeleteOpen(false);
      setExpandedId(null);
      fetchMessages();
    } catch {
      toast.error('Failed to delete message');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Messages</h2>
          <p className="text-muted-foreground mt-1">
            {messages.length > 0
              ? `${messages.length} total, ${unreadCount} unread`
              : 'No messages received yet'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge className="bg-emerald-600 text-white border-0">
            {unreadCount} unread
          </Badge>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <Mail className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No messages yet.</p>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="text-muted-foreground w-8"></TableHead>
                <TableHead className="text-muted-foreground">From</TableHead>
                <TableHead className="text-muted-foreground hidden sm:table-cell">Subject</TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((msg) => (
                <Fragment key={msg.id}>
                  <TableRow
                    className={`border-border cursor-pointer ${
                      !msg.isRead ? 'bg-muted/30' : ''
                    } ${expandedId === msg.id ? 'border-b-0' : ''}`}
                    onClick={() =>
                      setExpandedId(expandedId === msg.id ? null : msg.id)
                    }
                  >
                    <TableCell className="w-8">
                      <div className="flex items-center gap-1">
                        {!msg.isRead && (
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground flex items-center gap-2">
                          {msg.name}
                          {!msg.isRead && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0">
                              New
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground sm:hidden">
                          {msg.subject}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {msg.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      <div className="line-clamp-1 max-w-[250px]">{msg.subject}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                      {formatDate(msg.createdAt)}
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleRead(msg)}
                          disabled={togglingId === msg.id}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title={msg.isRead ? 'Mark as unread' : 'Mark as read'}
                        >
                          {togglingId === msg.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : msg.isRead ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setDeletingMsg(msg);
                            setDeleteOpen(true);
                          }}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {/* Expanded message content */}
                  {expandedId === msg.id && (
                    <TableRow className="border-border bg-muted/20">
                      <TableCell colSpan={5} className="px-6 py-4">
                        <div className="max-w-2xl">
                          <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                            <MailOpen className="h-4 w-4" />
                            <span>From: {msg.name} ({msg.email})</span>
                            <span>•</span>
                            <span>{formatDate(msg.createdAt)}</span>
                          </div>
                          <div className="font-medium text-foreground mb-2">{msg.subject}</div>
                          <Separator className="mb-3" />
                          <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                            {msg.message}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the message from &quot;{deletingMsg?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
