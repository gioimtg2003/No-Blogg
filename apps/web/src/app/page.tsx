import { Button, Card } from "@no-blogg/ui";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card
        title="Welcome to No-Blogg"
        description="Multi-tenant SaaS System built with Turborepo"
        className="max-w-lg"
      >
        <div className="flex gap-4">
          <Button variant="primary">Get Started</Button>
          <Button variant="outline">Learn More</Button>
        </div>
      </Card>
    </main>
  );
}
