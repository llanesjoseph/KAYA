import { type SVGProps } from 'react';

export function KayaHubLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 25"
      {...props}
      className="fill-current text-foreground"
    >
      <text 
        x="0" 
        y="20" 
        fontFamily="Nunito, sans-serif" 
        fontSize="24" 
        fontWeight="bold"
      >
        KAYAHUB
      </text>
    </svg>
  );
}
