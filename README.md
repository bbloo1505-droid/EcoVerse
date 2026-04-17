# EcoVerse MVP

Mobile-first environmental discovery platform with:

- live environmental news, opportunities, and event feeds
- personalized browsing experience
- save/apply/mentorship activity persistence via Supabase

## Setup

1. Create a `.env` file based on `.env.example`.
2. Add your Supabase anon key:

```bash
VITE_SUPABASE_ANON_KEY=your_real_anon_key
```

3. Run SQL from `supabase/schema.sql` in Supabase SQL Editor.
4. Start frontend + backend:

```bash
npm run dev:full
```

## Scripts

- `npm run dev` - frontend only
- `npm run dev:api` - backend API only
- `npm run dev:full` - frontend + backend together
- `npm run lint`
- `npm run build`

## Important MVP Note

The initial policy in `supabase/schema.sql` is intentionally open to keep testing fast.  
Before production, replace it with authenticated RLS policies using `auth.uid()`.
