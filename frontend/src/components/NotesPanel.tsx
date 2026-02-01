import { useState, useEffect } from "react";
import type { Note } from "../types";
import { supabase } from "../lib/supabase";

interface NotesPanelProps {
  projectId: string;
  entityType: "project" | "wallet" | "pattern";
  entityId: string;
  entityLabel?: string;
}

export default function NotesPanel({
  projectId,
  entityType,
  entityId,
  entityLabel,
}: NotesPanelProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [projectId, entityType, entityId]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(
        `http://localhost:8000/api/notes?project_id=${projectId}&entity_type=${entityType}&entity_id=${entityId}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSubmitting(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const formData = new FormData();
      formData.append("project_id", projectId);
      formData.append("entity_type", entityType);
      formData.append("entity_id", entityId);
      formData.append("content", newNote);

      const response = await fetch("http://localhost:8000/api/notes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setNewNote("");
        await fetchNotes();
      }
    } catch (error) {
      console.error("Error creating note:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(
        `http://localhost:8000/api/notes/${noteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );

      if (response.ok) {
        await fetchNotes();
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getContextLabel = () => {
    if (entityType === "wallet" && entityLabel) {
      return `Wallet: ${entityLabel.slice(0, 8)}...${entityLabel.slice(-6)}`;
    }
    if (entityType === "pattern" && entityLabel) {
      return `Pattern: ${entityLabel}`;
    }
    return "Project Overview";
  };

  return (
    <div className="bg-slate-900/50 rounded-lg border border-slate-700/50 p-4 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-slate-300 mb-1">
          Investigation Notes
        </h3>
        <p className="text-xs text-slate-500">{getContextLabel()}</p>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {loading ? (
          <div className="text-center text-slate-500 text-sm py-8">
            Loading notes...
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center text-slate-600 text-sm py-8">
            No notes yet. Document your findings.
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-slate-800/50 border border-slate-700/30 rounded p-3 text-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-slate-500 font-mono">
                  {formatDate(note.created_at)}
                </span>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-slate-600 hover:text-red-400 text-xs transition-colors"
                  title="Delete note"
                >
                  Delete
                </button>
              </div>
              <p className="text-slate-300 whitespace-pre-wrap">
                {note.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Add Note Form */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-slate-700/50 pt-4"
      >
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Document your investigation findings..."
          className="w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-slate-600 resize-none"
          rows={3}
          disabled={submitting}
        />
        <button
          type="submit"
          disabled={submitting || !newNote.trim()}
          className="mt-2 w-full bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-slate-200 text-sm font-medium py-2 px-4 rounded transition-colors"
        >
          {submitting ? "Saving..." : "Add Analyst Note"}
        </button>
      </form>
    </div>
  );
}
