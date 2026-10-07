# Candor — AI Interview SaaS Frontend (PRD)

## Original problem
Production-quality React frontend for an AI interview SaaS over an EXISTING external backend (not modified). Public landing at "/", app under "/app". Individual + Organization contexts (ADMIN/HR/VIEWER) switchable from avatar menu. No login/signup, no WebRTC (integration boundary only). Use only provided endpoints; no invented fields.

## User choices
- API base URL: env `REACT_APP_API_BASE_URL` (user will set; currently empty -> UI shows "API isn't configured" error states)
- Tenant header: `X-Tenant-ID`
- Field shapes inferred; centralized in `src/api/fieldMap.js`
- Dev session hardcoded in `src/config/devSession.js`
- Dark default + light mode toggle

## Architecture
- `src/api/client.js` axios instance: Bearer token, X-Tenant-ID for `/organization/*` (skipTenant for invitation accept), friendly ApiError, 401 hook (`setUnauthorizedHandler`) for future /refresh
- `src/api/{user,organization,interviews,uploads}.js`, `src/lib/videoUpload.js` (R2 multipart via signed URLs, ETag collection)
- `src/lib/session.js` external store (token, memberships, activeContext); URL-driven contexts `/app/personal/*`, `/app/org/:orgId/*`
- `src/lib/permissions.js` UI-only RBAC; `RequirePermission` gate
- `src/realtime/RealtimeInterviewBoundary.js` placeholder for WebRTC/Realtime
- `src/mocks/landingPreview.js` static landing mock only

## Implemented (Jun 2026)
- Landing page (hero, preview, how it works, features, use cases, pricing, FAQ, footer)
- App shell, sidebar per role, context switcher, theme toggle
- Interviews master-detail (search, status filters, keyboard nav, mobile flow)
- Create interview (org/personal), workspaces list/create, resume upload (5MB, drag-drop), team (invite/change role/remove w/ confirm), accept invitation, dashboards, interview room with session start + recording multipart upload
- Tested: 52/52 frontend assertions with mocked backend (video multipart E2E not exercised)

## Backlog
- P0: Login/logout/refresh integration (wire setSession + setUnauthorizedHandler)
- P0: WebRTC/Realtime in boundary component
- P1: Confirm real backend field names in fieldMap.js
- P2: Memberships from backend instead of devSession
