import { forwardRef, useEffect, useMemo, useState } from 'react';
import {
  Box,
  CloseButton,
  Combobox,
  Text,
  TextInput,
  useCombobox,
  type TextInputProps,
} from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { IoSearchOutline } from 'react-icons/io5';
import {
  mergeMarketSearchParams,
  MARKET_SEARCH_QUERY_KEY,
  MARKET_SUGGEST_MIN_QUERY_LENGTH,
} from '@/app/layout/dashboard/ui/sidebar/ui/market/market.const';
import { getMarketSuggest } from '@/shared/api/services/market';
import s from './search-input.module.css';
import { useQuery } from '@tanstack/react-query';

type SearchFieldProps = Omit<
  TextInputProps,
  | 'leftSection'
  | 'size'
  | 'radius'
  | 'rightSection'
  | 'rightSectionPointerEvents'
> & {
  onClearCommitted?: () => void;
};

const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  function SearchField({ value, onChange, onClearCommitted, ...rest }, ref) {
    const str = typeof value === 'string' ? value : '';
    const showClear = str.length > 0;

    const handleClear = () => {
      onChange?.({
        target: { value: '' },
        currentTarget: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>);
      onClearCommitted?.();
    };

    return (
      <TextInput
        ref={ref}
        size="sm"
        radius="md"
        leftSection={<IoSearchOutline size={18} />}
        rightSection={
          showClear ? (
            <CloseButton
              size="sm"
              radius="xl"
              aria-label="Tozalash"
              iconSize={14}
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleClear}
            />
          ) : null
        }
        rightSectionPointerEvents="auto"
        placeholder="Mahsulot nomi bo'yicha qidirish…"
        aria-label="Mahsulotlarni qidirish"
        value={value}
        onChange={onChange}
        {...rest}
      />
    );
  }
);

export function MarketSearchInput() {
  const [searchParams, setSearchParams] = useSearchParams();
  const committedQ = searchParams.get(MARKET_SEARCH_QUERY_KEY) ?? '';
  const [draft, setDraft] = useState(committedQ);

  useEffect(() => {
    setDraft(committedQ);
  }, [committedQ]);

  const draftTrim = draft.trim();
  const hasDraft = draftTrim.length >= 0;
  const canFetchSuggest = draftTrim.length >= MARKET_SUGGEST_MIN_QUERY_LENGTH;
  const suggestParams = useMemo(() => ({ q: draftTrim }), [draftTrim]);

  const { data: suggestPage } = useQuery({
    queryKey: ['market', 'suggest', suggestParams],
    queryFn: () => getMarketSuggest(suggestParams),
    enabled: canFetchSuggest,
    staleTime: 0,
    gcTime: 60_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const suggestions = suggestPage ?? [];

  const commitSearchToUrl = (next: string, fromEnter: boolean) => {
    const t = next.trim();
    setSearchParams(
      (prev) =>
        mergeMarketSearchParams(new URLSearchParams(prev), next, {
          searchChipFromEnter: fromEnter && t.length > 0,
        }),
      { replace: true }
    );
    setDraft(t);
  };

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const handleSelect = (name: string) => {
    commitSearchToUrl(name, false);
    combobox.closeDropdown();
  };

  return (
    <Box className={s.root} w="100%" maw="100%" style={{ minWidth: 0 }}>
      <Combobox
        store={combobox}
        onOptionSubmit={handleSelect}
        withinPortal
        position="bottom-start"
        offset={6}
      >
        <Combobox.Target>
          <SearchField
            value={draft}
            onChange={(e) => {
              setDraft(e.currentTarget.value);
              combobox.openDropdown();
            }}
            onClearCommitted={() => {
              setSearchParams(
                (prev) =>
                  mergeMarketSearchParams(new URLSearchParams(prev), ''),
                { replace: true }
              );
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                commitSearchToUrl(e.currentTarget.value, true);
                combobox.closeDropdown();
              }
            }}
            onFocus={() => combobox.openDropdown()}
            autoComplete="off"
            style={{ width: '100%' }}
          />
        </Combobox.Target>

        <Combobox.Dropdown className={s.dropdown}>
          <Combobox.Options className={s.dropdownOptions}>
            {hasDraft && !canFetchSuggest ? (
              <Combobox.Empty className={s.dropdownEmpty}>
                Kamida {MARKET_SUGGEST_MIN_QUERY_LENGTH} ta belgi yozing
              </Combobox.Empty>
            ) : canFetchSuggest && suggestions.length === 0 ? (
              <Combobox.Empty className={s.dropdownEmpty}>
                Mos keladigan mahsulot topilmadi
              </Combobox.Empty>
            ) : (
              suggestions.map((item) => (
                <Combobox.Option
                  key={item.name}
                  value={item.name}
                  className={s.dropdownOption}
                >
                  <Text size="sm" fw={600} lh={1.35}>
                    {item.name}
                  </Text>
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </Box>
  );
}
