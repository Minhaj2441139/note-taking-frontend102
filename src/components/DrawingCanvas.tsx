
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DrawingColor, DrawingTool } from '@/types';
import { Eraser, Pencil, Save, Trash, Palette } from 'lucide-react';

interface DrawingCanvasProps {
  initialDrawing?: string;
  onSave: (drawingData: string) => void;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ initialDrawing, onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<DrawingTool>('pencil');
  const [color, setColor] = useState<DrawingColor>('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Color palette
  const colors = [
    '#000000', // Black
    '#FFFFFF', // White
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFA500', // Orange
    '#800080', // Purple
    '#A52A2A', // Brown
    '#808080', // Gray
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Get context
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctxRef.current = ctx;

    // Load initial drawing if present
    if (initialDrawing) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = initialDrawing;
    } else {
      // Clear canvas with white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [initialDrawing]);

  useEffect(() => {
    if (!ctxRef.current) return;
    
    if (tool === 'pencil') {
      ctxRef.current.strokeStyle = color;
      ctxRef.current.lineWidth = lineWidth;
    } else if (tool === 'eraser') {
      ctxRef.current.strokeStyle = '#FFFFFF';
      ctxRef.current.lineWidth = lineWidth * 2;
    }
  }, [color, lineWidth, tool]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !ctxRef.current) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctxRef.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!ctxRef.current) return;
    
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const handleSave = () => {
    if (!canvasRef.current) return;
    const drawingData = canvasRef.current.toDataURL('image/png');
    onSave(drawingData);
  };

  const handleClear = () => {
    if (!canvasRef.current || !ctxRef.current) return;
    
    ctxRef.current.fillStyle = '#FFFFFF';
    ctxRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={tool === 'pencil' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('pencil')}
            className="h-9 w-9 p-0 flex items-center justify-center"
          >
            <Pencil className="h-5 w-5" />
          </Button>
          
          <Button
            variant={tool === 'eraser' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('eraser')}
            className="h-9 w-9 p-0 flex items-center justify-center"
          >
            <Eraser className="h-5 w-5" />
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 flex items-center justify-center"
                style={{ backgroundColor: color }}
              >
                <Palette className="h-5 w-5" color={color === '#000000' ? '#FFFFFF' : '#000000'} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="grid grid-cols-6 gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center"
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  >
                    {c === color && (
                      <div className="w-2 h-2 rounded-full bg-white border border-gray-400" />
                    )}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Size:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={lineWidth}
              onChange={(e) => setLineWidth(parseInt(e.target.value))}
              className="w-24"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-9 px-2"
          >
            <Trash className="h-4 w-4 mr-1" />
            Clear
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            className="h-9 px-2"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
      <div className="border border-input rounded-md overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="cursor-crosshair max-w-full touch-none"
          style={{ width: '100%', height: 'auto', backgroundColor: '#FFFFFF' }}
        />
      </div>
    </div>
  );
};

export default DrawingCanvas;
