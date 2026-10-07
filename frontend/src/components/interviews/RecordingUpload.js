import { useRef, useState } from "react";
import { Film, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { InlineError } from "@/components/common/States";
import { uploadVideoMultipart } from "@/lib/videoUpload";
import { formatBytes } from "@/lib/format";

const STAGE_LABEL = { starting: "Starting upload…", signing: "Preparing upload…", uploading: "Uploading", completing: "Finalizing…", done: "Uploaded" };

export function RecordingUpload() {
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const [file, setFile] = useState(null);
  const [stage, setStage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const busy = stage && stage !== "done";

  const start = async () => {
    setError(null);
    setProgress(0);
    abortRef.current = new AbortController();
    try {
      await uploadVideoMultipart(file, { onStage: setStage, onProgress: setProgress, signal: abortRef.current.signal });
      toast.success("Recording uploaded");
    } catch (e) {
      setStage(null);
      if (e.kind !== "canceled") setError(e);
    }
  };

  const pick = (f) => {
    if (!f) return;
    if (!f.type.startsWith("video/")) return setError({ message: "Choose a video file." }) || setFile(null);
    setFile(f);
    setStage(null);
    setError(null);
  };

  return (
    <div className="rounded-lg border bg-card p-5" data-testid="recording-upload">
      <p className="text-sm font-semibold">Interview recording</p>
      <p className="mt-1 text-xs text-muted-foreground">Uploaded in parts directly to storage. The video never passes through our servers.</p>
      <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} data-testid="recording-file-input" />
      {file ? (
        <div className="mt-4 flex items-center gap-3 rounded-md border p-3">
          <Film className="h-4 w-4 text-muted-foreground" />
          <div className="min-w-0 flex-1"><p className="truncate text-sm">{file.name}</p><p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p></div>
          {!busy && <Button variant="ghost" size="icon" onClick={() => { setFile(null); setStage(null); }} aria-label="Remove recording"><X /></Button>}
        </div>
      ) : (
        <Button variant="outline" size="sm" className="mt-4" onClick={() => inputRef.current?.click()} data-testid="recording-choose-button">Choose video</Button>
      )}
      {stage && (
        <div className="mt-4 space-y-2" data-testid="recording-upload-status">
          <div className="flex justify-between text-xs"><span>{STAGE_LABEL[stage]}</span>{stage === "uploading" && <span className="font-mono">{progress}%</span>}</div>
          <Progress value={stage === "done" ? 100 : progress} className="h-1.5" />
        </div>
      )}
      <div className="mt-4 space-y-3">
        {error && <InlineError error={error} testId="recording-upload-error" />}
        {file && stage !== "done" && (
          <div className="flex gap-2">
            <Button size="sm" onClick={start} disabled={busy} data-testid="recording-upload-button">
              {busy && <Loader2 className="animate-spin" />} {error ? "Retry upload" : "Upload recording"}
            </Button>
            {busy && <Button size="sm" variant="ghost" onClick={() => abortRef.current?.abort()} data-testid="recording-cancel-button">Cancel</Button>}
          </div>
        )}
      </div>
    </div>
  );
}
