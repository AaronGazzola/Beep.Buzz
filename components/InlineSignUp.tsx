import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface InlineSignUpProps {
  className?: string;
}

export function InlineSignUp({ className }: InlineSignUpProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md mx-auto p-6 rounded-lg border bg-card text-card-foreground",
        className,
      )}
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold">Save Your Progress</h3>
      </div>

      <Button asChild className="w-full">
        <Link href="/sign-up">Sign Up</Link>
      </Button>
    </div>
  );
}
