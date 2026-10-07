import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CopyButton({ value, label = "Copy", testId = "copy-button", size = "sm", variant = "outline" }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy. Please copy it manually.");
    }
  };
  return (
    <Button type="button" variant={variant} size={size} onClick={copy} data-testid={testId}>
      {copied ? <Check /> : <Copy />} {label}
    </Button>
  );
}
