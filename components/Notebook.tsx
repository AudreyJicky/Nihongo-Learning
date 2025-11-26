
import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { Plus, Trash2, Save, FileText, Tag } from 'lucide-react';

interface NotebookProps {
    language: string;
}

const Notebook: React.FC<NotebookProps> = ({ language }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    
    // Form State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('pyflow-notes');
        if (saved) {
            setNotes(JSON.parse(saved));
        }
    }, []);

    const saveToLocal = (updatedNotes: Note[]) => {
        localStorage.setItem('pyflow-notes', JSON.stringify(updatedNotes));
        setNotes(updatedNotes);
    };

    const handleNewNote = () => {
        setIsEditing(true);
        setSelectedNote(null);
        setTitle('');
        setContent('');
        setTagInput('');
    };

    const handleSave = () => {
        if (!title.trim()) return;

        const newNote: Note = {
            id: selectedNote ? selectedNote.id : Date.now().toString(),
            title,
            content,
            date: new Date().toLocaleDateString(),
            tags: tagInput.split(',').map(t => t.trim()).filter(t => t)
        };

        let updatedNotes;
        if (selectedNote) {
            updatedNotes = notes.map(n => n.id === newNote.id ? newNote : n);
        } else {
            updatedNotes = [newNote, ...notes];
        }

        saveToLocal(updatedNotes);
        setIsEditing(false);
        setSelectedNote(null);
    };

    const handleDelete = (id: string) => {
        const updated = notes.filter(n => n.id !== id);
        saveToLocal(updated);
        if (selectedNote?.id === id) {
            setSelectedNote(null);
            setIsEditing(false);
        }
    };

    const handleSelect = (note: Note) => {
        setSelectedNote(note);
        setIsEditing(false);
        setTitle(note.title);
        setContent(note.content);
        setTagInput(note.tags.join(', '));
    };

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-140px)] gap-6">
            {/* Sidebar List */}
            <div className="w-full md:w-1/3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden transition-colors">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-blue-500" /> My Notes
                    </h3>
                    <button 
                        onClick={handleNewNote}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        title="New Note"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {notes.length === 0 && (
                        <div className="text-center text-slate-400 dark:text-slate-500 p-8 text-sm">
                            No notes yet. Click + to add one!
                        </div>
                    )}
                    {notes.map(note => (
                        <div 
                            key={note.id}
                            onClick={() => handleSelect(note)}
                            className={`p-4 rounded-xl cursor-pointer transition-all ${
                                selectedNote?.id === note.id 
                                ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 border shadow-sm' 
                                : 'hover:bg-slate-50 dark:hover:bg-slate-700 border border-transparent'
                            }`}
                        >
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">{note.title}</h4>
                            <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 justify-between">
                                <span>{note.date}</span>
                                <div className="flex gap-1">
                                    {note.tags.slice(0, 2).map(tag => (
                                        <span key={tag} className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px] text-slate-600 dark:text-slate-300">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden transition-colors">
                {isEditing || selectedNote ? (
                    <>
                        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                            {isEditing ? (
                                <input 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Note Title..."
                                    className="text-lg font-bold text-slate-800 dark:text-white outline-none w-full bg-transparent placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                />
                            ) : (
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white">{selectedNote?.title}</h2>
                            )}
                            
                            <div className="flex items-center space-x-2">
                                {isEditing ? (
                                    <button onClick={handleSave} className="flex items-center text-sm bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600">
                                        <Save className="w-4 h-4 mr-1" /> Save
                                    </button>
                                ) : (
                                    <>
                                        <button onClick={() => { setIsEditing(true); }} className="text-sm text-blue-600 dark:text-blue-400 font-medium px-3 py-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                                            Edit
                                        </button>
                                        <button onClick={() => selectedNote && handleDelete(selectedNote.id)} className="text-slate-400 hover:text-red-500 p-2">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {isEditing && (
                            <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center">
                                <Tag className="w-4 h-4 text-slate-400 mr-2" />
                                <input 
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    placeholder="Tags (comma separated)..."
                                    className="bg-transparent text-sm w-full outline-none text-slate-600 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                />
                            </div>
                        )}

                        <div className="flex-1 relative">
                            {isEditing ? (
                                <textarea 
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Write your code or notes here..."
                                    className="w-full h-full p-6 outline-none resize-none text-slate-700 dark:text-slate-300 bg-transparent font-mono text-sm leading-relaxed"
                                />
                            ) : (
                                <div className="p-6 overflow-y-auto h-full text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono text-sm">
                                    {selectedNote?.content}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600">
                        <FileText className="w-16 h-16 mb-4 opacity-50" />
                        <p>Select a note or create a new one</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notebook;
