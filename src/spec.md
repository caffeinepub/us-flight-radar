# Specification

## Summary
**Goal:** Provide an interactive, radar-console-themed US flight radar map that displays aircraft positions/tracks from a configurable data endpoint, with aircraft category details and filters.

**Planned changes:**
- Build a map-focused dashboard showing aircraft markers and track lines over the continental United States with pan/zoom and a radar-style overlay.
- Add map presets to jump between a full-US view and a Schenectady↔Albany (NY) corridor view.
- Implement configurable aircraft data ingestion via a REST endpoint, with endpoint URL and optional API key stored/managed in the Motoko backend and used by the frontend.
- Add marker selection to open an aircraft details view that includes category (General Aviation, Military, Commercial) and clear selection highlighting.
- Add category filter controls (toggle General Aviation/Military/Commercial) with an empty-state message when none are enabled.
- Apply a consistent “radar console” visual theme across the UI (avoid blue/purple as primary colors) and use generated static radar assets from the frontend’s public assets.

**User-visible outcome:** Users can pan/zoom a US flight radar map, jump to a Schenectady–Albany preset, see aircraft positions/tracks that refresh periodically, tap aircraft to view category details, and filter visible aircraft by category within a radar-console themed interface.
