import { type SVGProps } from 'react';

export function KayaHubLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      {...props}
    >
      <defs>
        <linearGradient id="kayaHubGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))' }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))' }} />
        </linearGradient>
      </defs>
      <path
        fill="url(#kayaHubGradient)"
        d="M24.8,4.3c-2.8-2.5-6-3.8-9.6-3.8C7.2,0.5,0,7.6,0,15.6s6.3,14.2,14.2,14.2c3.4,0,6.6-1.3,9.1-3.5 l-2.6-3.1c-1.8,1.5-4.1,2.5-6.5,2.5c-5,0-9.2-4.1-9.2-9.2s4.1-9.2,9.2-9.2c2.6,0,5,1.1,6.8,2.8L24.8,4.3z M15.1,19.3 c1.8-1.5,2.9-3.7,2.9-6.2c0-2.3-1-4.4-2.6-5.9l-3.3,3.3C12.4,11.8,13.1,13.8,15.1,19.3z"
      />
      <text
        x="35"
        y="32"
        fontFamily="Nunito, sans-serif"
        fontSize="32"
        fontWeight="bold"
        fill="url(#kayaHubGradient)"
      >
        KAYAHUB
      </text>
    </svg>
  );
}

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
