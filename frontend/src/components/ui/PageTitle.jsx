/**
 * Consistent page header for all dashboard pages.
 * Title and subtitle animate in with a staggered fade-in-up effect.
 */
export default function PageTitle({ title, subtitle, action, underline = true }) {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-title animate-fade-in-up" style={{ animationDuration: '0.5s' }}>{title}</h1>
        {underline && <span className="page-title-underline animate-fade-in-up animation-delay-150" style={{ animationDuration: '0.45s' }} />}
        {subtitle && (
          <p className="text-sm text-slate-500 mt-2 animate-fade-in-up animation-delay-200" style={{ animationDuration: '0.5s' }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0 animate-fade-in-up animation-delay-250" style={{ animationDuration: '0.4s' }}>{action}</div>}
    </div>
  );
}
