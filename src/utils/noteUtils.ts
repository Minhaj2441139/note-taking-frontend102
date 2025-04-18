import { Folder, Note } from '@/types';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const initialFolders: Folder[] = [
  {
    id: '1',
    name: 'Personal',
    color: 'purple',
  },
  {
    id: '2',
    name: 'Work',
    color: 'blue',
  },
  {
    id: '3',
    name: 'Ideas',
    color: 'green',
  },
  {
    id: '4',
    name: 'Travel',
    color: 'orange',
  },
];

export const getFolderById = (folders: Folder[], folderId: string | undefined): Folder | undefined => {
  if (!folderId) return undefined;
  return folders.find(folder => folder.id === folderId);
};

export const getNotesByFolderId = (notes: Note[], folderId: string): Note[] => {
  return notes.filter(note => note.folderId === folderId);
};

export const searchNotes = (notes: Note[], query: string): Note[] => {
  const searchTerm = query.toLowerCase();
  return notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm) ||
    note.content.toLowerCase().includes(searchTerm)
  );
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};

export const getFolderColorClass = (color: string) => {
  return `bg-[hsl(var(--folder-${color}))]`;
};

// Add getNoteColorClass to existing functions
export const getNoteColorClass = (color: string) => {
  if (!color || color === 'default') return '';
  return `bg-[hsl(var(--folder-${color}))]`;
};

export const initialNotes: Note[] = [
  {
    id: '1',
    title: 'Welcome to Notes',
    content: 'Welcome to your new notes app! You can create, edit, and organize your notes here.',
    folderId: '1',
    color: 'default',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Shopping List',
    content: '1. Milk\n2. Eggs\n3. Bread\n4. Apples\n5. Coffee',
    folderId: '1',
    color: 'green',
    createdAt: '2023-01-02T00:00:00.000Z',
    updatedAt: '2023-01-02T00:00:00.000Z',
  },
  {
    id: '3',
    title: 'Project Ideas',
    content: '- Build a personal website\n- Create a mobile app\n- Learn a new programming language',
    folderId: '2',
    color: 'blue',
    createdAt: '2023-01-03T00:00:00.000Z',
    updatedAt: '2023-01-03T00:00:00.000Z',
  },
  {
    id: '4',
    title: 'Meeting Notes',
    content: 'Discussion points:\n- Project timeline\n- Budget concerns\n- Team assignments',
    folderId: '3',
    color: 'yellow',
    createdAt: '2023-01-04T00:00:00.000Z',
    updatedAt: '2023-01-04T00:00:00.000Z',
  },
  {
    id: '5',
    title: 'Travel Plans',
    content: 'Places to visit:\n1. Paris\n2. Tokyo\n3. New York\n4. Rome',
    folderId: '4',
    color: 'orange',
    createdAt: '2023-01-05T00:00:00.000Z',
    updatedAt: '2023-01-05T00:00:00.000Z',
  },
];
