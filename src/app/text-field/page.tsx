import { Metadata } from "next";
import { TextFieldComponent } from "./component";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TextField",
  description: "Página de TextField",
};

export default function Home() {
  return (
    <div className="flex flex-col items-center h-full w-full">
      <h2 className="text-2xl font-bold">TextField</h2>
      <div className="flex flex-col justify-center h-full w-full px-40 rounded-lg">
        <TextFieldComponent />
      </div>
      <div className="flex gap-2 justify-center items-center rounded-lg">
        <div>⬅️</div>
        <Link className="text-blue-500 underline" href="/">Back to home</Link>
        <div>🏠</div>
      </div>
    </div>
  );
}
