import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  Modal,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { motion } from 'framer-motion';
import {
  BsArrowLeft,
  BsChevronDown,
  BsChevronUp,
  BsPlus,
} from 'react-icons/bs';
import { IoFilter } from 'react-icons/io5';
import { HiOutlineTrash } from 'react-icons/hi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMobileDashboardDrawer } from '@/app/layout/dashboard/mobile-dashboard-drawer.context';
import {
  getCategoryListHeightPx,
  MOCK_SERVICE_FILTER_FIELDS,
  MOCK_SERVICE_SIDEBAR_CATEGORIES,
  SERVICE_CATEGORY_EXPAND_EXTRA_ROWS,
  SERVICE_CATEGORY_GAP_PX,
  SERVICE_CATEGORY_ROW_PX,
  SERVICE_CATEGORY_ROWS_COLLAPSED,
  SERVICE_CATEGORY_TOGGLE_RESERVE_PX,
  type ServiceSidebarCategory,
} from './services.const';
import s from './services.module.css';

interface ServicesSidebarProps {
  collapsed: boolean;
}

function ServiceCategoryCollapsedItem({
  item,
  isRowActive,
  onOpen,
}: {
  item: ServiceSidebarCategory;
  isRowActive: boolean;
  onOpen: (id: string) => void;
}) {
  const Icon = item.icon;
  return (
    <Tooltip label={item.label} position="right" withArrow>
      <UnstyledButton
        className={`${s.categoryRowCollapsed} ${isRowActive ? s.categoryRowActive : ''}`}
        onClick={() => onOpen(item.id)}
      >
        <Icon
          size={20}
          className={`${s.categoryIcon} ${isRowActive ? s.categoryIconActive : ''}`}
        />
      </UnstyledButton>
    </Tooltip>
  );
}

function ServiceCategoryNavItem({
  item,
  isRowActive,
  onOpen,
}: {
  item: ServiceSidebarCategory;
  isRowActive: boolean;
  onOpen: (id: string) => void;
}) {
  const Icon = item.icon;
  return (
    <UnstyledButton
      className={`${s.categoryRow} ${isRowActive ? s.categoryRowActive : ''}`}
      onClick={() => onOpen(item.id)}
    >
      <Icon
        size={18}
        className={`${s.categoryIcon} ${isRowActive ? s.categoryIconActive : ''}`}
      />
      <span
        className={`${s.categoryLabel} ${isRowActive ? s.categoryLabelActive : ''}`}
      >
        {item.label}
      </span>
      <Badge size="sm" variant="light" color="gray" style={{ flexShrink: 0 }}>
        {item.count}
      </Badge>
    </UnstyledButton>
  );
}

