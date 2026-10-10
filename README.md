# AgroKosova

AgroKosova është treg B2B për fermerët dhe bizneset e Kosovës. Fermerët publikojnë prodhime me shumicë; restorantet, marketet dhe hotelet kërkojnë, dërgojnë kërkesa dhe pastaj komunikojnë me WhatsApp ose Viber.

## Stack

- Next.js App Router, TypeScript strict dhe Tailwind CSS
- PostgreSQL në Neon, Prisma ORM 7 dhe `@prisma/adapter-neon`
- Vercel Blob për fotografitë e produkteve
- Zod, bcryptjs, Vitest, ESLint dhe Prettier

Vercel Blob është zgjedhur sepse integrohet drejtpërdrejt me Vercel dhe plani Hobby ofron hapësirë të mjaftueshme për v1 me kufijtë e këtij aplikacioni (maksimumi 3 foto × 5 MB për produkt). Nuk ruhet asnjë skedar në diskun e funksionit serverless.

## Nisja lokale

1. Krijoni një projekt PostgreSQL në [Neon](https://neon.tech) dhe kopjoni dy connection strings.
2. Kopjoni `.env.example` në `.env` dhe plotësoni vlerat.
3. Instaloni paketat: `pnpm install`.
4. Krijoni skemën: `pnpm db:migrate --name init` (migrimi fillestar tashmë ndodhet në `prisma/migrations`).
5. Vendosni `BLOB_READ_WRITE_TOKEN` ose konfiguroni Vercel Blob pasi të lidhni projektin me Vercel.
6. Mbushni vetëm zhvillimin me të dhëna qartësisht fiktive: `pnpm db:seed`.
7. Nisni aplikacionin: `pnpm dev`.

Llogaritë e seed-it janë vetëm për zhvillim: fermeri `044 123 456` dhe biznesi `049 111 222`; PIN-i për të dyja është `123456`.

## Neon dhe Prisma

`DATABASE_URL` është URL-ja **pooled** e Neon (hosti përmban `-pooler`) dhe përdoret në runtime nga Prisma Neon adapter. Kjo është zgjedhja e duhur për funksionet serverless në Vercel.

`DIRECT_URL` është URL-ja **direct/non-pooled** dhe përdoret nga `prisma.config.ts` për komandat Prisma CLI dhe migrime. Mbajini të dyja server-side; mos i ekspozoni kurrë me `NEXT_PUBLIC_` dhe mos i vendosni në Git.

Nëse skema ndryshon lokalisht, krijoni migrim të ri me `pnpm db:migrate --name pershkrimi_i_ndryshimit`. Në production përdorni `pnpm prisma migrate deploy` me `DIRECT_URL` të production-it; mos përdorni `db push`.

## Kontrolli i cilësisë

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

`build` ekzekuton `prisma generate` përpara `next build`, dhe `postinstall` e bën të njëjtën gjë për instalime të reja.

## Deploy në Vercel Hobby

1. Shtyni repository-n në GitHub dhe importojeni projektin në Vercel.
2. Krijoni ose lidhni një Blob store nga Vercel Storage dhe kopjoni `BLOB_READ_WRITE_TOKEN`.
3. Te **Project Settings → Environment Variables**, shtoni `DATABASE_URL`, `DIRECT_URL`, `APP_SECRET` (vlerë e rastësishme prej të paktën 32 karakteresh) dhe `BLOB_READ_WRITE_TOKEN` për Production, Preview dhe Development sipas nevojës.
4. Me `DIRECT_URL` të production-it, ekzekutoni `pnpm prisma migrate deploy` nga një ambient i sigurt para ose gjatë deploy-it të parë.
5. Deploy-oni. Vercel përdor automatikisht `pnpm build`.

## Siguria dhe privatësia

- Numrat e telefonit normalizohen në E.164 (`+383…`); PIN-et hash-ohen me bcrypt.
- Sesionet ruhen në DB me token SHA-256 hash; cookie-ja është httpOnly dhe SameSite=Lax.
- Hyrja kufizohet sipas numrit + IP dhe bllokohet për 15 minuta pas 5 dështimeve.
- Numri i fermerit nuk futet kurrë në përgjigje publike. Linku i kontaktit krijohet vetëm në server për një biznes të kyçur.
- Fotoja verifikohet në server për MIME type, madhësi dhe magic bytes para se të dërgohet në Blob.
