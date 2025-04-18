
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Folder, FolderColor } from '@/types';
import FolderItem from '@/components/FolderItem';
import { Button } from '@/components/ui/button';
import { generateId } from '@/utils/noteUtils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface SidebarProps {
  folders: Folder[];
  activeFolder: Folder | null;
  onSelectFolder: (folderId: string) => void;
  onAddFolder: (folder: Folder) => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  folders,
  activeFolder,
  onSelectFolder,
  onAddFolder,
  className,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState<FolderColor>('purple');

  const folderColors: FolderColor[] = [
    'purple', 'blue', 'green', 'yellow', 'orange', 'red', 'pink'
  ];

  const handleAddFolder = () => {
    if (!newFolderName.trim()) return;

    const newFolder: Folder = {
      id: generateId(),
      name: newFolderName.trim(),
      color: selectedColor,
    };

    onAddFolder(newFolder);
    setNewFolderName('');
    setSelectedColor('purple');
    setIsDialogOpen(false);
  };

  return (
    <div className={cn("w-64 border-r p-4 flex flex-col h-full", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Folders</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
            >
              <PlusCircle className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Folder</DialogTitle>
              <DialogDescription>Add a new folder to organize your notes.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="folderName">Folder Name</Label>
                <Input 
                  id="folderName" 
                  placeholder="Enter folder name" 
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Folder Color</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  <RadioGroup 
                    value={selectedColor} 
                    onValueChange={(value) => setSelectedColor(value as FolderColor)}
                    className="flex flex-wrap gap-3"
                  >
                    {folderColors.map((color) => (
                      <div key={color} className="flex items-center">
                        <RadioGroupItem 
                          value={color} 
                          id={`color-${color}`}
                          className="peer sr-only" 
                        />
                        <Label
                          htmlFor={`color-${color}`}
                          className={cn(
                            "w-8 h-8 rounded-full cursor-pointer flex items-center justify-center border-2 border-transparent hover:border-primary/50 transition-all",
                            `bg-[hsl(var(--folder-${color}))]`,
                            selectedColor === color && "ring-2 ring-primary ring-offset-2"
                          )}
                        />
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddFolder}>Create Folder</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-1 overflow-y-auto scrollbar-slim flex-1">
        {folders.map(folder => (
          <FolderItem
            key={folder.id}
            folder={folder}
            isActive={activeFolder?.id === folder.id}
            onClick={() => onSelectFolder(folder.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
