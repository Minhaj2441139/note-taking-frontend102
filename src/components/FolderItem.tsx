
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Folder as FolderType } from '@/types';
import { getFolderColorClass } from '@/utils/noteUtils';

interface FolderItemProps {
  folder: FolderType;
  isActive: boolean;
  onClick: () => void;
}

const FolderItem: React.FC<FolderItemProps> = ({ folder, isActive, onClick }) => {
  const getFolderColorStyle = () => {
    return { backgroundColor: `hsl(var(--folder-${folder.color}))` };
  };
  
  return (
    <button
      className={cn(
        "flex items-center w-full gap-3 px-3 py-2 rounded-md text-left transition-colors",
        isActive 
          ? "bg-accent text-accent-foreground font-medium" 
          : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
      )}
      onClick={onClick}
    >
      <div 
        className={cn("w-4 h-4 rounded flex items-center justify-center shrink-0")}
        style={getFolderColorStyle()}
      >
        {isActive && <Check className="w-3 h-3 text-white" />}
      </div>
      <span className="truncate">{folder.name}</span>
    </button>
  );
};

export default FolderItem;
