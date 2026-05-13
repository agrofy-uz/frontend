import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { BsArrowLeft, BsPlus } from 'react-icons/bs';
import { IoFilter } from 'react-icons/io5';
import { HiOutlineTrash } from 'react-icons/hi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMobileDashboardDrawer } from '@/app/layout/dashboard/mobile-dashboard-drawer.context';
import {
  DEFAULT_SERVICES_FILTER_VALUES,
  mergeServicesFilterIntoSearchParams,
  parseServicesFilterFromSearchParams,
  SERVICES_CATEGORY_QUERY_KEY,
  SERVICES_FILTER_QUERY_KEYS,
  SERVICES_LIST_META_QUERY_KEYS,
  SERVICES_SEARCH_ENTER_CHIP_QUERY_KEY,
  SERVICES_SEARCH_QUERY_KEY,
  type ServicesFilterValues,
} from './services.const';
import { CategoriesBlock } from './ui/category';
import { ServicesFilterModal } from './ui/filter-modal';

interface ServicesSidebarProps {
  collapsed: boolean;
}

export default function ServicesSidebar({ collapsed }: ServicesSidebarProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const mobileDrawer = useMobileDashboardDrawer();

  const [categoriesListResetKey, setCategoriesListResetKey] = useState(0);

  const [filterOpened, { open: openFilter, close: closeFilter }] =
    useDisclosure(false);

  const [appliedFilter, setAppliedFilter] = useState<ServicesFilterValues>(
    () =>
      typeof window !== 'undefined'
        ? parseServicesFilterFromSearchParams(
            new URLSearchParams(window.location.search)
          )
        : { ...DEFAULT_SERVICES_FILTER_VALUES }
  );

  useLayoutEffect(() => {
    setAppliedFilter(parseServicesFilterFromSearchParams(searchParams));
  }, [searchParams]);

  const handleApplyFilter = useCallback(
    (next: ServicesFilterValues) => {
      setAppliedFilter(next);
      setSearchParams((prev) => {
        return mergeServicesFilterIntoSearchParams(prev, next);
      });
      if (mobileDrawer?.isMobile) mobileDrawer.closeMobileDrawer();
    },
    [mobileDrawer, setSearchParams]
  );

  const activeCategoryId = useMemo(
    () => searchParams.get(SERVICES_CATEGORY_QUERY_KEY),
    [searchParams]
  );

  const goBack = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  const openCategory = useCallback(
    (id: string) => {
      setSearchParams((prev) => {
        const next = mergeServicesFilterIntoSearchParams(prev, appliedFilter);
        next.set(SERVICES_CATEGORY_QUERY_KEY, id);
        next.delete(SERVICES_SEARCH_QUERY_KEY);
        next.delete(SERVICES_SEARCH_ENTER_CHIP_QUERY_KEY);
        return next;
      });
    },
    [appliedFilter, setSearchParams]
  );

  const clearEverything = useCallback(() => {
    setAppliedFilter({ ...DEFAULT_SERVICES_FILTER_VALUES });
    setCategoriesListResetKey((k) => k + 1);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete(SERVICES_CATEGORY_QUERY_KEY);
      next.delete(SERVICES_SEARCH_QUERY_KEY);
      next.delete(SERVICES_SEARCH_ENTER_CHIP_QUERY_KEY);
      for (const k of SERVICES_FILTER_QUERY_KEYS) next.delete(k);
      for (const k of SERVICES_LIST_META_QUERY_KEYS) next.delete(k);
      return next;
    });
    if (mobileDrawer?.isMobile) mobileDrawer.closeMobileDrawer();
  }, [mobileDrawer, setSearchParams]);

  const createService = useCallback(() => {
    if (mobileDrawer?.isMobile) mobileDrawer.closeMobileDrawer();
    navigate('/dashboard/my-ads?create=services');
  }, [mobileDrawer, navigate]);

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

      <CategoriesBlock
        collapsed={collapsed}
        activeCategoryId={activeCategoryId ?? null}
        onOpenCategory={openCategory}
        listResetKey={categoriesListResetKey}
      />

      {!collapsed && (
        <Box px="sm" py="xs" style={{ flexShrink: 0 }}>
          <Button
            fullWidth
            variant="light"
            color="gray"
            leftSection={<IoFilter size={18} />}
            onClick={openFilter}
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
              onClick={openFilter}
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

      <ServicesFilterModal
        opened={filterOpened}
        onClose={closeFilter}
        value={appliedFilter}
        onApply={handleApplyFilter}
      />
    </Stack>
  );
}
