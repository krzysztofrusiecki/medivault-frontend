import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-semibold">MediVault</h1>
      <p className="mt-2 text-muted-foreground">
        Track and compare your blood test results over time.
      </p>
    </main>
  );
}
