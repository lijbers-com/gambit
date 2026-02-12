import * as React from 'react';

export interface CustomIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const OrganisationsIcon = React.forwardRef<SVGSVGElement, CustomIconProps>(
  ({ size = 24, ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <g clipPath="url(#clip0_organisations)">
        <path d="M5.1687 21.3615V3.36147C5.1687 3.09147 5.1687 2.81147 5.2387 2.54147C5.29991 2.27209 5.43543 2.02529 5.62988 1.82907C5.82432 1.63286 6.06989 1.49511 6.3387 1.43147C6.6287 1.36147 7.8987 1.36147 8.1687 1.36147L13.5 1.36145" />
        <path d="M1.16873 13.3615V19.3615C1.16873 20.4615 2.06873 21.3615 3.16873 21.3615H5.16873V11.3615H3.16873C2.89873 11.3615 2.61873 11.3614 2.34873 11.4314C2.07873 11.5014 1.82873 11.6315 1.62873 11.8315C1.43873 12.0215 1.30873 12.2715 1.23873 12.5415C1.18228 12.8109 1.15877 13.0863 1.16873 13.3615Z" />
        <path d="M9.1687 5.36145H9.5" />
        <path d="M9.1687 9.36145H9.5" />
        <path d="M9.1687 13.3615H9.5" />
        <path d="M23 21.5V19.8333C23 18.9493 22.6388 18.1014 21.9958 17.4763C21.3528 16.8512 20.4807 16.5 19.5714 16.5H14.4286C13.5193 16.5 12.6472 16.8512 12.0042 17.4763C11.3612 18.1014 11 18.9493 11 19.8333V21.5" />
        <path d="M17 13C18.933 13 20.5 11.433 20.5 9.5C20.5 7.567 18.933 6 17 6C15.067 6 13.5 7.567 13.5 9.5C13.5 11.433 15.067 13 17 13Z" />
      </g>
      <defs>
        <clipPath id="clip0_organisations">
          <rect width="24" height="24" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  )
);

OrganisationsIcon.displayName = 'OrganisationsIcon';

export const BrandsIcon = React.forwardRef<SVGSVGElement, CustomIconProps>(
  ({ size = 24, ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9.86534 14.6174C9.66483 14.4217 9.42657 14.2664 9.16422 14.1605C8.90188 14.0545 8.62061 14 8.33655 14C8.05249 14 7.77122 14.0545 7.50888 14.1605C7.24653 14.2664 7.00827 14.4217 6.80776 14.6174L6.5 14.9206L6.19224 14.6174C5.99173 14.4217 5.75347 14.2664 5.49113 14.1605C5.22878 14.0545 4.94751 14 4.66345 14C4.37939 14 4.09812 14.0545 3.83578 14.1605C3.57343 14.2664 3.33517 14.4217 3.13466 14.6174C2.28733 15.4414 2.23537 16.833 3.30253 17.8903L6.5 21L9.69747 17.8903C10.7646 16.833 10.7127 15.4414 9.86534 14.6174Z" />
      <path d="M9.86534 3.61737C9.66483 3.42169 9.42657 3.26642 9.16422 3.16048C8.90188 3.05454 8.62061 3 8.33655 3C8.05249 3 7.77122 3.05454 7.50888 3.16048C7.24653 3.26642 7.00827 3.42169 6.80776 3.61737L6.5 3.92057L6.19224 3.61737C5.99173 3.42169 5.75347 3.26642 5.49113 3.16048C5.22878 3.05454 4.94751 3 4.66345 3C4.37939 3 4.09812 3.05454 3.83578 3.16048C3.57343 3.26642 3.33517 3.42169 3.13466 3.61737C2.28733 4.44144 2.23537 5.83302 3.30253 6.89032L6.5 10L9.69747 6.89032C10.7646 5.83302 10.7127 4.44144 9.86534 3.61737Z" />
      <path d="M14 4H21" />
      <path d="M14 9H21" />
      <path d="M14 15H21" />
      <path d="M14 20H21" />
    </svg>
  )
);

BrandsIcon.displayName = 'BrandsIcon';

export const CreateIcon = React.forwardRef<SVGSVGElement, CustomIconProps>(
  ({ size = 24, ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        d="M12 7V17M7 12H17"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
);

CreateIcon.displayName = 'CreateIcon';
