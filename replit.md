# Recovery Path

A Next.js 13 app-router application that helps users track habit recovery. Features daily check-ins and an emergency panic page.

## Architecture

- **Framework**: Next.js 13 (App Router)
- **Styling**: Tailwind CSS
- **Storage**: Local `data.json` file (flat-file JSON database)

## Structure

```
app/
  layout.tsx          # Root layout
  page.tsx            # Home page
  globals.css         # Global styles
  checkin/page.tsx    # Daily check-in page
  test/page.tsx       # Addiction dependency test page
  dashboard/page.tsx  # Dashboard page
  panic/page.tsx      # Emergency calm-down page
  api/
    checkin/route.ts  # GET/POST /api/checkin — check-in storage
    code/route.ts     # POST /api/code — user auth (join/login)
data.json             # Flat-file user database
```

## Running

```bash
npm run dev   # Starts on port 5000 at 0.0.0.0
```

## Environment Variables

- `OPENAI_API_KEY` — Required for the AI coach chat feature

## Notes

- All user data is stored in `data.json` at the project root
- Passwords are stored in plain text in data.json (simple app, no production auth)
- The app was migrated from Vercel to Replit; port set to 5000 with 0.0.0.0 binding
