import {
  useEffect,
  useRef,
  useState,
  type ClassAttributes,
  type FC,
  type HTMLAttributes,
} from "react";
import type { ExtraProps } from "react-markdown";

export const MarkDownPre: FC<
  ClassAttributes<HTMLPreElement> & HTMLAttributes<HTMLPreElement> & ExtraProps
> = (props) => {
  const codeRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  let timeoutId: number | undefined;
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const onCopy = async () => {
    const text = codeRef.current?.innerText ?? "";
    if (navigator.clipboard) {
      // console.log({ text });
      await navigator.clipboard.writeText(text);
      setCopied(true);
      timeoutId = window.setTimeout(() => {
        setCopied(false);
      }, 5000);
      // set copied icon
    }
  };

  return (
    <div className="mx-auto max-w-fit relative">
      <pre ref={codeRef} {...props} />
      <button
        className="absolute top-2 right-2 cursor-pointer"
        onClick={onCopy}
        disabled={copied}
      >
        {!copied ? "copy" : "copied"}
        {/* copy icon */}
      </button>
    </div>
  );
};
