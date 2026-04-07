import { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Group,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import * as FaIcons from 'react-icons/fa';
import { MdCategory } from 'react-icons/md';
import * as FiIcons from 'react-icons/fi';
import type { IconType } from 'react-icons';
import s from '../../../services.module.css';
import {
  SERVICE_CATEGORY_GAP_PX,
  SERVICE_CATEGORY_ROW_PX,
  SERVICE_CATEGORY_ROWS_COLLAPSED,
  type ServiceSidebarCategory,
} from './category-item.const';

function IconGlyph({
  icon,
  size,
  className,
}: {
  icon: string;
  size: number;
  className?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const src = icon?.trim();

  useEffect(() => {
    setImageFailed(false);
  }, [icon]);

  if (!src) {
    return <MdCategory size={size} className={className} aria-hidden />;
  }
  if (/^(Fi|Fa)[A-Z0-9]/.test(src)) {
    const iconMap: Record<string, IconType> = {
      ...(FiIcons as Record<string, IconType>),
      ...(FaIcons as Record<string, IconType>),
    };
    const NamedIcon = iconMap[src];
    if (NamedIcon) {
      return <NamedIcon size={size} className={className} aria-hidden />;
    }
  }
  if (
    !imageFailed &&
    /^https?:\/\//i.test(src) ||
    (!imageFailed && src.startsWith('/')) ||
    (!imageFailed && src.startsWith('data:'))
  ) {
    return (
      <Box
        component="img"
        src={src}
        alt=""
        w={size}
        h={size}
        className={className}
        style={{ objectFit: 'contain', flexShrink: 0 }}
        onError={() => setImageFailed(true)}
      />
    );
  }
  return <MdCategory size={size} className={className} aria-hidden />;
}

function CategoriesSkeleton({ collapsed }: { collapsed: boolean }) {
  const rows = SERVICE_CATEGORY_ROWS_COLLAPSED;
  return (
    <Stack gap={SERVICE_CATEGORY_GAP_PX} pr={4}>
      {Array.from({ length: rows }, (_, i) =>
        collapsed ? (
          <Group key={i} justify="center" wrap="nowrap">
            <Skeleton height={32} width={32} circle />
          </Group>
        ) : (
          <Group
            key={i}
            gap="sm"
            wrap="nowrap"
            align="center"
            h={SERVICE_CATEGORY_ROW_PX}
          >
            <Skeleton height={22} width={22} circle />
            <Skeleton height={14} style={{ flex: 1 }} radius="sm" />
            <Skeleton height={22} width={32} radius="sm" />
          </Group>
        )
      )}
    </Stack>
  );
}

function CategoryCollapsedItem({
  item,
  isRowActive,
  onOpen,
}: {
  item: ServiceSidebarCategory;
  isRowActive: boolean;
  onOpen: (id: string) => void;
}) {
  return (
    <Tooltip label={item.name} position="right" withArrow>
      <UnstyledButton
        className={`${s.categoryRowCollapsed} ${isRowActive ? s.categoryRowActive : ''}`}
        onClick={() => onOpen(item.id)}
      >
        <IconGlyph
          icon={item.icon}
          size={20}
          className={`${s.categoryIcon} ${isRowActive ? s.categoryIconActive : ''}`}
        />
      </UnstyledButton>
    </Tooltip>
  );
}

function CategoryNavItem({
  item,
  isRowActive,
  onOpen,
}: {
  item: ServiceSidebarCategory;
  isRowActive: boolean;
  onOpen: (id: string) => void;
}) {
  return (
    <UnstyledButton
      className={`${s.categoryRow} ${isRowActive ? s.categoryRowActive : ''}`}
      onClick={() => onOpen(item.id)}
    >
      <IconGlyph
        icon={item.icon}
        size={18}
        className={`${s.categoryIcon} ${isRowActive ? s.categoryIconActive : ''}`}
      />
      <span
        className={`${s.categoryLabel} ${isRowActive ? s.categoryLabelActive : ''}`}
      >
        {item.name}
      </span>
      <Badge size="sm" variant="light" color="gray" style={{ flexShrink: 0 }}>
        {item.count}
      </Badge>
    </UnstyledButton>
  );
}

export type CategoriesContentProps = {
  collapsed: boolean;
  isPending: boolean;
  isError: boolean;
  categories: ServiceSidebarCategory[];
  activeCategoryId: string | null;
  onOpenCategory: (id: string) => void;
};

export function Categories({
  collapsed,
  isPending,
  isError,
  categories,
  activeCategoryId,
  onOpenCategory,
}: CategoriesContentProps) {
  if (isPending) {
    return (
      <Stack gap={4} pr={4}>
        <CategoriesSkeleton collapsed={collapsed} />
      </Stack>
    );
  }
  if (isError) {
    return (
      <Stack gap={4} pr={4}>
        <Text size="sm" c="red" px={4}>
          Turkumlarni yuklab bo‘lmadi
        </Text>
      </Stack>
    );
  }
  if (categories.length === 0) {
    return (
      <Stack gap={4} pr={4}>
        <Text size="sm" c="dimmed" px={4} ta="center" py="sm">
          Hech narsa yo‘q
        </Text>
      </Stack>
    );
  }
  return (
    <Stack gap={4} pr={4}>
      {categories.map((item) => {
        const isRowActive = activeCategoryId === item.id;
        if (collapsed) {
          return (
            <CategoryCollapsedItem
              key={item.id}
              item={item}
              isRowActive={isRowActive}
              onOpen={onOpenCategory}
            />
          );
        }
        return (
          <CategoryNavItem
            key={item.id}
            item={item}
            isRowActive={isRowActive}
            onOpen={onOpenCategory}
          />
        );
      })}
    </Stack>
  );
}
