import { Mic, MonitorUp, Timer, Captions, PhoneOff, Plug } from "lucide-react";

/**
 * Realtime integration boundary — implement WebRTC / OpenAI Realtime here.
 * Props:
 *  - scope: "personal" | "organization"
 *  - session: raw response from the interview session endpoint (null until started)
 *  - interview: normalized interview (may be partial for organization links)
 *  - sendMessage(payload): POST /{user|organization}/interview/message via the API client
 *  - uploadRecording(file, opts): multipart R2 upload (lib/videoUpload)
 */
const SLOTS = [
  { icon: Plug, label: "WebRTC connection" },
  { icon: Mic, label: "Microphone & camera controls" },
  { icon: Timer, label: "Interview timer" },
  { icon: Captions, label: "Realtime transcript" },
  { icon: PhoneOff, label: "End interview" },
  { icon: MonitorUp, label: "Recording hand-off" },
];

// eslint-disable-next-line no-unused-vars
export function RealtimeInterviewBoundary({ scope, session, interview, sendMessage, uploadRecording }) {
  return (
    <section className="rounded-lg border bg-card" data-testid="realtime-boundary">
      <div className="relative grid aspect-video place-items-center overflow-hidden rounded-t-lg border-b bg-background">
        <div className="grid-bg absolute inset-0 opacity-60" />
        <div className="relative space-y-2 text-center">
          <span className="mx-auto block h-2 w-2 rounded-full bg-muted-foreground/60" />
          <p className="text-sm font-medium" data-testid="realtime-status">
            {session ? "Session created — realtime layer not connected" : "Waiting for session"}
          </p>
          <p className="font-mono text-[11px] text-muted-foreground">src/realtime/RealtimeInterviewBoundary.js</p>
        </div>
      </div>
      <ul className="grid gap-px bg-border sm:grid-cols-3">
        {SLOTS.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2 bg-card px-4 py-3 text-xs text-muted-foreground">
            <Icon className="h-3.5 w-3.5" /> {label}
          </li>
        ))}
      </ul>
    </section>
  );
}
