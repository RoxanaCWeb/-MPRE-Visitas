import React from 'react';

export const PreventorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M9 3.75a.75.75 0 01.75.75v1.5h3V4.5a.75.75 0 011.5 0v1.5h4.5a3 3 0 013 3v9a3 3 0 01-3 3H5.25a3 3 0 01-3-3v-9a3 3 0 013-3H9V4.5a.75.75 0 01.75-.75zM5.25 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5H6zm8.25-7.5a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75V7.5zM12 7.5a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V8.25a.75.75 0 00-.75-.75H12z"
      clipRule="evenodd"
    />
  </svg>
);
