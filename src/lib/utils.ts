import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractHashtags(text: string): string[] {
  const matches = text.match(/#[\p{L}0-9_]+/gu) || [];
  // Normalize to lower-case id form while keeping display variant for storage handled elsewhere
  return Array.from(new Set(matches.map(t => t.replace(/^#/, '').trim())));
}

export async function getVideoThumbnail(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = URL.createObjectURL(file);
    video.muted = true;
    video.playsInline = true;
    video.onloadeddata = () => {
      video.currentTime = Math.min(1, video.duration / 3);
    };
    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      const w = 800;
      const h = (video.videoHeight / video.videoWidth) * w;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context'));
      ctx.drawImage(video, 0, 0, w, h);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob); else reject(new Error('Thumbnail toBlob failed'));
      }, 'image/jpeg', 0.85);
    };
    video.onerror = reject;
  });
}
