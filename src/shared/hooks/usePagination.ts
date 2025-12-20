import { useState } from 'react';

export default function usePagination(arg?: {
  initLimit?: number;
  initOffset?: number;
}) {
  const [offset, setOffset] = useState(arg?.initOffset ?? 0);
  const [limit, setLimit] = useState(arg?.initLimit ?? 10);

  const onSetOffset = (offset: number) => {
    setOffset(offset);
  };

  const onSetLimit = (limit: number) => {
    setLimit(limit);
  };

  return {
    offset,
    limit,
    onSetLimit,
    onSetOffset,
  };
}
