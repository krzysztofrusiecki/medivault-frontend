import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-semibold tracking-tight">MediVault</h1>
      <p className="text-muted-foreground mt-2">
        Track and compare your blood test results over time.
      </p>
    </main>
  );
}
