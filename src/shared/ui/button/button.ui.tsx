import {
  Button as MantineButton,
  type ButtonProps as MantineButtonProps,
} from '@mantine/core';
import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type ButtonProps = MantineButtonProps & {
  children?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <MantineButton
      bg="green"
      c="white"
      h={44}
      fz={14}
      fw={500}
      bdrs="lg"
      {...props}
    >
      {children}
    </MantineButton>
  );
};

export default Button;
