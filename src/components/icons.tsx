import { type SVGProps } from 'react';

export function KayaLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      {...props}
    >
      <defs>
        <linearGradient id="kayaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#6B46C1', stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: '#D926AA', stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>
      <g fill="url(#kayaGradient)">
        <path d="M50,10A40,40,0,1,1,10,50,40,40,0,0,1,50,10m0-10A50,50,0,1,0,100,50,50,50,0,0,0,50,0Z" />
        <path d="M50,32.5A17.5,17.5,0,1,1,32.5,50,17.5,17.5,0,0,1,50,32.5m0-10A27.5,27.5,0,1,0,77.5,50,27.5,27.5,0,0,0,50,22.5Z" />
        <circle cx="50" cy="50" r="10" />
      </g>
    </svg>
  );
}
