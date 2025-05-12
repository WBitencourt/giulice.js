import React from 'react';
import { Label } from './Main/Label';
import { ButtonClipboard } from './Main/Input/Button/Clipboard';
import { ButtonClean } from './Main/Input/Button/Clean';
import { ButtonPasswordView } from './Main/Input/Button/PasswordView';
import { ProviderRoot } from './Root';
import { InputRoot } from './Main/Input/Root';
import { InputField } from './Main/Input/Field';
import { ButtonDatePicker } from './Main/Input/Button/Calendar';
import { ButtonRoot } from './Main/Input/Button/Root';
import { MainRoot } from './Main/Root/Index';

export const TextField = {
  Root: ProviderRoot,
  Main: {
    Root: MainRoot,
    Label,
    Input: {
      Root: InputRoot,
      Field: InputField,
    },
  },
  Button: {
    Root: ButtonRoot,
    DatePicker: ButtonDatePicker,
    Clean: ButtonClean,
    Clipboard: ButtonClipboard,
    Password: ButtonPasswordView,
  },
}