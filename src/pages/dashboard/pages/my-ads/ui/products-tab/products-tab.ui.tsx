import { EmptyState } from '../empty-state';

type ProductsTabProps = {
  onCreate: () => void;
};

function ProductsTab({ onCreate }: ProductsTabProps) {
  return (
    <EmptyState
      title="Sizda hali mahsulot e'lonlari yo‘q"
      description="Mahsulotingizni joylang va xaridorlar uni tezroq topishi uchun e'lon yarating."
      actionLabel="E'lon qo‘shish"
      onAction={onCreate}
    />
  );
}

export default ProductsTab;
