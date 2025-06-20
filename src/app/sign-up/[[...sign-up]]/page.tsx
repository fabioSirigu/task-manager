import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8">
        <SignUp />
      </div>
    </main>
  );
}
