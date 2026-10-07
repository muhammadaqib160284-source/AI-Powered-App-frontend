import { uploadsApi } from "@/api/uploads";
import { ApiError } from "@/api/errors";
import {
  normalizeSignedUrls,
  normalizeUploadStart,
  toSignUrlPayload,
  toUploadCompletePayload,
  toUploadStartPayload,
} from "@/api/fieldMap";

export const DEFAULT_PART_SIZE = 10 * 1024 * 1024; // R2 requires >= 5 MiB for all parts except the last

// Uploads one part straight to R2 (no auth headers, never through our backend).
function putPart(url, blob, { onLoaded, signal }) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.upload.onprogress = (e) => onLoaded(e.loaded);
    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        return reject(new ApiError({ kind: "storage", status: xhr.status, message: "A video part failed to upload." }));
      }
      const etag = xhr.getResponseHeader("ETag");
      if (!etag) return reject(new ApiError({ kind: "storage", message: "Upload storage did not return an ETag (check R2 CORS ExposeHeaders)." }));
      onLoaded(blob.size);
      resolve(etag);
    };
    xhr.onerror = () => reject(new ApiError({ kind: "network", message: "Network error while uploading video." }));
    xhr.onabort = () => reject(new ApiError({ kind: "canceled", message: "Upload canceled." }));
    signal?.addEventListener("abort", () => xhr.abort(), { once: true });
    xhr.send(blob);
  });
}

async function runPool(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  const lanes = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await worker(items[i]);
    }
  });
  await Promise.all(lanes);
  return results;
}

export async function uploadVideoMultipart(file, { partSize = DEFAULT_PART_SIZE, concurrency = 3, onProgress, onStage, signal } = {}) {
  onStage?.("starting");
  const { uploadId, key } = normalizeUploadStart(await uploadsApi.start(toUploadStartPayload({ file })));
  if (!uploadId) throw new ApiError({ kind: "http", message: "The upload could not be started." });

  const partCount = Math.max(1, Math.ceil(file.size / partSize));
  const partNumbers = Array.from({ length: partCount }, (_, i) => i + 1);

  onStage?.("signing");
  const signed = normalizeSignedUrls(await uploadsApi.signUrls(toSignUrlPayload({ uploadId, key, partNumbers })));
  const urlFor = (n) => signed.find((s) => s.partNumber === n)?.url;

  onStage?.("uploading");
  const loaded = new Array(partCount).fill(0);
  const report = () => onProgress?.(Math.min(100, Math.round((loaded.reduce((a, b) => a + b, 0) / file.size) * 100)));

  const parts = await runPool(partNumbers, concurrency, async (n) => {
    const url = urlFor(n);
    if (!url) throw new ApiError({ kind: "http", message: "Missing a signed upload URL." });
    const blob = file.slice((n - 1) * partSize, Math.min(n * partSize, file.size));
    const etag = await putPart(url, blob, { signal, onLoaded: (l) => ((loaded[n - 1] = l), report()) });
    return { PartNumber: n, ETag: etag };
  });

  onStage?.("completing");
  await uploadsApi.complete(toUploadCompletePayload({ uploadId, key, parts }));
  onStage?.("done");
  return { uploadId, key, parts };
}
