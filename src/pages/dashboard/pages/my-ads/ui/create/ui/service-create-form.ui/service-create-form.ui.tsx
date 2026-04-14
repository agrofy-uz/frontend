import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Image,
  Input,
  Loader,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { MdAddPhotoAlternate, MdDeleteOutline } from 'react-icons/md';
import { PhoneInput } from '@/shared/ui/phone-input';
import {
  getDistricts,
  getRegions,
  getServicesCategories,
} from '@/shared/api/services/services';
import { openNotification } from '@/shared/lib/notification';

const MAX_IMAGES = 3;

type ServiceCreateFormProps = {
  onCancel: () => void;
};

export function ServiceCreateForm({ onCancel }: ServiceCreateFormProps) {
  const [regionId, setRegionId] = useState<string | null>(null);
  const [districtId, setDistrictId] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [priceFrom, setPriceFrom] = useState<string | number>('');
  const [priceUntil, setPriceUntil] = useState<string | number>('');
  const [description, setDescription] = useState('');
  const [telegram, setTelegram] = useState('');
  const [instagram, setInstagram] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputs = useRef<Array<HTMLInputElement | null>>([]);

  const { data: categories } = useQuery({
    queryKey: ['services', 'categories'],
    queryFn: getServicesCategories,
  });

  const { data: regions } = useQuery({
    queryKey: ['regions'],
    queryFn: getRegions,
  });

  const { data: districts, isLoading: districtsLoading } = useQuery({
    queryKey: ['districts', regionId],
    queryFn: () => getDistricts(regionId ?? ''),
    enabled: Boolean(regionId),
  });

  useEffect(() => {
    setDistrictId(null);
  }, [regionId]);

  const categoryOptions = useMemo(
    () =>
      (categories ?? []).map((item) => ({ value: item.id, label: item.name })),
    [categories]
  );

  const regionOptions = useMemo(
    () => (regions ?? []).map((item) => ({ value: item.id, label: item.name })),
    [regions]
  );

  const districtOptions = useMemo(
    () =>
      (districts ?? []).map((item) => ({ value: item.id, label: item.name })),
    [districts]
  );

  const previews = useMemo(
    () =>
      images.map((file) => ({
        key: `${file.name}-${file.lastModified}`,
        url: URL.createObjectURL(file),
      })),
    [images]
  );

  useEffect(() => {
    return () => {
      previews.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previews]);

  const setImageAt = (slotIndex: number, file: File | null) => {
    setImages((prev) => {
      const next = [...prev];
      if (file) {
        next[slotIndex] = file;
      } else {
        delete next[slotIndex];
      }
      return next.filter(Boolean) as File[];
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const nextErrors: Record<string, string> = {};
    if (!categoryId) nextErrors.categoryId = 'Xizmat turi majburiy';
    if (!title.trim()) nextErrors.title = 'Xizmat nomi majburiy';
    if (!regionId) nextErrors.regionId = 'Viloyat majburiy';
    if (!districtId) nextErrors.districtId = 'Tuman majburiy';
    if (!phone.trim()) nextErrors.phone = 'Telefon raqam majburiy';
    if (Number(priceFrom) <= 0)
      nextErrors.priceFrom = "Boshlang'ich narx majburiy";
    if (Number(priceUntil) <= 0) nextErrors.priceUntil = 'Oxirgi narx majburiy';
    if (!description.trim()) nextErrors.description = 'Qisqacha majburiy';
    if (images.length < 1) nextErrors.images = 'Kamida 1 ta rasm yuklang';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    openNotification({
      title: "Xizmat e'loni saqlashga tayyor",
      type: 'success',
      icon: <MdAddPhotoAlternate size={20} />,
    });
  };

  return (
    <Stack gap="sm">
      <Select
        label="Xizmat turi"
        placeholder="Xizmat turini tanlang"
        data={categoryOptions}
        searchable
        nothingFoundMessage="Topilmadi"
        value={categoryId}
        onChange={setCategoryId}
        required
        error={errors.categoryId}
      />

      <TextInput
        label="Xizmat nomi"
        placeholder="Masalan, Traktor haydash xizmati"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        required
        error={errors.title}
      />

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
        <Select
          label="Viloyat"
          placeholder="Viloyatni tanlang"
          data={regionOptions}
          searchable
          nothingFoundMessage="Topilmadi"
          value={regionId}
          onChange={setRegionId}
          required
          error={errors.regionId}
        />
        <Select
          label="Tuman"
          placeholder={regionId ? 'Tumanni tanlang' : 'Avval viloyatni tanlang'}
          data={districtOptions}
          searchable
          nothingFoundMessage="Topilmadi"
          value={districtId}
          onChange={setDistrictId}
          disabled={!regionId}
          rightSection={districtsLoading ? <Loader size="sm" /> : null}
          required
          error={errors.districtId}
        />
      </SimpleGrid>

      <PhoneInput
        label="Telefon raqam"
        placeholder="+998 (__) ___-__-__"
        value={phone}
        onChange={setPhone}
        required
        error={errors.phone}
      />

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
        <NumberInput
          label="Boshlang'ich narx"
          placeholder="Masalan, 200000"
          min={0}
          thousandSeparator=" "
          allowDecimal={false}
          value={priceFrom}
          onChange={setPriceFrom}
          required
          error={errors.priceFrom}
        />
        <NumberInput
          label="Oxirgi narx"
          placeholder="Masalan, 500000"
          min={0}
          thousandSeparator=" "
          allowDecimal={false}
          value={priceUntil}
          onChange={setPriceUntil}
          required
          error={errors.priceUntil}
        />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
        <TextInput
          label="Telegram (ixtiyoriy)"
          placeholder="@username"
          value={telegram}
          onChange={(e) => setTelegram(e.currentTarget.value)}
        />
        <TextInput
          label="Instagram (ixtiyoriy)"
          placeholder="@instagram"
          value={instagram}
          onChange={(e) => setInstagram(e.currentTarget.value)}
        />
      </SimpleGrid>

      <Textarea
        label="Qisqacha"
        placeholder="Xizmat haqida qisqacha ma'lumot yozing..."
        minRows={3}
        maxRows={6}
        autosize
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
        required
        error={errors.description}
      />

      <Input.Wrapper
        label="Rasmlar"
        description="Min 1 ta, max 3 ta rasm"
        required
        error={errors.images}
      >
        <SimpleGrid cols={3} spacing="sm">
          {Array.from({ length: MAX_IMAGES }, (_, index) => {
            const preview = previews[index];
            return (
              <Box
                key={`slot-${index}`}
                pos="relative"
                h={110}
                style={{
                  borderRadius: 10,
                  border:
                    '1px dashed light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-3))',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background:
                    'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))',
                }}
                onClick={() => fileInputs.current[index]?.click()}
              >
                {preview ? (
                  <>
                    <Image src={preview.url} h={110} fit="cover" />
                    <ActionIcon
                      color="red"
                      variant="filled"
                      radius="xl"
                      size="sm"
                      pos="absolute"
                      top={6}
                      right={6}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(index);
                      }}
                      aria-label="Rasmni o‘chirish"
                    >
                      <MdDeleteOutline size={14} />
                    </ActionIcon>
                  </>
                ) : (
                  <Stack h="100%" justify="center" align="center" gap={4}>
                    <MdAddPhotoAlternate size={22} />
                    <Text size="xs" c="dimmed">
                      Rasm {index + 1}
                    </Text>
                  </Stack>
                )}

                <input
                  ref={(el) => {
                    fileInputs.current[index] = el;
                  }}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.currentTarget.files?.[0] ?? null;
                    setImageAt(index, file);
                  }}
                />
              </Box>
            );
          })}
        </SimpleGrid>
      </Input.Wrapper>

      <Group justify="flex-end" mt="sm" gap="xs">
        <Button variant="default" onClick={onCancel}>
          Bekor qilish
        </Button>
        <Button color="green" onClick={handleSave}>
          Saqlash
        </Button>
      </Group>
    </Stack>
  );
}
