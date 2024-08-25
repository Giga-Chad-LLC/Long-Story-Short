import {SVGProps} from "react";

export const CaretLeft = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M15 19.92L8.48003 13.4C7.71003 12.63 7.71003 11.37 8.48003 10.6L15 4.08002" stroke="#292D32"
            strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
