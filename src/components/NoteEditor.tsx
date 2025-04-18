
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Note, Folder, NoteColor } from '@/types';
import { getFolderById, formatDate, getNoteColorClass } from '@/utils/noteUtils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Trash, PenTool, MessageSquare, Palette } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import DrawingCanvas from './DrawingCanvas';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface NoteEditorProps {
  note: Note | null;
  folders: Folder[];
  onSaveNote: (updatedNote: Note) => void;
  onDeleteNote: (noteId: string) => void;
  className?: string;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  folders,
  onSaveNote,
  onDeleteNote,
  className,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [drawing, setDrawing] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<string>('text');
  const [color, setColor] = useState<NoteColor>('default');
  const { toast } = useToast();

  const noteColors: { value: NoteColor; label: string }[] = [
    { value: 'default', label: 'Default' },
    { value: 'purple', label: 'Purple' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'orange', label: 'Orange' },
    { value: 'red', label: 'Red' },
    { value: 'pink', label: 'Pink' },
  ];

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setDrawing(note.drawing);
      setColor(note.color || 'default');
    } else {
      setTitle('');
      setContent('');
      setDrawing(undefined);
      setColor('default');
    }
  }, [note]);

  const handleSave = () => {
    if (!note) return;
    
    const updatedNote: Note = {
      ...note,
      title: title || 'Untitled',
      content,
      drawing,
      color,
      updatedAt: new Date().toISOString(),
    };
    
    onSaveNote(updatedNote);
    toast({
      title: "Note saved",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleDelete = () => {
    if (!note) return;
    
    onDeleteNote(note.id);
    toast({
      title: "Note deleted",
      description: "The note has been moved to trash.",
      variant: "destructive",
    });
  };

  const handleDrawingSave = (drawingData: string) => {
    setDrawing(drawingData);
    toast({
      title: "Drawing saved",
      description: "Your drawing has been saved. Remember to save the note!",
    });
  };

  const getNoteColorStyle = () => {
    if (color === 'default') return {};
    return { 
      backgroundColor: `hsl(var(--folder-${color})/0.15)`,
      borderColor: `hsl(var(--folder-${color})/0.3)`
    };
  };

  if (!note) {
    return (
      <div className={cn("flex-1 p-6 flex items-center justify-center", className)}>
        <div className="text-center text-muted-foreground">
          <p>Select a note or create a new one</p>
        </div>
      </div>
    );
  }

  const folder = getFolderById(folders, note.folderId);

  return (
    <div className={cn("flex-1 flex flex-col h-full", className)}>
      <div className="border-b p-4 flex items-center justify-between" style={getNoteColorStyle()}>
        <div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            className="border-none text-lg font-medium p-0 h-auto focus-visible:ring-0 bg-transparent"
          />
          <div className="flex items-center gap-2 mt-1">
            <div 
              className={cn(
                "w-2 h-2 rounded-full",
                folder ? `bg-[hsl(var(--folder-${folder.color}))]` : "bg-muted"
              )}
            />
            <span className="text-xs text-muted-foreground">
              {folder?.name} • {formatDate(note.updatedAt)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Palette className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {noteColors.map((noteColor) => (
                <DropdownMenuItem
                  key={noteColor.value}
                  onClick={() => setColor(noteColor.value)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {noteColor.value !== 'default' ? (
                    <div className={cn("w-4 h-4 rounded-full", `bg-[hsl(var(--folder-${noteColor.value}))]`)} />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-background border" />
                  )}
                  <span>{noteColor.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDelete}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash className="h-4 w-4" />
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b px-4" style={getNoteColorStyle()}>
          <TabsList className="h-10">
            <TabsTrigger value="text" className="data-[state=active]:bg-background">
              <MessageSquare className="h-4 w-4 mr-2" />
              Text
            </TabsTrigger>
            <TabsTrigger value="drawing" className="data-[state=active]:bg-background">
              <PenTool className="h-4 w-4 mr-2" />
              Drawing
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="text" className="flex-1 p-4 overflow-y-auto scrollbar-slim" style={getNoteColorStyle()}>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your note here..."
            className="w-full h-full resize-none border-none p-0 focus-visible:ring-0 bg-transparent"
          />
        </TabsContent>
        
        <TabsContent value="drawing" className="flex-1 p-4 overflow-y-auto scrollbar-slim" style={getNoteColorStyle()}>
          <DrawingCanvas 
            initialDrawing={drawing} 
            onSave={handleDrawingSave} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NoteEditor;
