import { forwardRef, useMemo } from 'react';
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
  mergeServicesSearchParams,
  SERVICES_SEARCH_QUERY_KEY,
} from '@/app/layout/dashboard/ui/sidebar/ui/services/services.const';
import { MOCK_SERVICES } from '@/shared/data/services-mock.data';
import { filterServicesSearch } from '@/shared/lib/filter-services-search';
import s from './search-input.module.css';

type SearchFieldProps = Omit<
  TextInputProps,
  | 'leftSection'
  | 'size'
  | 'radius'
  | 'rightSection'
  | 'rightSectionPointerEvents'
>;

const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  function SearchField({ value, onChange, ...rest }, ref) {
    const str = typeof value === 'string' ? value : '';
    const showClear = str.length > 0;

    const handleClear = () => {
      onChange?.({
        target: { value: '' },
        currentTarget: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>);
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
        placeholder="Xizmat nomi bo‘yicha qidirish…"
        aria-label="Xizmatlarni qidirish"
        value={value}
        onChange={onChange}
        {...rest}
      />
    );
  }
);

export function SearchInput() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get(SERVICES_SEARCH_QUERY_KEY) ?? '';

  const setQ = (next: string) => {
    setSearchParams(
      (prev) => mergeServicesSearchParams(new URLSearchParams(prev), next),
      { replace: true }
    );
  };

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const hasQuery = q.trim().length > 0;

  const suggestions = useMemo(() => {
    if (!hasQuery) return MOCK_SERVICES.slice(0, 8);
    return filterServicesSearch(MOCK_SERVICES, q);
  }, [hasQuery, q]);

  const handleSelect = (id: string) => {
    const item = MOCK_SERVICES.find((x) => x.id === id);
    if (item) setQ(item.title);
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
            value={q}
            onChange={(e) => {
              setQ(e.currentTarget.value);
              combobox.openDropdown();
            }}
            onFocus={() => combobox.openDropdown()}
            autoComplete="off"
            style={{ width: '100%' }}
          />
        </Combobox.Target>

        <Combobox.Dropdown className={s.dropdown}>
          <Combobox.Options className={s.dropdownOptions}>
            {hasQuery && suggestions.length === 0 ? (
              <Combobox.Empty className={s.dropdownEmpty}>
                Mos keladigan xizmat topilmadi
              </Combobox.Empty>
            ) : (
              suggestions.map((item) => (
                <Combobox.Option
                  key={item.id}
                  value={item.id}
                  className={s.dropdownOption}
                >
                  <Text size="sm" fw={600} lh={1.35}>
                    {item.title}
                  </Text>
                  <Text size="xs" c="dimmed" lineClamp={2} mt={4}>
                    {item.description}
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
