import { ContainedIcon } from './Contained/Icon';
import { ContainedIconLoading } from './Contained/IconLoading';
import { ContainedRoot } from './Contained/Root';
import { ContainedText } from './Contained/Text';

import { OutlinedIcon } from './Outlined/Icon';
import { OutlinedIconLoading } from './Outlined/IconLoading';
import { OutlinedRoot } from './Outlined/Root';
import { OutlinedText } from './Outlined/Text';


export const Button = {
  Contained: {
    Root: ContainedRoot,
    Icon: ContainedIcon,
    IconLoading: ContainedIconLoading,
    Text: ContainedText,
  },
  Outlined: {
    Root: OutlinedRoot,
    Icon: OutlinedIcon,
    IconLoading: OutlinedIconLoading,
    Text: OutlinedText,
  },
}