export default function ServicesSidebar({ collapsed }: ServicesSidebarProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mobileDrawer = useMobileDashboardDrawer();

  const categories = MOCK_SERVICE_SIDEBAR_CATEGORIES;
  const categoriesBlockRef = useRef<HTMLDivElement>(null);
  const [maxRowsFit, setMaxRowsFit] = useState(categories.length);

  const [listMoreOpen, setListMoreOpen] = useState(false);

  const [filterOpened, { open: openFilter, close: closeFilter }] =
    useDisclosure(false);

  const [filterDraft, setFilterDraft] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        MOCK_SERVICE_FILTER_FIELDS.map((f) => [f.id, false])
      ) as Record<string, boolean>
  );
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        MOCK_SERVICE_FILTER_FIELDS.map((f) => [f.id, false])
      ) as Record<string, boolean>
  );

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

  const activeCategoryId = useMemo(
    () => searchParams.get('turkum'),
    [searchParams]
  );

  const goBack = useCallback(() => {
    if (mobileDrawer?.isMobile) mobileDrawer.closeMobileDrawer();
    navigate('/dashboard/home');
  }, [mobileDrawer, navigate]);

  const openCategory = useCallback(
    (id: string) => {
      if (mobileDrawer?.isMobile) mobileDrawer.closeMobileDrawer();
      navigate({
        pathname: '/dashboard/services',
        search: `?turkum=${encodeURIComponent(id)}`,
      });
    },
    [mobileDrawer, navigate]
  );

  const applyFilter = useCallback(() => {
    setActiveFilters({ ...filterDraft });
    closeFilter();
  }, [closeFilter, filterDraft]);

  const resetFilterModal = useCallback(() => {
    const empty = Object.fromEntries(
      MOCK_SERVICE_FILTER_FIELDS.map((f) => [f.id, false])
    ) as Record<string, boolean>;
    setFilterDraft(empty);
  }, []);

  const clearEverything = useCallback(() => {
    const empty = Object.fromEntries(
      MOCK_SERVICE_FILTER_FIELDS.map((f) => [f.id, false])
    ) as Record<string, boolean>;
    setFilterDraft(empty);
    setActiveFilters(empty);
    setListMoreOpen(false);
    navigate({ pathname: '/dashboard/services', search: '' });
  }, [navigate]);

  const createService = useCallback(() => {
    if (mobileDrawer?.isMobile) mobileDrawer.closeMobileDrawer();
    navigate('/dashboard/services');
  }, [mobileDrawer, navigate]);

  const renderCategoryRow = (item: ServiceSidebarCategory) => {
    const isRowActive = activeCategoryId === item.id;
    if (collapsed) {
      return (
        <ServiceCategoryCollapsedItem
          key={item.id}
          item={item}
          isRowActive={isRowActive}
          onOpen={openCategory}
        />
      );
    }
    return (
      <ServiceCategoryNavItem
        key={item.id}
        item={item}
        isRowActive={isRowActive}
        onOpen={openCategory}
      />
    );
  };

  return (
    <Stack gap={0} h="100%" style={{ minHeight: 0 }}>
      {!collapsed && (
        <Box px="sm" pt="md" pb="xs">
          <Text fw={600} size="md">
            Xizmatlar
          </Text>
        </Box>
      )}

      <Box px="sm" pb="xs">
        {collapsed ? (
          <ActionIcon
            variant="subtle"
            onClick={goBack}
            aria-label="Orqaga"
            w="100%"
            h={36}
            bd="1.5px solid var(--mantine-color-green-3)"
          >
            <BsArrowLeft size={18} />
          </ActionIcon>
        ) : (
          <Button
            fullWidth
            h={36}
            variant="subtle"
            leftSection={<BsArrowLeft size={16} />}
            onClick={goBack}
            bd="1.5px solid var(--mantine-color-green-3)"
          >
            Orqaga qaytish
          </Button>
        )}
      </Box>

      <Box px="sm" pb="xs">
        {collapsed ? (
          <ActionIcon
            h={36}
            variant="light"
            color="green"
            onClick={createService}
            aria-label="Xizmat yaratish"
            w="100%"
          >
            <BsPlus size={18} />
          </ActionIcon>
        ) : (
          <Button
            fullWidth
            h={36}
            leftSection={<BsPlus size={16} />}
            color="green"
            onClick={createService}
          >
            Xizmat yaratish
          </Button>
        )}
      </Box>

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
          <ScrollArea type="auto" offsetScrollbars h="100%" mah="100%">
            <Stack gap={4} pr={4}>
              {categories.map((c) => renderCategoryRow(c))}
            </Stack>
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

      {!collapsed && (
        <Box px="sm" py="xs" style={{ flexShrink: 0 }}>
          <Button
            fullWidth
            variant="light"
            color="gray"
            leftSection={<IoFilter size={18} />}
            onClick={() => {
              setFilterDraft({ ...activeFilters });
              openFilter();
            }}
          >
            Kengaytirilgan filter
          </Button>
        </Box>
      )}

      {collapsed && (
        <Box px="sm" pb="xs" style={{ flexShrink: 0 }}>
          <Tooltip label="Kengaytirilgan filter" position="right" withArrow>
            <ActionIcon
              variant="light"
              color="gray"
              w="100%"
              h={36}
              onClick={() => {
                setFilterDraft({ ...activeFilters });
                openFilter();
              }}
              aria-label="Filter"
            >
              <IoFilter size={18} />
            </ActionIcon>
          </Tooltip>
        </Box>
      )}

      <Box px="sm" pb="sm" mt="auto" style={{ flexShrink: 0 }}>
        <Divider mb="sm" />
        {collapsed ? (
          <Tooltip label="Hammasini tozalash" position="right" withArrow>
            <ActionIcon
              variant="light"
              color="red"
              w="100%"
              h={36}
              onClick={clearEverything}
              aria-label="Hammasini tozalash"
            >
              <HiOutlineTrash size={18} />
            </ActionIcon>
          </Tooltip>
        ) : (
          <Button
            fullWidth
            variant="light"
            color="red"
            leftSection={<HiOutlineTrash size={18} />}
            onClick={clearEverything}
          >
            Hammasini tozalash
          </Button>
        )}
      </Box>

      <Modal
        opened={filterOpened}
        onClose={closeFilter}
        title="Kengaytirilgan filter"
        centered
        size="sm"
      >
        <Stack gap="sm">
          {MOCK_SERVICE_FILTER_FIELDS.map((f) => (
            <Checkbox
              key={f.id}
              label={f.label}
              checked={filterDraft[f.id] ?? false}
              onChange={(e) =>
                setFilterDraft((d) => ({
                  ...d,
                  [f.id]: e.currentTarget.checked,
                }))
              }
            />
          ))}
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={resetFilterModal}>
              Filterlarni qayta
            </Button>
            <Button color="green" onClick={applyFilter}>
              Qo'llash
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
