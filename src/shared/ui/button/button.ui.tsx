import {
  Button as MantineButton,
  type ButtonProps as MantineButtonProps,
} from '@mantine/core';
import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import styles from './button.module.css';

type ButtonProps = MantineButtonProps & {
  children?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  children,
  className,
  classNames,
  bg,
  styles: propStyles,
  ...props
}: ButtonProps) => {
  const rootClassName = `${styles.button} ${className || ''}`;
  const mergedClassNames =
    typeof classNames === 'object' &&
    classNames !== null &&
    'root' in classNames
      ? { root: `${rootClassName} ${classNames.root}` }
      : { root: rootClassName };

  const mergedStyles =
    typeof propStyles === 'object' &&
    propStyles !== null &&
    'root' in propStyles
      ? {
          root: {
            backgroundColor: '#22c55e',
            transition: 'all 0.2s ease',
            ...propStyles.root,
          },
          ...propStyles,
        }
      : {
          root: {
            backgroundColor: '#22c55e',
            transition: 'all 0.2s ease',
          },
        };

  return (
    <MantineButton
      c="white"
      h={44}
      fz={14}
      fw={500}
      bdrs="lg"
      classNames={mergedClassNames}
      styles={mergedStyles}
      {...props}
    >
      {children}
    </MantineButton>
  );
};

export default Button;
