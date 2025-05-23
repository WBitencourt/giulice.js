'use client';

import { TextField } from "@/components/TextField";
import { useState } from "react";

export const TextFieldComponent = () => {
  const [value, setValue] = useState('');

  return (
    <TextField.Root>
      <TextField.Main.Root>
        <TextField.Main.Label>
          Label
        </TextField.Main.Label>
        <TextField.Main.Input.Root>
          <TextField.Main.Input.Field
            id="input-test"
            name="input-test"
            placeholder="Digite algo"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </TextField.Main.Input.Root>
      </TextField.Main.Root>
      <TextField.Button.Root>
        <TextField.Button.Clean onClick={() => setValue('')} />
      </TextField.Button.Root>
    </TextField.Root>
  )
}