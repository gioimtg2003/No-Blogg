import * as React from "react";
import type { SubscribeDto } from "../../shared/dto";

export interface NewsletterSubscribeFormProps {
  onSubmit: (data: SubscribeDto) => void | Promise<void>;
  loading?: boolean;
  className?: string;
}

export function NewsletterSubscribeForm({
  onSubmit,
  loading = false,
  className = "",
}: NewsletterSubscribeFormProps) {
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, name: name || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div>
        <label
          htmlFor="newsletter-email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="newsletter-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label
          htmlFor="newsletter-name"
          className="block text-sm font-medium text-gray-700"
        >
          Name (optional)
        </label>
        <input
          type="text"
          id="newsletter-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          placeholder="John Doe"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? "Subscribing..." : "Subscribe"}
      </button>
    </form>
  );
}
