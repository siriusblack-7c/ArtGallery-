import { ComponentProps } from "react";

export default function CheckIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      width={10}
      height={8}
      viewBox="0 0 10 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.615 7.862a.192.192 0 01-.141-.061L.666 3.682a.192.192 0 01.142-.323H2.64a.192.192 0 01.146.066L4.058 4.89a7.29 7.29 0 01.87-1.38C5.62 2.628 6.905 1.331 9.103.16a.192.192 0 01.208.322c-.008.006-.855.674-1.83 1.896-.898 1.125-2.091 2.964-2.678 5.338a.192.192 0 01-.187.146z"
        fill="#151515"
      />
    </svg>
  );
}
