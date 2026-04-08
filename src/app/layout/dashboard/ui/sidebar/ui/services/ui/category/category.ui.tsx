import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Box, ScrollArea, Text, Tooltip } from '@mantine/core';
import { motion } from 'framer-motion';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { useQuery } from '@tanstack/react-query';
import { getServicesCategories } from '@/shared/api/services/services';
import s from '../../services.module.css';
import {
  getCategoryListHeightPx,
  SERVICE_CATEGORY_EXPAND_EXTRA_ROWS,
  SERVICE_CATEGORY_GAP_PX,
  SERVICE_CATEGORY_ROW_PX,
  SERVICE_CATEGORY_ROWS_COLLAPSED,
  SERVICE_CATEGORY_TOGGLE_RESERVE_PX,
} from './category.const';
import { Categories } from './ui/category-item.ui';

export type CategoriesBlockProps = {
  collapsed: boolean;
  activeCategoryId: string | null;
  onOpenCategory: (id: string) => void;
  /** `clearEverything` kabi holatlarda ro‘yxatni qisqa rejimga qaytarish */
  listResetKey: number;
};

function CategoriesBlock({
  collapsed,
  activeCategoryId,
  onOpenCategory,
  listResetKey,
}: CategoriesBlockProps) {
  const categoriesQuery = useQuery({
    queryKey: ['services', 'categories'],
    queryFn: () => getServicesCategories(),
    staleTime: 60_000,
  });

  const categories = categoriesQuery.data ?? [];
  const categoriesBlockRef = useRef<HTMLDivElement>(null);
  const [maxRowsFit, setMaxRowsFit] = useState(categories.length);
  const [listMoreOpen, setListMoreOpen] = useState(false);
  useLayoutEffect(() => {
    setListMoreOpen(false);
  }, [listResetKey]);

  const effectiveCap = useMemo(
    () =>
      Math.max(
        SERVICE_CATEGORY_ROWS_COLLAPSED,
        Math.min(categories.length, maxRowsFit)
      ),
    [categories.length, maxRowsFit]
  );

  const expandedRowTarget = useMemo(
    () =>
      Math.min(
        SERVICE_CATEGORY_ROWS_COLLAPSED + SERVICE_CATEGORY_EXPAND_EXTRA_ROWS,
        effectiveCap,
        categories.length
      ),
    [categories.length, effectiveCap]
  );

  useLayoutEffect(() => {
    const el = categoriesBlockRef.current;
    if (!el) return undefined;

    const measure = () => {
      const H = el.getBoundingClientRect().height;
      if (H < 16) return;
      const usable = Math.max(0, H - SERVICE_CATEGORY_TOGGLE_RESERVE_PX);
      const unit = SERVICE_CATEGORY_ROW_PX + SERVICE_CATEGORY_GAP_PX;
      const fit = Math.floor((usable + SERVICE_CATEGORY_GAP_PX) / unit);
      const cap = Math.max(
        SERVICE_CATEGORY_ROWS_COLLAPSED,
        Math.min(fit, categories.length)
      );
      setMaxRowsFit(cap);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [categories.length, collapsed]);

  useLayoutEffect(() => {
    if (listMoreOpen && expandedRowTarget <= SERVICE_CATEGORY_ROWS_COLLAPSED) {
      setListMoreOpen(false);
    }
  }, [expandedRowTarget, listMoreOpen]);

  const visibleRows = listMoreOpen
    ? expandedRowTarget
    : SERVICE_CATEGORY_ROWS_COLLAPSED;

  const listMaxHeight = getCategoryListHeightPx(visibleRows);

  const canExpandOnce =
    !listMoreOpen && expandedRowTarget > SERVICE_CATEGORY_ROWS_COLLAPSED;
  const canCollapse = listMoreOpen;

  const showListToggle =
    categories.length > SERVICE_CATEGORY_ROWS_COLLAPSED &&
    effectiveCap > SERVICE_CATEGORY_ROWS_COLLAPSED &&
    expandedRowTarget > SERVICE_CATEGORY_ROWS_COLLAPSED;

  const handleToggleList = useCallback(() => {
    if (canExpandOnce) setListMoreOpen(true);
    else if (canCollapse) setListMoreOpen(false);
  }, [canCollapse, canExpandOnce]);

  return (
    <>
      {!collapsed && (
        <Box px="sm" pb={6}>
          <Text size="xs" fw={600} c="dimmed" tt="uppercase">
            Turkumlar
          </Text>
        </Box>
      )}

      <Box
        ref={categoriesBlockRef}
        px="sm"
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <motion.div
          initial={false}
          animate={{ height: listMaxHeight }}
          transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
          style={{
            overflow: 'hidden',
            flex: showListToggle ? '0 0 auto' : 1,
            minHeight: 0,
          }}
        >
          <ScrollArea
            type="hover"
            offsetScrollbars
            scrollHideDelay={400}
            scrollbarSize={collapsed ? 4 : 7}
            h="100%"
            mah="100%"
            styles={{
              scrollbar: {
                padding: collapsed ? 1 : 2,
              },
              thumb: {
                backgroundColor:
                  'light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-3))',
              },
            }}
          >
            <Categories
              collapsed={collapsed}
              isPending={categoriesQuery.isPending}
              isError={categoriesQuery.isError}
              categories={categories}
              activeCategoryId={activeCategoryId}
              onOpenCategory={onOpenCategory}
            />
          </ScrollArea>
        </motion.div>

        {showListToggle && !collapsed && (canExpandOnce || canCollapse) && (
          <button
            type="button"
            className={s.listToggleBtn}
            onClick={handleToggleList}
            style={{ marginTop: 4 }}
          >
            {canExpandOnce ? (
              <BsChevronDown size={16} className={s.listToggleIcon} />
            ) : (
              <BsChevronUp size={16} className={s.listToggleIcon} />
            )}
            <span className={s.listToggleLabel} style={{ marginLeft: 6 }}>
              {canExpandOnce ? "Ko'proq ko'rsatish" : "Kamroq ko'rsatish"}
            </span>
          </button>
        )}

        {showListToggle && collapsed && (canExpandOnce || canCollapse) && (
          <Tooltip
            label={canExpandOnce ? "Ko'proq" : 'Kamroq'}
            position="right"
            withArrow
          >
            <button
              type="button"
              className={s.listToggleBtn}
              onClick={handleToggleList}
              aria-label="Ro'yxatni kengaytirish"
              style={{ marginTop: 4, height: 32 }}
            >
              {canExpandOnce ? (
                <BsChevronDown size={16} className={s.listToggleIcon} />
              ) : (
                <BsChevronUp size={16} className={s.listToggleIcon} />
              )}
            </button>
          </Tooltip>
        )}
      </Box>
    </>
  );
}

export default CategoriesBlock;
