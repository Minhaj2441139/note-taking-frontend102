
export type FolderColor = 'purple' | 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'pink';
export type NoteColor = FolderColor | 'default';

export interface Folder {
  id: string;
  name: string;
  color: FolderColor;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  drawing?: string; // Base64 encoded drawing data
  folderId: string;
  color: NoteColor;
  createdAt: string;
  updatedAt: string;
}

export type DrawingTool = 'pencil' | 'eraser';
export type DrawingColor = string;
