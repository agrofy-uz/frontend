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
import {
  createMyProduct,
  createMyService,
  updateMyProduct,
  updateMyService,
} from '@/shared/api/services/my-ads';
import type { MyProductDto, MyServiceDto } from '@/shared/api/services/my-ads';
import {
  getMarketById,
  getMarketCategories,
  type MarketDetailDto,
} from '@/shared/api/services/market';
import {
  getDistricts,
  getRegions,
  getServiceById,
  getServicesCategories,
} from '@/shared/api/services/services';
import type { ServiceDetailDto } from '@/shared/api/services/services';
import { openNotification } from '@/shared/lib/notification';
import { useAuthStore } from '@/shared/store/authStore';
import {
  buildListingFormData,
  createEmptyImageSlots,
  imageSlotsFromRemoteUrls,
  MAX_IMAGES,
  renderCategoryIcon,
  type CategoryOption,
  validateServiceCreateDraft,
  type ListingCreateKind,
} from './service-create-form.const';
import { CreateFormSkeleton } from './ui';

function mergeMyServiceWithServiceDetail(
  list: MyServiceDto,
  detail: ServiceDetailDto
): MyServiceDto {
  return {
    ...list,
    id: detail.id,
    title: detail.title,
    description: detail.description,
    regions: detail.regions,
    districts: detail.districts,
    priceFrom: detail.priceFrom,
    priceUntil: detail.priceUntil,
    images: detail.images.length > 0 ? detail.images : list.images,
    phone: detail.phone,
    premium: detail.premium,
    telegram: detail.telegram,
    instagram: detail.instagram,
    category: detail.category,
  };
}

function mergeMyProductWithMarketDetail(
  list: MyProductDto,
  detail: MarketDetailDto
): MyProductDto {
  return {
    ...list,
    id: detail.id,
    title: detail.title,
    description: detail.description,
    regions: detail.regions,
    districts: detail.districts,
    price: detail.price,
    images: detail.images.length > 0 ? detail.images : list.images,
    phone: detail.phone,
    premium: detail.premium,
    telegram: detail.telegram,
    instagram: detail.instagram,
    category: detail.category,
  };
}

type ServiceCreateFormProps = {
  onCancel: () => void;
  opened: boolean;
  mode?: 'create' | 'edit';
  initialService?: MyServiceDto | MyProductDto | null;
  /** Xizmatlar (`my-services` / `services`) yoki mahsulotlar (`my-products` / `market`) */
  listingKind: ListingCreateKind;
};

