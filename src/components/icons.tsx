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
      <path
        fill="url(#kayaGradient)"
        d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 85C30.7 85 15 69.3 15 50S30.7 15 50 15s35 15.7 35 35-15.7 35-35 35z"
      />
      <path
        fill="url(#kayaGradient)"
        d="M50 25c-13.8 0-25 11.2-25 25s11.2 25 25 25 25-11.2 25-25-11.2-25-25-25zm0 40c-8.3 0-15-6.7-15-15s6.7-15 15-15 15 6.7 15 15-6.7 15-15 15z"
      />
    </svg>
  );
}
