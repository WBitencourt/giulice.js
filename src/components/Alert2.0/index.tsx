import { Message } from './Message';
import { CloseButton } from './Button';
import { Error, Default, Info, Success, Warning } from './Root';

export const Alert = {
  Root: {
    Default,
    Error,
    Info,
    Success,
    Warning,
  },
  Message,
  Button: {
    Close: CloseButton,
  },
}