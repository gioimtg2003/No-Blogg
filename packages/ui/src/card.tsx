import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", title, description, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm ${className}`}
        {...props}
      >
        {title && (
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        )}
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
        {children && <div className="mt-4">{children}</div>}
      </div>
    );
  }
);

Card.displayName = "Card";
