import React, { useState, useRef, useEffect } from 'react';
import { JobNote, Job } from '../types';
import { MessageSquare, Send, User, Calendar, Plus, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotesSectionProps {
  job: Job;
  notes: JobNote[];
  onAddNote: (content: string, author: string) => void;
}

export default function NotesSection({ job, notes, onAddNote }: NotesSectionProps) {
  const [newNote, setNewNote] = useState<string>('');
  const [author, setAuthor] = useState<string>('David (Creative Director)');
  const [isListening, setIsListening] = useState<boolean>(false);
  
  const recognitionRef = useRef<any>(null);

  const jobNotes = notes.filter((n) => n.jobId === job.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    onAddNote(newNote.trim(), author);
    setNewNote('');
    
    // Stop recording if active
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice dictation is not fully supported by your current browser environment. Try using Google Chrome.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      try {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';

        rec.onstart = () => {
          setIsListening(true);
        };

        let initialText = newNote;

        rec.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          const combined = (initialText + ' ' + finalTranscript + interimTranscript).trim().replace(/\s+/g, ' ');
          setNewNote(combined);
        };

        rec.onerror = (err: any) => {
          console.error("Notes voice-to-text error:", err);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
        rec.start();
      } catch (err) {
        console.error("Failed to start speech recognition", err);
        setIsListening(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <div id={`notes-section-${job.id}`} className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
      
      {/* Header */}
      <div className="border-b border-gray-100 pb-4 mb-5">
        <h2 className="text-xl font-sans font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-emerald-600" />
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
                  <User className="h-3 w-3 text-slate-500" />
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
          <div className="flex items-center gap-1.5 font-sans">
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

        <div className="flex gap-2 items-stretch">
          <div className="relative flex-1 flex">
            <textarea
              id={`note-text-area-${job.id}`}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={2}
              placeholder="Type or click the microphone to dictate a comment..."
              className="flex-1 w-full text-xs text-gray-950 bg-white border border-gray-300 rounded-lg pl-3 pr-10 py-2.5 focus:border-slate-500 focus:ring-2 focus:ring-red-100 outline-none resize-none transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            
            {/* Microphone dictation button */}
            <button
              id={`note-mic-btn-${job.id}`}
              type="button"
              onClick={toggleListening}
              className={`absolute right-2.5 top-2.5 p-1.5 rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-200'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title={isListening ? "Listening active... click to stop" : "Start voice input (Speech to Text)"}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </button>
          </div>

          <button
            id={`note-submit-btn-${job.id}`}
            type="submit"
            disabled={!newNote.trim()}
            className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-semibold text-xs px-4 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all shrink-0 select-none active:scale-95"
          >
            <Send className="h-4 w-4 mb-0.5" />
            <span>Send</span>
          </button>
        </div>

        {/* Real-time Voice indicator */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 text-rose-500 text-[10px] font-mono font-medium pl-1"
            >
              <span className="flex gap-0.5 items-center">
                <span className="w-1 h-3 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <span className="w-1 h-4 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <span className="w-1 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </span>
              <span>Speak clearly. Voice-to-Text active in English...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
