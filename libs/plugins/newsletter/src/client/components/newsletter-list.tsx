import * as React from "react";
import type { Newsletter } from "../../shared/types";

export interface NewsletterListProps {
  newsletters: Newsletter[];
  onSelect?: (newsletter: Newsletter) => void;
  className?: string;
}

export function NewsletterList({
  newsletters,
  onSelect,
  className = "",
}: NewsletterListProps) {
  if (newsletters.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        No newsletters yet
      </div>
    );
  }

  return (
    <ul className={`divide-y divide-gray-200 ${className}`}>
      {newsletters.map((newsletter) => (
        <li
          key={newsletter.id}
          className="py-4 hover:bg-gray-50 cursor-pointer"
          onClick={() => onSelect?.(newsletter)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                {newsletter.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {newsletter.status === "SENT" && newsletter.sentAt
                  ? `Sent on ${new Date(newsletter.sentAt).toLocaleDateString()}`
                  : newsletter.status}
              </p>
            </div>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                newsletter.status === "SENT"
                  ? "bg-green-100 text-green-800"
                  : newsletter.status === "SCHEDULED"
                    ? "bg-blue-100 text-blue-800"
                    : newsletter.status === "CANCELLED"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
              }`}
            >
              {newsletter.status}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
