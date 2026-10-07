import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, FileText, Loader2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { InlineError } from "@/components/common/States";
import { userApi } from "@/api/user";
import { resumeResponseFields } from "@/api/fieldMap";
import { formatBytes } from "@/lib/format";
import { cn } from "@/lib/utils";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
};
const EXTENSIONS = Object.values(ACCEPT);

function validate(file) {
  const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
  if (!EXTENSIONS.includes(ext) || (file.type && !ACCEPT[file.type])) return "Upload a PDF, DOC or DOCX file.";
  if (file.size > MAX_BYTES) return `This file is ${formatBytes(file.size)}. The maximum size is 5 MB.`;
  if (file.size === 0) return "This file is empty.";
  return null;
}

export function ResumeDropzone() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: (f) => userApi.uploadResume(f, { onProgress: setProgress }),
    onSuccess: () => toast.success("Resume uploaded"),
  });

  const choose = (f) => {
    if (!f) return;
    mutation.reset();
    setProgress(0);
    const err = validate(f);
    setValidationError(err);
    setFile(err ? null : f);
  };
  const clear = () => { setFile(null); setValidationError(null); mutation.reset(); if (inputRef.current) inputRef.current.value = ""; };
  const onDrop = (e) => { e.preventDefault(); setDragging(false); choose(e.dataTransfer.files?.[0]); };
  const fields = mutation.isSuccess ? resumeResponseFields(mutation.data) : [];

  return (
    <div className="space-y-4">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload resume. Drag and drop or press Enter to choose a file."
        onClick={() => !mutation.isPending && inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), inputRef.current?.click())}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        data-testid="resume-dropzone"
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 py-12 text-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          dragging ? "border-primary bg-primary/5" : "hover:border-foreground/30 hover:bg-accent/30",
          validationError && "border-destructive/50",
        )}
      >
        <span className={cn("grid h-11 w-11 place-items-center rounded-full border bg-card transition-transform", dragging && "scale-110")}>
          <UploadCloud className="h-5 w-5 text-muted-foreground" />
        </span>
        <div>
          <p className="text-sm font-medium">{dragging ? "Drop to select" : "Drag your resume here, or click to browse"}</p>
          <p className="mt-1 text-xs text-muted-foreground">PDF, DOC or DOCX · up to 5 MB</p>
        </div>
        <input ref={inputRef} type="file" className="hidden" accept={[...EXTENSIONS, ...Object.keys(ACCEPT)].join(",")} onChange={(e) => choose(e.target.files?.[0])} data-testid="resume-file-input" />
      </div>

      {validationError && <p role="alert" className="text-sm text-destructive" data-testid="resume-validation-error">{validationError}</p>}

      {file && (
        <div className="rounded-lg border bg-card p-4" data-testid="resume-selected-file">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
            </div>
            {mutation.isSuccess ? <CheckCircle2 className="h-5 w-5 text-success" data-testid="resume-upload-success-icon" />
              : !mutation.isPending && <Button variant="ghost" size="icon" onClick={clear} aria-label="Remove file" data-testid="resume-remove-file-button"><X /></Button>}
          </div>
          {mutation.isPending && <Progress value={progress} className="mt-4 h-1.5" data-testid="resume-upload-progress" />}
          <div className="mt-4 space-y-3">
            <InlineError error={mutation.error} testId="resume-upload-error" />
            {!mutation.isSuccess && (
              <Button onClick={() => mutation.mutate(file)} disabled={mutation.isPending} data-testid="resume-upload-button">
                {mutation.isPending ? <><Loader2 className="animate-spin" /> Uploading {progress}%</> : mutation.isError ? "Retry upload" : "Upload resume"}
              </Button>
            )}
          </div>
        </div>
      )}

      {mutation.isSuccess && (
        <div className="fade-up rounded-lg border border-success/30 p-4" data-testid="resume-upload-success">
          <p className="text-sm font-medium">Resume received</p>
          <p className="mt-1 text-xs text-muted-foreground">It's being processed. You can upload a new version at any time.</p>
          {fields.length > 0 && (
            <dl className="mt-3 grid gap-2 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.key}><dt className="eyebrow">{f.label}</dt><dd className="break-all text-sm">{f.value}</dd></div>
              ))}
            </dl>
          )}
          <Button variant="outline" size="sm" className="mt-4" onClick={clear} data-testid="resume-upload-another-button">Upload a different file</Button>
        </div>
      )}
    </div>
  );
}
