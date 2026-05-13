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
  DEFAULT_MARKET_FILTER_VALUES,
  mergeMarketFilterIntoSearchParams,
  parseMarketFilterFromSearchParams,
  MARKET_CATEGORY_QUERY_KEY,
  MARKET_FILTER_QUERY_KEYS,
  MARKET_LIST_META_QUERY_KEYS,
  MARKET_SEARCH_ENTER_CHIP_QUERY_KEY,
  MARKET_SEARCH_QUERY_KEY,
  type MarketFilterValues,
} from './market.const';
import { CategoriesBlock } from './ui/category';
import { MarketFilterModal } from './ui/filter-modal';

interface MarketSidebarProps {
  collapsed: boolean;
}

export default function MarketSidebar({ collapsed }: MarketSidebarProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const mobileDrawer = useMobileDashboardDrawer();

  const [categoriesListResetKey, setCategoriesListResetKey] = useState(0);

  const [filterOpened, { open: openFilter, close: closeFilter }] =
    useDisclosure(false);

  const [appliedFilter, setAppliedFilter] = useState<MarketFilterValues>(
    () =>
      typeof window !== 'undefined'
        ? parseMarketFilterFromSearchParams(
            new URLSearchParams(window.location.search)
          )
        : { ...DEFAULT_MARKET_FILTER_VALUES }
  );

  useLayoutEffect(() => {
    setAppliedFilter(parseMarketFilterFromSearchParams(searchParams));
  }, [searchParams]);

  const handleApplyFilter = useCallback(
    (next: MarketFilterValues) => {
      setAppliedFilter(next);
      setSearchParams((prev) => {
        return mergeMarketFilterIntoSearchParams(prev, next);
      });
      if (mobileDrawer?.isMobile) mobileDrawer.closeMobileDrawer();
    },
    [mobileDrawer, setSearchParams]
  );

  const activeCategoryId = useMemo(
    () => searchParams.get(MARKET_CATEGORY_QUERY_KEY),
    [searchParams]
  );

  const goBack = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  const openCategory = useCallback(
    (id: string) => {
      setSearchParams((prev) => {
        const next = mergeMarketFilterIntoSearchParams(prev, appliedFilter);
        next.set(MARKET_CATEGORY_QUERY_KEY, id);
        next.delete(MARKET_SEARCH_QUERY_KEY);
        next.delete(MARKET_SEARCH_ENTER_CHIP_QUERY_KEY);
        return next;
      });
    },
    [appliedFilter, setSearchParams]
  );

  const clearEverything = useCallback(() => {
    setAppliedFilter({ ...DEFAULT_MARKET_FILTER_VALUES });
    setCategoriesListResetKey((k) => k + 1);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete(MARKET_CATEGORY_QUERY_KEY);
      next.delete(MARKET_SEARCH_QUERY_KEY);
      next.delete(MARKET_SEARCH_ENTER_CHIP_QUERY_KEY);
      for (const k of MARKET_FILTER_QUERY_KEYS) next.delete(k);
      for (const k of MARKET_LIST_META_QUERY_KEYS) next.delete(k);
      return next;
    });
    if (mobileDrawer?.isMobile) mobileDrawer.closeMobileDrawer();
  }, [mobileDrawer, setSearchParams]);

  const createProduct = useCallback(() => {
    if (mobileDrawer?.isMobile) mobileDrawer.closeMobileDrawer();
    navigate('/dashboard/my-ads?create=products');
  }, [mobileDrawer, navigate]);

  return (
    <Stack gap={0} h="100%" style={{ minHeight: 0 }}>
      {!collapsed && (
        <Box px="sm" pt="md" pb="xs">
          <Text fw={600} size="md">
            Mahsulotlar
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
            onClick={createProduct}
            aria-label="Mahsulot yaratish"
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
            onClick={createProduct}
          >
            Mahsulot yaratish
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

      <MarketFilterModal
        opened={filterOpened}
        onClose={closeFilter}
        value={appliedFilter}
        onApply={handleApplyFilter}
      />
    </Stack>
  );
}
