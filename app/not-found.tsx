import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
        404
      </h2>
      <p className="text-xl text-muted-foreground">Page Not Found</p>
      <p className="text-muted-foreground max-w-md">
        Could not find requested resource. It might have been removed or
        renamed.
      </p>
      <Link href="/">
        <Button size="lg" className="mt-4">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
