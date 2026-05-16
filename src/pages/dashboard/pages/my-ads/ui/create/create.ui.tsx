import { CreateForm } from './ui/create-form.ui';
import { Modal } from '@/shared/ui/modal';
import type { MyProductDto, MyServiceDto } from '@/shared/api/services/my-ads';

export type MyAdsEditDraft = {
  kind: 'services' | 'products';
  item: MyServiceDto | MyProductDto;
};

type CreateProps = {
  opened: boolean;
  onClose: () => void;
  initialType: 'services' | 'products';
  editDraft: MyAdsEditDraft | null;
};

function Create({ opened, onClose, initialType, editDraft }: CreateProps) {
  const isEditingListing = Boolean(editDraft);
  const listingKind = editDraft?.kind ?? initialType;

  const title = isEditingListing
    ? "E'lonni tahrirlash"
    : listingKind === 'services'
      ? 'Xizmat yaratish'
      : 'Mahsulot yaratish';

  return (
    <Modal opened={opened} onClose={onClose} title={title} radius="md">
      <CreateForm
        opened={opened}
        mode={isEditingListing ? 'edit' : 'create'}
        initialService={editDraft?.item ?? null}
        listingKind={listingKind}
        onCancel={onClose}
      />
    </Modal>
  );
}

export default Create;
