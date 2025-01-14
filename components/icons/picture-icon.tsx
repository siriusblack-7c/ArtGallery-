import { ComponentProps } from "react";

export default function PictureIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_187_713)">
        <path
          d="M7.714 2.571l1.145-.57.57-1.144.57 1.144 1.144.57-1.144.57-.57 1.145-.57-1.145-1.145-.57zM7.5 3.43l-.501.998L6 4.93l.999.501.501.999.501-.999L9 4.929l-.999-.502L7.5 3.43zm3.137.351l.506-.253v7.616H.857v-9A1.29 1.29 0 012.143.857h6.326l-.253.506-.707.351H2.143a.43.43 0 00-.429.429v3.681L3 4.54l3.857 3.857L8.571 6.68l1.715 1.715V4.487l.351-.707zm-.351 6.506v-.682L8.57 7.89 6.857 9.604 3 5.747 1.714 7.033v3.253h8.572zm-6-6.643a.642.642 0 101.284.002.642.642 0 00-1.284-.002z"
          fill="silver"
        />
      </g>
      <defs>
        <clipPath id="clip0_187_713">
          <path fill="#fff" d="M0 0H12V12H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