export function CreateForm({
  onCancel,
  opened,
  mode = 'create',
  initialService = null,
  listingKind,
}: ServiceCreateFormProps) {
  const queryClient = useQueryClient();
  const userPremium = useAuthStore((state) => Boolean(state.user?.premium));
  const [regionId, setRegionId] = useState<string | null>(null);
  const [districtId, setDistrictId] = useState<string | null>(null);
  const [imageSlots, setImageSlots] = useState(createEmptyImageSlots);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [priceFrom, setPriceFrom] = useState<string | number>('');
  const [priceUntil, setPriceUntil] = useState<string | number>('');
  const [listingPrice, setListingPrice] = useState<string | number>('');
  const [description, setDescription] = useState('');
  const [telegram, setTelegram] = useState('');
  const [instagram, setInstagram] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const fileInputs = useRef<Array<HTMLInputElement | null>>([]);
  /** true bo‘lsa, viloyat/tumanni avto-to‘ldirishdan voz kechamiz (foydalanuvchi o‘zgartirdi) */
  const locationTouchedRef = useRef(false);

  const { data: categories } = useQuery({
    queryKey: ['my-ads', 'listing-categories', listingKind],
    queryFn:
      listingKind === 'products' ? getMarketCategories : getServicesCategories,
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

  const listingDetailQuery = useQuery({
    queryKey:
      listingKind === 'products'
        ? ['market-detail', initialService?.id]
        : ['service-detail', initialService?.id],
    queryFn: (): Promise<MarketDetailDto | ServiceDetailDto | null> =>
      listingKind === 'products'
        ? getMarketById(initialService!.id)
        : getServiceById(initialService!.id),
    enabled: opened && mode === 'edit' && Boolean(initialService?.id?.trim()),
  });

  const editSeed = useMemo((): MyServiceDto | MyProductDto | null => {
    if (mode !== 'edit' || !initialService) return null;
    if (!listingDetailQuery.isFetched) return null;

    const detail = listingDetailQuery.data;
    if (!detail) return initialService;
    if (listingKind === 'products') {
      return mergeMyProductWithMarketDetail(
        initialService as MyProductDto,
        detail as MarketDetailDto
      );
    }
    return mergeMyServiceWithServiceDetail(
      initialService as MyServiceDto,
      detail as ServiceDetailDto
    );
  }, [
    mode,
    initialService,
    listingKind,
    listingDetailQuery.data,
    listingDetailQuery.isFetched,
  ]);

  useEffect(() => {
    if (opened) locationTouchedRef.current = false;
  }, [opened, initialService?.id]);

  useEffect(() => {
    if (!opened) return;
    if (mode === 'edit' && initialService && !editSeed) {
      setRegionId(null);
      setDistrictId(null);
    }
  }, [opened, mode, initialService?.id, editSeed]);

  useEffect(() => {
    if (!opened) return;
    if (!initialService || mode !== 'edit') {
      setRegionId(null);
      setDistrictId(null);
      setImageSlots(createEmptyImageSlots());
      setCategoryId(null);
      setTitle('');
      setPhone('');
      setPriceFrom('');
      setPriceUntil('');
      setListingPrice('');
      setDescription('');
      setTelegram('');
      setInstagram('');
      setErrors({});
      return;
    }
    if (!editSeed) return;

    const categoryFromDetail =
      editSeed.categoryId ??
      (categories && editSeed.category?.trim()
        ? categories.find((c) => c.name === editSeed.category?.trim())?.id
        : undefined) ??
      null;

    setTitle(editSeed.title ?? '');
    setPhone(editSeed.phone ?? '');
    if (listingKind === 'products' && 'price' in editSeed) {
      setListingPrice(editSeed.price);
      setPriceFrom('');
      setPriceUntil('');
    } else {
      const s = editSeed as MyServiceDto;
      setPriceFrom(s.priceFrom);
      setPriceUntil(s.priceUntil);
      setListingPrice('');
    }
    setDescription(editSeed.description ?? '');
    setTelegram(editSeed.telegram ?? '');
    setInstagram(editSeed.instagram ?? '');
    setCategoryId(categoryFromDetail);
    setImageSlots(imageSlotsFromRemoteUrls(editSeed.images ?? []));
  }, [opened, mode, initialService?.id, editSeed, categories, listingKind]);

  useEffect(() => {
    if (!opened || mode !== 'create') return;
    if (listingKind === 'products') {
      setPriceFrom('');
      setPriceUntil('');
    } else {
      setListingPrice('');
    }
  }, [opened, mode, listingKind]);

  useEffect(() => {
    if (!opened || mode !== 'edit' || !editSeed || !regions?.length) return;
    if (locationTouchedRef.current) return;
    const rId =
      editSeed.regionId ??
      regions.find((r) => r.name === editSeed.regions)?.id ??
      null;
    setRegionId(rId);
  }, [
    opened,
    mode,
    editSeed?.id,
    editSeed?.regionId,
    editSeed?.regions,
    regions,
  ]);

  useEffect(() => {
    if (!opened || mode !== 'edit' || !editSeed || !regionId) return;
    if (locationTouchedRef.current) return;
    if (!districts?.length) return;
    const dId =
      editSeed.districtId ??
      districts.find((d) => d.name === editSeed.districts)?.id ??
      null;
    setDistrictId(dId);
  }, [
    opened,
    mode,
    editSeed?.id,
    editSeed?.districtId,
    editSeed?.districts,
    districts,
    regionId,
  ]);

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
      imageSlots.map((slot) => {
        if (slot.file) {
          return {
            url: URL.createObjectURL(slot.file),
            revoke: true as const,
          };
        }
        if (slot.remoteUrl) {
          return { url: slot.remoteUrl, revoke: false as const };
        }
        return null;
      }),
    [imageSlots]
  );

  const saveMutation = useMutation({
    mutationFn: async (payload: { formData: FormData; listingId?: string }) => {
      const isProduct = listingKind === 'products';
      if (payload.listingId) {
        if (isProduct) {
          await updateMyProduct(payload.listingId, payload.formData);
        } else {
          await updateMyService(payload.listingId, payload.formData);
        }
      } else if (isProduct) {
        await createMyProduct(payload.formData);
      } else {
        await createMyService(payload.formData);
      }
    },
    onSuccess: async (_data, variables) => {
      const isProduct = listingKind === 'products';
      if (isProduct) {
        await queryClient.invalidateQueries({ queryKey: ['my-products'] });
        await queryClient.invalidateQueries({ queryKey: ['market'] });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['my-services'] });
        await queryClient.invalidateQueries({
          queryKey: ['services', 'regular'],
        });
        await queryClient.invalidateQueries({
          queryKey: ['services', 'premium'],
        });
      }
      if (variables.listingId) {
        await queryClient.invalidateQueries({
          queryKey: isProduct
            ? ['market-detail', variables.listingId]
            : ['service-detail', variables.listingId],
        });
      }
      const isEdit = Boolean(variables.listingId);
      const createdTitle = isProduct
        ? "Mahsulot e'loni yaratildi"
        : "Xizmat e'loni yaratildi";
      openNotification({
        title: isEdit ? "E'lon yangilandi" : createdTitle,
        type: 'success',
        icon: <MdCheckCircle size={20} />,
      });
      onCancel();
    },
    onError: (_err, variables) => {
      const isEdit = Boolean(variables?.listingId);
      const failCreate =
        listingKind === 'products'
          ? "Mahsulot e'lonini yaratishda xatolik yuz berdi"
          : "Xizmat e'lonini yaratishda xatolik yuz berdi";
      openNotification({
        title: isEdit ? "E'lonni yangilashda xatolik yuz berdi" : failCreate,
        type: 'error',
        icon: <MdDeleteOutline size={20} />,
      });
    },
  });

  useEffect(() => {
    return () => {
      previews.forEach((item) => {
        if (item?.revoke) URL.revokeObjectURL(item.url);
      });
    };
  }, [previews]);

  const setImageAt = (slotIndex: number, file: File | null) => {
    setImageSlots((prev) => {
      const next = [...prev];
      if (file) {
        next[slotIndex] = { file };
      } else {
        next[slotIndex] = {};
      }
      return next;
    });
  };

  const handleRemoveImage = (index: number) => {
    setImageSlots((prev) => {
      const next = [...prev];
      next[index] = {};
      return next;
    });
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
    const nextErrors = validateServiceCreateDraft(
      {
        categoryId,
        title,
        regionId,
        districtId,
        phone,
        priceFrom,
        priceUntil,
        listingPrice,
        description,
        telegram,
        instagram,
        imageSlots,
      },
      listingKind
    );
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const formData = buildListingFormData(
      {
        categoryId,
        title,
        regionId,
        districtId,
        phone,
        priceFrom,
        priceUntil,
        listingPrice,
        description,
        telegram,
        instagram,
        premium: mode === 'edit' && editSeed ? editSeed.premium : userPremium,
        imageSlots,
      },
      listingKind
    );
    saveMutation.mutate({
      formData,
      listingId: mode === 'edit' ? initialService?.id : undefined,
    });
  };

  const showEditDetailLoader =
    opened &&
    mode === 'edit' &&
    Boolean(initialService?.id) &&
    !listingDetailQuery.isFetched;

  if (showEditDetailLoader) {
    return <CreateFormSkeleton />;
  }

  const isProduct = listingKind === 'products';

  return (
    <Stack gap="sm">
      <Select
        label={isProduct ? 'Mahsulot turi' : 'Xizmat turi'}
        placeholder={
          isProduct ? 'Mahsulot turini tanlang' : 'Xizmat turini tanlang'
        }
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
        label={isProduct ? 'Mahsulot nomi' : 'Xizmat nomi'}
        placeholder={
          isProduct
            ? 'Masalan, Organik pomidor 20 kg'
            : 'Masalan, Traktor haydash xizmati'
        }
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
          onChange={(value) => {
            locationTouchedRef.current = true;
            setRegionId(value);
            setDistrictId(null);
          }}
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
          onChange={(value) => {
            locationTouchedRef.current = true;
            setDistrictId(value);
          }}
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
        {isProduct ? (
          <NumberInput
            label="Narx"
            placeholder="Masalan, 350000"
            min={0}
            thousandSeparator=" "
            allowDecimal={false}
            value={listingPrice}
            onChange={setListingPrice}
            required
            error={errors.listingPrice}
          />
        ) : (
          <>
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
          </>
        )}
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
        placeholder={
          isProduct
            ? "Mahsulot haqida qisqacha ma'lumot yozing..."
            : "Xizmat haqida qisqacha ma'lumot yozing..."
        }
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
                    <Image src={preview.url} alt="" h={110} fit="cover" />
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
          disabled={saveMutation.isPending}
        >
          Bekor qilish
        </Button>
        <Button
          color="green"
          onClick={handleSave}
          loading={saveMutation.isPending}
        >
          Saqlash
        </Button>
      </Group>
    </Stack>
  );
}

export default CreateForm;
