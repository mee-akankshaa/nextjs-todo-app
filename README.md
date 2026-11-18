# Tasks - a fast, accessible to-do app

A small to-do app with priorities, due dates, search and a dark mode, built with Next.js, TypeScript and Tailwind. Everything is saved in your browser, so there is nothing to sign up for.

## Objective

I wanted a to-do app that is simple enough to use in ten seconds but still treats the details properly: keyboard access, no flash of the wrong theme, no lost data on refresh, and logic that is tested. It is also a compact way for me to practise a clean Next.js App Router structure with strict TypeScript.

## Features

- Add, edit, delete and complete tasks
- Priority (Low / Medium / High) and optional due date, with overdue highlighting
- Filter by All / Active / Done, each with a live count
- Search by title
- Clear completed tasks in one click
- Helpful empty states (no tasks, no matches, nothing done yet, all caught up)
- Sorted view: open tasks first, then by priority, then by due date
- Dark / light theme that follows your system and remembers your choice
- Keyboard accessible, labelled form fields, visible focus rings, reduced-motion support
- Data persists in `localStorage`

## Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI | React 18 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 3 |
| State | `useReducer` in a custom hook |
| Persistence | Browser `localStorage` |
| Tests | Vitest |
| Linting | ESLint (`next/core-web-vitals`) |

## Workflow

1. **Planning.** I listed the features, decided there would be no backend, and settled on a single page with a clear split between UI and logic.
2. **Data model.** I defined `Todo`, `Priority` and `Filter` in `lib/types.ts` first. Due dates are plain `YYYY-MM-DD` strings rather than `Date` objects.
3. **State.** All changes go through a pure reducer (`lib/todoReducer.ts`). Filtering, sorting and counting live in separate pure selectors, so none of it depends on React.
4. **Hook.** `hooks/useTodos.ts` wires the reducer, filter, search and persistence together and exposes a small API to the components.
5. **Components.** `TodoApp` composes `TodoForm`, `TodoToolbar`, `TodoList`, `TodoItem` and `ThemeToggle`. Each is small and takes plain props.
6. **Persistence.** Loading and saving live in `lib/storage.ts`, with validation of whatever comes out of storage.
7. **Testing.** Vitest unit tests cover the reducer, selectors, storage parsing and date helpers.
8. **Checks and deploy.** `tsc --noEmit`, `next lint`, `vitest` and `next build` all pass. The build is fully static, so it can be hosted on any static-friendly platform (Vercel, Netlify, GitHub Pages with an export).

## How to run locally

```bash
git clone <your-fork-or-repo-url>
cd nextjs-todo-app
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm test           # unit tests
npm run typecheck  # tsc --noEmit
npm run lint
npm run build && npm start
```

## Project structure

```
app/            layout, page, global styles
components/     TodoApp, TodoForm, TodoToolbar, TodoList, TodoItem, ThemeToggle
hooks/          useTodos (state + persistence), useTheme
lib/            types, reducer, selectors, storage, date helpers, tests
```

## Challenges I faced and how I solved them

These are the problems I designed around while building. None of them showed up as a failing build, but each one is an easy bug to ship.

1. **Hydration mismatch with localStorage.** The server cannot read `localStorage`, so rendering saved todos on the first client render would not match the server HTML. I start with an empty list, load saved data in an effect, and only render the list once a `hydrated` flag is set.
2. **Saved data being wiped on load.** If the "save on change" effect runs before the load, the empty initial state overwrites what was stored. The save effect only runs after hydration.
3. **Theme flash.** Reading the theme in React would show the light theme briefly before switching. A tiny inline script in `layout.tsx` sets the `dark` class before first paint, and `suppressHydrationWarning` on `<html>` covers the intentional difference.
4. **Date handling.** `new Date("2026-01-05")` is parsed as UTC and can show the previous day in some time zones, and `toISOString()` has the same problem for "today". I keep dates as `YYYY-MM-DD` strings, build "today" from local date parts, and format by splitting the string.
5. **Accessibility of a custom list UI.** I used real checkboxes tied to labels, `aria-pressed` on filter and theme buttons, button labels that include the task title ("Delete Pay rent"), a live region for counts, and Escape to cancel editing. Text colours were chosen to keep contrast readable in both themes.
6. **Untrusted stored data.** Anything in `localStorage` can be edited or corrupted. `parseTodos` catches JSON errors and drops entries that do not match the `Todo` shape instead of crashing the app.

## What I'd improve next

- Drag-and-drop reordering
- Undo after delete
- Sync across devices with an optional backend
- Tags or projects, and recurring tasks
- End-to-end tests with Playwright
- Export / import of tasks as JSON

## Call to action

If this is useful, please try it, star the repo and tell me what you think. Issues and pull requests are welcome. You can reach me at [mee.akankshaa@gmail.com](mailto:mee.akankshaa@gmail.com).

## A note on how this was built

I built this with AI-assisted development (Claude Code). I reviewed the code and the checks myself, and the logic is covered by unit tests, but it is still a small project, so please report anything that looks off.

## Author and license

Author: Akanksha Dubey. Released under the [MIT License](LICENSE).
