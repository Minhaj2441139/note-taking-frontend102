import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/Sidebar';
import NoteEditor from '@/components/NoteEditor';
import NoteItem from '@/components/NoteItem';
import Search from '@/components/Search';
import { Note, Folder } from '@/types';
import { 
  initialFolders, 
  initialNotes, 
  generateId, 
  getFolderById, 
  getNotesByFolderId,
  searchNotes 
} from '@/utils/noteUtils';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [activeFolder, setActiveFolder] = useState<Folder | null>(null);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // Initialize with the first folder
  useEffect(() => {
    if (folders.length > 0 && !activeFolder) {
      setActiveFolder(folders[0]);
    }
  }, [folders, activeFolder]);

  // Update filtered notes when active folder or search query changes
  useEffect(() => {
    if (searchQuery) {
      setFilteredNotes(searchNotes(notes, searchQuery));
    } else if (activeFolder) {
      setFilteredNotes(getNotesByFolderId(notes, activeFolder.id));
    } else {
      setFilteredNotes([]);
    }
  }, [activeFolder, notes, searchQuery]);

  const handleFolderSelect = (folderId: string) => {
    const folder = getFolderById(folders, folderId);
    if (folder) {
      setActiveFolder(folder);
      setActiveNote(null);
      setSearchQuery('');
    }
  };

  const handleNoteSelect = (note: Note) => {
    setActiveNote(note);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveNote(null);
  };

  const handleAddNote = () => {
    if (!activeFolder) return;
    
    const newNote: Note = {
      id: generateId(),
      title: 'Untitled',
      content: '',
      folderId: activeFolder.id,
      color: 'default',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setNotes([newNote, ...notes]);
    setActiveNote(newNote);
    
    toast({
      title: "Note created",
      description: "A new note has been created.",
    });
  };

  const handleSaveNote = (updatedNote: Note) => {
    setNotes(notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ));
    setActiveNote(updatedNote);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
    setActiveNote(null);
  };

  const handleAddFolder = (newFolder: Folder) => {
    setFolders([...folders, newFolder]);
    setActiveFolder(newFolder);
    setActiveNote(null);
    
    toast({
      title: "Folder created",
      description: `New folder "${newFolder.name}" has been created.`,
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        folders={folders}
        activeFolder={activeFolder}
        onSelectFolder={handleFolderSelect}
        onAddFolder={handleAddFolder}
      />
      
      {/* Notes List */}
      <div className="w-80 border-r flex flex-col h-full">
        <div className="p-4 border-b">
          <Search onSearch={handleSearch} />
        </div>
        
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">
            {searchQuery 
              ? `Search Results (${filteredNotes.length})` 
              : activeFolder?.name || 'Notes'}
          </h2>
          {!searchQuery && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={handleAddNote}
            >
              <Plus className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-slim">
          {filteredNotes.length > 0 ? (
            filteredNotes.map(note => (
              <NoteItem
                key={note.id}
                note={note}
                isActive={activeNote?.id === note.id}
                onClick={() => handleNoteSelect(note)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? "No notes found matching your search." 
                  : "No notes in this folder yet."}
              </p>
              {!searchQuery && (
                <Button onClick={handleAddNote}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Note
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Note Editor */}
      <NoteEditor
        note={activeNote}
        folders={folders}
        onSaveNote={handleSaveNote}
        onDeleteNote={handleDeleteNote}
      />
    </div>
  );
};

export default Index;
