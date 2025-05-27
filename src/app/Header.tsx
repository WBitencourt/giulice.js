'use client';

import { FontSizeControl } from "@/components/FontSizeControl";
import { ToggleTheme } from "@/components/ToggleTheme";

export default function Header() {
  return (
    <header className="flex justify-center items-center self-center row-start-1 p-4 border-b border-dashed border-zinc-200 dark:border-zinc-800">
      <div>
        <ToggleTheme.Root>
          <ToggleTheme.Icon />
        </ToggleTheme.Root>
      </div>
      <h1 className="text-center text-2xl/6 w-full text-black dark:text-white">
        Giulice.js
      </h1>
      <div>
        <FontSizeControl.Root>
          <FontSizeControl.Actions />
        </FontSizeControl.Root>
      </div>

      </header>
    )
  }