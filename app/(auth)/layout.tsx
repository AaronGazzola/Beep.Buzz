import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center py-12">
      <Link
        href="/"
        className="mb-8 text-2xl font-bold tracking-tight hover:opacity-80"
      >
        Beep.Buzz
      </Link>
      <div className="w-full max-w-md px-4">{children}</div>
    </div>
  );
}
