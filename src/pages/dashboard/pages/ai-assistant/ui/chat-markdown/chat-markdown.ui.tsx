import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import styles from '../../ai-assistant.module.css';

const markdownComponents: Components = {
  a({ href, children, ...props }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  },
};

type Props = {
  content: string;
};

/** Assistant javoblari: Markdown + GFM (jadval, strikethrough, ro‘yxat) + XSS himoyasi */
export function ChatMarkdown({ content }: Props) {
  return (
    <div className={styles.markdownRoot}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
