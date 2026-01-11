interface LogoProps {
  className?: string
}

export function Logo({ className = "w-9 h-9" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" className="fill-primary" />

      <rect x="6" y="10" width="8" height="8" rx="1.5" fill="white" />
      <rect x="18" y="10" width="8" height="8" rx="1.5" fill="white" fillOpacity="0.6" />
      <rect x="6" y="22" width="8" height="4" rx="1" fill="white" fillOpacity="0.4" />
      <rect x="18" y="22" width="8" height="4" rx="1" fill="white" fillOpacity="0.4" />

      <rect x="6" y="4" width="20" height="3" rx="1.5" fill="white" fillOpacity="0.8" />
    </svg>
  )
}