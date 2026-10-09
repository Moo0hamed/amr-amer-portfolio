import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 1.6,
  viewBox: "0 0 24 24",
  "aria-hidden": true
};

export function ArrowUpRight(props: IconProps) {
  return <svg {...base} {...props}><path d="M5 19 19 5M8 5h11v11" /></svg>;
}

export function ArrowDown(props: IconProps) {
  return <svg {...base} {...props}><path d="M12 4v16M6 14l6 6 6-6" /></svg>;
}

export function ArrowLeft(props: IconProps) {
  return <svg {...base} {...props}><path d="M19 12H5M11 18l-6-6 6-6" /></svg>;
}

export function ArrowRight(props: IconProps) {
  return <svg {...base} {...props}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

export function MenuIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
}

export function CloseIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="m6 6 12 12M18 6 6 18" /></svg>;
}

export function SunIcon(props: IconProps) {
  return <svg {...base} {...props}><circle cx="12" cy="12" r="3.5" /><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" /></svg>;
}

export function MoonIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M19.5 14.6A8 8 0 0 1 9.4 4.5 8.2 8.2 0 1 0 19.5 14.6Z" /></svg>;
}

export function MailIcon(props: IconProps) {
  return <svg {...base} {...props}><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="m4 7 8 6 8-6" /></svg>;
}

export function LockIcon(props: IconProps) {
  return <svg {...base} {...props}><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></svg>;
}

export function SendIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="m21 3-7.3 18-3.5-7.2L3 10.3 21 3Z" /><path d="m10.2 13.8 4.2-4.2" /></svg>;
}

export function PlusIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M12 5v14M5 12h14" /></svg>;
}

export function CheckIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="m5 12 4.5 4.5L19 7" /></svg>;
}

export function SparkIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="m12 3 1.7 6.3L20 11l-6.3 1.7L12 19l-1.7-6.3L4 11l6.3-1.7L12 3Z" /><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" /></svg>;
}

export function ExternalLinkIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M14 5h5v5M19 5l-8 8" /><path d="M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>;
}

export function InstagramIcon(props: IconProps) {
  return <svg {...base} {...props}><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3.5" /><circle cx="17.2" cy="6.8" r=".7" fill="currentColor" stroke="none" /></svg>;
}

export function LinkedinIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M6.5 9.5V18M6.5 6.2v.1M10.5 18v-5a3 3 0 0 1 6 0v5M10.5 9.5V18" /><rect x="4" y="4" width="16" height="16" rx="2" /></svg>;
}

export function BehanceIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M4.5 6.5h5.2a3 3 0 0 1 1.2 5.7 3.2 3.2 0 0 1-1.4 6.1H4.5v-11.8ZM4.8 12h4.1a1.8 1.8 0 0 0 0-3.6H4.8m0 3.6h4.4a2 2 0 0 1 0 4H4.8M14 13.5h6.2c0-2.2-1.2-3.7-3.1-3.7-2.1 0-3.4 1.6-3.4 3.9 0 2.5 1.5 4 3.8 4 1.1 0 2.1-.3 2.8-.9M16 7h2.4" /></svg>;
}

export function FacebookIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M13.5 20v-7h2.4l.4-2.8h-2.8V8.4c0-.8.2-1.4 1.5-1.4h1.5V4.5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v1.8H8v2.8h2.3v7" /><rect x="4" y="4" width="16" height="16" rx="4" /></svg>;
}

export function WhatsappIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M19.5 4.5A9.2 9.2 0 0 0 5.4 16.8L4 21l4.3-1.3A9.2 9.2 0 0 0 19.5 4.5Z" /><path d="M8.2 8.3c.2-.4.5-.4.8-.4h.5c.2 0 .4.1.5.4l.8 1.8c.1.3.1.5-.1.7l-.6.7c.6 1.1 1.5 2 2.7 2.6l.6-.7c.2-.2.4-.3.7-.2l1.8.8c.3.1.4.3.4.6 0 .7-.3 1.3-.8 1.6-1.1.6-3.1-.3-4.7-1.6-1.5-1.2-2.8-3-3-4.2-.2-.8.1-1.6.4-2.1Z" /></svg>;
}

export function GridIcon(props: IconProps) {
  return <svg {...base} {...props}><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></svg>;
}

export function DatabaseIcon(props: IconProps) {
  return <svg {...base} {...props}><ellipse cx="12" cy="5" rx="7" ry="3" /><path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" /></svg>;
}
