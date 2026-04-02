/** FYP PORTAL logo: astronaut/person icon in rounded square - used in sidebar and header */
export function FYPLogoIcon({ className = 'w-8 h-8', darkBg = true }) {
  return (
    <div className={`flex-shrink-0 rounded-lg flex items-center justify-center ${darkBg ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`} style={{ width: '2.25rem', height: '2.25rem' }}>
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
      </svg>
    </div>
  );
}

export default FYPLogoIcon;
