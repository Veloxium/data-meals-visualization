import { Suspense } from "react";
import ChartList from "./chartlist";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <ChartList />
    </Suspense>
  );
}
