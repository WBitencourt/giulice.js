import { ContainedIcon } from './contained/icon';
import { ContainediconLoading } from './contained/iconLoading';
import { ContainedRoot } from './contained/root';
import { ContainedText } from './contained/text';

import { OutlinedIcon } from './outlined/icon';
import { OutlinediconLoading } from './outlined/iconLoading';
import { OutlinedRoot } from './outlined/root';
import { OutlinedText } from './outlined/text';


export const Button = {
  Contained: {
    Root: ContainedRoot,
    Icon: ContainedIcon,
    iconLoading: ContainediconLoading,
    Text: ContainedText,
  },
  Outlined: {
    Root: OutlinedRoot,
    Icon: OutlinedIcon,
    iconLoading: OutlinediconLoading,
    Text: OutlinedText,
  },
}