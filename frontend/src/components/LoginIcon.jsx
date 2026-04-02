/**
 * Login icon: arrow pointing right into open door/gate (minimalist, flat).
 * Use className for size/color (e.g. w-5 h-5 text-white).
 */
export default function LoginIcon({ className = 'w-5 h-5' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      {/* Arrow pointing right */}
      <path d="M4 8l6 4-6 4V8z" />
      {/* Open door - C-shaped bracket */}
      <path d="M14 4L22 4 22 20 14 20 14 18 20 18 20 6 14 6 14 4z" />
    </svg>
  );
}
