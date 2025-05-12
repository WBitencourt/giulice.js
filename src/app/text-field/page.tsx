import { Metadata } from "next";
import { TextField } from "@/components/TextField";

export const metadata: Metadata = {
  title: "Home",
  description: "Página inicial",
};

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4">
      <main className="flex flex-col gap-[32px] row-start-2 items-center justify-center sm:items-start">
        <TextField.Root>

        </TextField.Root>
      </main>
      <footer className="row-start-3 flex flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
