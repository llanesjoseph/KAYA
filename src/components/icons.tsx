import { type SVGProps } from 'react';

export function KayaHubLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="10" fill="hsl(var(--background))" stroke="hsl(var(--foreground))" />
      <path d="M14.5 9l-3 3 3 3" />
      <path d="M10.5 12H12" />
      <path d="M9.5 9v6" />
    </svg>
  );
}
