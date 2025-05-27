import { Label } from './Content/Label';
import { ButtonClipboard } from './Button/Clipboard';
import { ButtonClean } from './Button/Clean';
import { ButtonPasswordView } from './Button/PasswordView';
import { ProviderRoot } from './Root';
import { Input } from './Content/Input';
import { ButtonRoot } from './Button/Root';
import { ContentRoot } from './Content/Root/Index';

export const TextField = {
  Root: ProviderRoot,
  Content: {
    Root: ContentRoot,
    Label,
    Input,
  },
  Button: {
    Root: ButtonRoot,
    DatePicker: <></>,
    Clean: ButtonClean,
    Clipboard: ButtonClipboard,
    Password: ButtonPasswordView,
  },
}