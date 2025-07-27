import { type SVGProps } from 'react';

export function KayaHubLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
      className="fill-current text-foreground"
    >
      <path d="M12 2L12 22" />
      <path d="M17 7L12 12L17 17" />
      <path d="M7 12H12" />
    </svg>
  );
}
