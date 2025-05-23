import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home",
  description: "Página inicial",
};

export default function Home() {
  return (
    <div className="flex flex-col gap-6 items-center h-full w-full">
      <h2 className="text-2xl font-bold">Home</h2>
      <ul>
        <li>
          <Link className="text-blue-500 underline" href="/text-field">TextField</Link>
        </li>
      </ul>
    </div>
  );
}
