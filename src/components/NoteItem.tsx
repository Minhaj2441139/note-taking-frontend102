
import React from 'react';
import { Note } from '@/types';
import { cn } from '@/lib/utils';
import { formatDate, getNoteColorClass } from '@/utils/noteUtils';
import { PenTool } from 'lucide-react';

interface NoteItemProps {
  note: Note;
  isActive: boolean;
  onClick: () => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, isActive, onClick }) => {
  // Create a brief preview of the content
  const preview = note.content.slice(0, 80) + (note.content.length > 80 ? '...' : '');
  
  const getNoteColorStyle = () => {
    if (!note.color || note.color === 'default') return {};
    return { 
      backgroundColor: `hsl(var(--folder-${note.color})/0.15)`,
      borderColor: `hsl(var(--folder-${note.color})/0.3)`
    };
  };
  
  return (
    <button
      className={cn(
        "flex flex-col w-full p-3 border rounded-md text-left transition-all",
        isActive 
          ? "border-primary bg-primary/5" 
          : "border-transparent hover:bg-muted/30"
      )}
      style={getNoteColorStyle()}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium truncate">{note.title}</h3>
        {note.drawing && (
          <PenTool className="h-3 w-3 text-muted-foreground" />
        )}
      </div>
      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{preview}</p>
      <span className="text-xs text-muted-foreground mt-2">
        {formatDate(note.updatedAt)}
      </span>
    </button>
  );
};

export default NoteItem;
