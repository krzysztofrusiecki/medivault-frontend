import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Hello world! {count}</h1>
      <Button
        onClick={() => {
          setCount((c) => c + 1);
        }}
      >
        Increment
      </Button>
    </>
  );
}
