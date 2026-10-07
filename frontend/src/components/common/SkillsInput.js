import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SkillsInput({ value = [], onChange, invalid, id, max = 20 }) {
  const [draft, setDraft] = useState("");

  const add = (raw) => {
    const next = raw.split(",").map((s) => s.trim()).filter(Boolean);
    const merged = [...value];
    next.forEach((s) => {
      if (merged.length < max && !merged.some((m) => m.toLowerCase() === s.toLowerCase())) merged.push(s);
    });
    onChange(merged);
    setDraft("");
  };

  const onKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && draft.trim()) {
      e.preventDefault();
      add(draft);
    } else if (e.key === "Enter") {
      e.preventDefault();
    } else if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div
      className={cn(
        "flex min-h-10 flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-2 py-1.5 focus-within:ring-1 focus-within:ring-ring",
        invalid && "border-destructive",
      )}
    >
      {value.map((skill) => (
        <span key={skill} className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-xs font-medium" data-testid="skill-chip">
          {skill}
          <button type="button" aria-label={`Remove ${skill}`} onClick={() => onChange(value.filter((s) => s !== skill))} className="text-muted-foreground hover:text-foreground">
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => draft.trim() && add(draft)}
        placeholder={value.length ? "Add another…" : "e.g. React, System design, SQL"}
        className="min-w-[140px] flex-1 bg-transparent px-1 py-0.5 text-sm outline-none placeholder:text-muted-foreground"
        data-testid="skills-input"
        aria-invalid={invalid || undefined}
      />
    </div>
  );
}
