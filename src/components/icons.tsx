import { type SVGProps } from 'react';

export function KayaHubLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      {...props}
    >
      <defs>
        <linearGradient
          id="kayaLeafGradient"
          x1="0"
          y1="50"
          x2="100"
          y2="50"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" style={{ stopColor: 'hsl(var(--primary))' }} />
          <stop offset="1" style={{ stopColor: 'hsl(var(--accent))' }} />
        </linearGradient>
      </defs>
      <path
        fill="url(#kayaLeafGradient)"
        d="M25 12.5h12.5v75H25z M43.75 50c0-10 5-18.75 13.125-24.375l-5.625-8.125C40.625 24.375 37.5 36.875 37.5 50s3.125 25.625 10.625 32.5l5.625-8.125C48.75 68.75 43.75 60 43.75 50z M62.5 15.625C58.125 21.25 55.625 28.125 55.625 35.625s2.5 14.375 6.875 20l-6.25 8.125C45.625 56.25 43.75 46.25 43.75 35.625s1.875-20.625 12.5-28.125z M84.375 50c0-18.125-8.125-33.75-20-43.75l-6.25 8.125C66.875 21.25 71.875 35 71.875 50c0 15-5 28.75-13.75 35.625l6.25 8.125C76.25 83.75 84.375 68.125 84.375 50z"
      />
    </svg>
  );
}
