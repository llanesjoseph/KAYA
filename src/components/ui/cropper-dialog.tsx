"use client";
import Cropper from 'react-easy-crop';
import { useCallback, useState } from 'react';
import { Button } from './button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';

function getCroppedImg(imageSrc: string, crop: { x: number; y: number }, zoom: number, aspect: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('No ctx'));
      const naturalW = image.naturalWidth;
      const naturalH = image.naturalHeight;
      const cropPx = {
        x: (crop.x * naturalW) / 100,
        y: (crop.y * naturalH) / 100,
        w: (naturalW / zoom) * (aspect >= 1 ? 1 : aspect),
        h: (naturalH / zoom) * (aspect <= 1 ? 1 : 1 / aspect),
      } as any;
      canvas.width = cropPx.w;
      canvas.height = cropPx.h;
      ctx.drawImage(image, cropPx.x, cropPx.y, cropPx.w, cropPx.h, 0, 0, cropPx.w, cropPx.h);
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('toBlob failed')), 'image/jpeg', 0.9);
    };
    image.onerror = reject;
  });
}

export function CropperDialog({ open, onOpenChange, file, aspect, onCropped }: { open: boolean; onOpenChange: (v: boolean) => void; file: File | null; aspect: number; onCropped: (blob: Blob) => void; }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const onFileChange = useCallback(() => {
    if (!file) return setImageUrl(null);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  }, [file]);

  const onConfirm = useCallback(async () => {
    if (!imageUrl) return;
    const blob = await getCroppedImg(imageUrl, { x: crop.x, y: crop.y }, zoom, aspect);
    onCropped(blob);
    onOpenChange(false);
  }, [imageUrl, crop, zoom, aspect, onCropped, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Crop image</DialogTitle></DialogHeader>
        <div className="relative w-full h-80 bg-black/50">
          {imageUrl && (
            <Cropper image={imageUrl} crop={crop} onCropChange={setCrop} zoom={zoom} onZoomChange={setZoom} aspect={aspect} />
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onConfirm}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

