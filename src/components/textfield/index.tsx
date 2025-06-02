import { Label } from './content/label';
import { ButtonClipboard } from './button/clipboard';
import { ButtonClean } from './button/clean';
import { ButtonpasswordView } from './button/passwordView';
import { ProviderRoot } from './root';
import { Input } from './content/input';
import { ButtonRoot } from './button/root';
import { ContentRoot } from './content/root/index';

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
    Password: ButtonpasswordView,
  },
}