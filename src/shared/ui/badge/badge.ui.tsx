import {
  Badge as MantineBadge,
  type BadgeProps as MantineBadgeProps,
} from '@mantine/core';
import { type ReactNode } from 'react';

type BadgeProps = MantineBadgeProps & {
  children?: ReactNode;
  leftSection?: ReactNode; // Icon yoki boshqa element uchun
};

const Badge = ({ children, leftSection, ...props }: BadgeProps) => {
  return (
    <MantineBadge leftSection={leftSection} {...props}>
      {children}
    </MantineBadge>
  );
};

export default Badge;
