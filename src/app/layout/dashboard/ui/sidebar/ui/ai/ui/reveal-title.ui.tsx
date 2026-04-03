import { useEffect, useRef, useState } from 'react';
import {
  getNextSidebarTitleVisibleLength,
  SIDEBAR_TITLE_REVEAL_TICK_MS,
} from '../sidebar.const';

export type SidebarRevealTitleProps = {
  text: string;
  className?: string;
  onComplete: () => void;
};

/** Sidebar chat sarlavhasi — qadam bilan paydo bo‘ladi */
export function SidebarRevealTitle({
  text,
  className,
  onComplete,
}: SidebarRevealTitleProps) {
  const [visible, setVisible] = useState('');
  const textRef = useRef(text);
  textRef.current = text;
  const finishedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    finishedRef.current = false;
  }, [text]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const full = textRef.current;
      setVisible((prev) => {
        if (prev.length >= full.length) {
          if (full.length > 0 && !finishedRef.current) {
            finishedRef.current = true;
            queueMicrotask(() => onCompleteRef.current());
          }
          return full;
        }
        const nextLen = getNextSidebarTitleVisibleLength(
          prev.length,
          full.length
        );
        return full.slice(0, nextLen);
      });
    }, SIDEBAR_TITLE_REVEAL_TICK_MS);
    return () => clearInterval(id);
  }, []);

  return <span className={className}>{visible}</span>;
}
