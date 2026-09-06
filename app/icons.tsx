import type { SVGProps } from 'react';
type IconProps = SVGProps<SVGSVGElement> & { size?: number };
function Icon({ size = 24, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}
export function ArrowUpRight(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M7 17 17 7M7 7h10v10" />
    </Icon>
  );
}
export function ArrowDown(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M12 5v14m-7-7 7 7 7-7" />
    </Icon>
  );
}
export function ArrowLeft(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M19 12H5m7-7-7 7 7 7" />
    </Icon>
  );
}
export function ArrowRight(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M5 12h14m-7-7 7 7-7 7" />
    </Icon>
  );
}
export function Layers3(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="m12 3 10 5-10 5L2 8l10-5Zm-10 9 10 5 10-5M2 16l10 5 10-5" />
    </Icon>
  );
}
export function ScanLine(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M4 8V4h4m8 0h4v4M4 16v4h4m8 0h4v-4M3 12h18" />
    </Icon>
  );
}
export function RotateCcw(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M3 8h5M3 8V3m0 5a9 9 0 1 1 0 8" />
    </Icon>
  );
}
export function Pause(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M8 5v14M16 5v14" />
    </Icon>
  );
}
export function Play(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="m6 4 14 8-14 8V4Z" />
    </Icon>
  );
}
export function Check(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="m5 12 4 4L19 6" />
    </Icon>
  );
}
