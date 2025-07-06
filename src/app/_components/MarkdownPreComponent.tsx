import { Tooltip } from "@/src/components/Tooltip";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { CheckCheckIcon, ClipboardCopyIcon } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ClassAttributes,
  type FC,
  type HTMLAttributes,
} from "react";
import type { ExtraProps } from "react-markdown";
import "highlight.js/styles/default.css";

export const MarkDownPre: FC<
  ClassAttributes<HTMLPreElement> & HTMLAttributes<HTMLPreElement> & ExtraProps
> = ({ className, ...props }) => {
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
    if (navigator.clipboard) {
      const text = codeRef.current?.innerText ?? "";
      await navigator.clipboard.writeText(text);
      setCopied(true);
      timeoutId = window.setTimeout(() => {
        setCopied(false);
      }, 5000);
    } else {
      console.log("No Navigator access...");
      // temporally simulation
      setCopied(true);
      timeoutId = window.setTimeout(() => {
        setCopied(false);
      }, 5000);
    }
  };

  return (
    <div className="mx-auto max-w-fit relative p-0">
      <pre ref={codeRef} {...props} className={cn("", className)} />
      <Tooltip label="Copy to clipboard" onClick={onCopy}>
        <Button
          size={"icon"}
          className="absolute top-2 right-2 cursor-pointer hljs *:!size-6 hover:scale-110"
          disabled={copied}
        >
          {!copied ? (
            <ClipboardCopyIcon />
          ) : (
            <CheckCheckIcon className="text-green-700" />
          )}
        </Button>
      </Tooltip>
    </div>
  );
};

{
}
