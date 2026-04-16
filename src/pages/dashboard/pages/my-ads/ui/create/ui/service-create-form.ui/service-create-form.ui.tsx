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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  MdAddPhotoAlternate,
  MdCheckCircle,
  MdDeleteOutline,
} from 'react-icons/md';
import { PhoneInput } from '@/shared/ui/phone-input';
import { createMyService } from '@/shared/api/services/my-ads';
import {
  getDistricts,
  getRegions,
  getServicesCategories,
} from '@/shared/api/services/services';
import { openNotification } from '@/shared/lib/notification';
import { useAuthStore } from '@/shared/store/authStore';
import {
  buildCreateServiceFormData,
  MAX_IMAGES,
  renderCategoryIcon,
  type CategoryOption,
  validateServiceCreateDraft,
} from './service-create-form.const';
type ServiceCreateFormProps = {
  onCancel: () => void;
};

export function ServiceCreateForm({ onCancel }: ServiceCreateFormProps) {
  const queryClient = useQueryClient();
  const userPremium = useAuthStore((state) => Boolean(state.user?.premium));
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
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
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
      (categories ?? []).map((item) => ({
        value: item.id,
        label: item.name,
        icon: item.icon,
      })),
    [categories]
  );
  const selectedCategory = useMemo(
    () => categoryOptions.find((item) => item.value === categoryId) ?? null,
    [categoryId, categoryOptions]
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

  const createMutation = useMutation({
    mutationFn: createMyService,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['my-services'] });
      await queryClient.invalidateQueries({ queryKey: ['services', 'regular'] });
      await queryClient.invalidateQueries({ queryKey: ['services', 'premium'] });
      openNotification({
        title: "Xizmat e'loni yaratildi",
        type: 'success',
        icon: <MdCheckCircle size={20} />,
      });
      onCancel();
    },
    onError: () => {
      openNotification({
        title: "Xizmat e'lonini yaratishda xatolik yuz berdi",
        type: 'error',
        icon: <MdDeleteOutline size={20} />,
      });
    },
  });

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

  const getImageFromTransfer = async (
    transfer: DataTransfer
  ): Promise<File | null> => {
    const droppedFile = Array.from(transfer.files).find((file) =>
      file.type.startsWith('image/')
    );
    if (droppedFile) return droppedFile;

    const url =
      transfer.getData('text/uri-list') || transfer.getData('text/plain');
    if (!url || !/^https?:\/\//i.test(url)) return null;

    try {
      const response = await fetch(url);
      if (!response.ok) return null;
      const blob = await response.blob();
      if (!blob.type.startsWith('image/')) return null;
      const ext = blob.type.split('/')[1] || 'jpg';
      return new File([blob], `dropped-image.${ext}`, { type: blob.type });
    } catch {
      return null;
    }
  };

  const handleDropAt = async (slotIndex: number, transfer: DataTransfer) => {
    const file = await getImageFromTransfer(transfer);
    if (!file) {
      openNotification({
        title: "Rasmni o'qib bo'lmadi",
        type: 'error',
        icon: <MdDeleteOutline size={20} />,
      });
      return;
    }
    setImageAt(slotIndex, file);
    setErrors((prev) => {
      if (!prev.images) return prev;
      const next = { ...prev };
      delete next.images;
      return next;
    });
  };

  const handleSave = () => {
    const nextErrors = validateServiceCreateDraft({
      categoryId,
      title,
      regionId,
      districtId,
      phone,
      priceFrom,
      priceUntil,
      description,
      telegram,
      instagram,
      images,
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const formData = buildCreateServiceFormData(
      {
        categoryId,
        title,
        regionId,
        districtId,
        phone,
        priceFrom,
        priceUntil,
        description,
        telegram,
        instagram,
        premium: userPremium,
        images,
      }
    );
    createMutation.mutate(formData);
  };

  return (
    <Stack gap="sm">
      <Select
        label="Xizmat turi"
        placeholder="Xizmat turini tanlang"
        data={categoryOptions}
        leftSection={renderCategoryIcon(selectedCategory?.icon)}
        withCheckIcon={false}
        renderOption={({ option, checked }) => {
          const typedOption = option as unknown as CategoryOption;
          return (
            <Group gap="xs" wrap="nowrap">
              {renderCategoryIcon(typedOption.icon)}
              <Text
                size="sm"
                c={checked ? 'green.7' : undefined}
                fw={checked ? 600 : 400}
              >
                {typedOption.label}
              </Text>
            </Group>
          );
        }}
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
          label="Telegram"
          placeholder="Masalan, @username"
          value={telegram}
          onChange={(e) => setTelegram(e.currentTarget.value)}
        />
        <TextInput
          label="Instagram"
          placeholder="Masalan, @username"
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
                    dragOverIndex === index
                      ? '1px dashed var(--mantine-color-green-6)'
                      : '1px dashed light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-3))',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background:
                    'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))',
                }}
                onClick={() => fileInputs.current[index]?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'copy';
                  setDragOverIndex(index);
                }}
                onDragLeave={() => {
                  setDragOverIndex((prev) => (prev === index ? null : prev));
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOverIndex(null);
                  void handleDropAt(index, e.dataTransfer);
                }}
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
        <Button
          variant="default"
          onClick={onCancel}
          disabled={createMutation.isPending}
        >
          Bekor qilish
        </Button>
        <Button
          color="green"
          onClick={handleSave}
          loading={createMutation.isPending}
        >
          Saqlash
        </Button>
      </Group>
    </Stack>
  );
}
