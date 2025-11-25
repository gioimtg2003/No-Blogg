import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'No-Blogg',
  description: 'A multi-tenant blog platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
