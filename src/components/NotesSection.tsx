import React, { useState } from 'react';
import { JobNote, Job } from '../types';
import { MessageSquare, Send, User, Calendar, Plus } from 'lucide-react';

interface NotesSectionProps {
  job: Job;
  notes: JobNote[];
  onAddNote: (content: string, author: string) => void;
}

export default function NotesSection({ job, notes, onAddNote }: NotesSectionProps) {
  const [newNote, setNewNote] = useState<string>('');
  const [author, setAuthor] = useState<string>('David (Creative Director)');

  const jobNotes = notes.filter((n) => n.jobId === job.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    onAddNote(newNote.trim(), author);
    setNewNote('');
  };

  return (
    <div id={`notes-section-${job.id}`} className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
      
      {/* Header */}
      <div className="border-b border-gray-100 pb-4 mb-5">
        <h2 className="text-xl font-sans font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-indigo-600" />
          Site Logs & Notes
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Coordinating notes between David, fabricators, and onsite installers to keep construction aligned.
        </p>
      </div>

      {/* List of notes */}
      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 mb-6">
        {jobNotes.length === 0 ? (
          <div className="text-center py-6 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-150">
            <MessageSquare className="h-6 w-6 text-gray-300 mx-auto mb-1" />
            <p className="text-xs">No site comments recorded yet for {job.id}.</p>
          </div>
        ) : (
          jobNotes.map((note) => (
            <div
              key={note.id}
              id={`note-card-${note.id}`}
              className="p-4 rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white hover:from-slate-50 hover:to-white hover:border-gray-200 transition-all shadow-2xs"
            >
              <div className="flex justify-between items-start gap-2 mb-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-800 font-bold font-sans">
                  <User className="h-3 w-3 text-indigo-500" />
                  <span>{note.author}</span>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-gray-400 font-mono">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(note.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-wrap">
                {note.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Add note input form */}
      <form onSubmit={handleSubmit} className="border-t border-gray-100 pt-5 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-slate-600 shrink-0">Writing as:</label>
            <select
              id={`note-author-select-${job.id}`}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="text-xs bg-slate-100/80 border border-transparent rounded-md px-2 py-1 outline-none text-slate-800 font-medium cursor-pointer"
            >
              <option value="David (Creative Director)">📐 David (Creative Director)</option>
              <option value="Mark (Lead Fitter)">🔨 Mark (Lead Fitter)</option>
              <option value="Sarah (Workspace Coordinator)">📝 Sarah (Workspace Coordinator)</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <textarea
            id={`note-text-area-${job.id}`}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={2}
            placeholder="Type a new site coordinate, observation or brief update..."
            className="flex-1 w-full text-xs text-gray-950 bg-white border border-gray-300 rounded-lg p-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            id={`note-submit-btn-${job.id}`}
            type="submit"
            disabled={!newNote.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-semibold text-xs px-4 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all shrink-0 select-none active:scale-95"
          >
            <Send className="h-4 w-4 mb-0.5" />
            <span>Send</span>
          </button>
        </div>
      </form>
    </div>
  );
}
