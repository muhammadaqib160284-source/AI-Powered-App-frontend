import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center p-6" data-testid="not-found-page">
      <div className="space-y-4 text-center">
        <Logo className="justify-center" />
        <p className="font-mono text-sm text-muted-foreground">404</p>
        <h1 className="text-2xl font-semibold">This page doesn't exist</h1>
        <div className="flex justify-center gap-2">
          <Button asChild variant="outline"><Link to="/">Home</Link></Button>
          <Button asChild><Link to="/app">Open app</Link></Button>
        </div>
      </div>
    </div>
  );
}
