# WAOOO — Milan Fashion Week, unlocked.

App mobile (iOS + Android) costruita con **Expo / React Native** e **expo-router**.
Grafica e struttura derivano dal mockup in `docs/mockup_waooo.pdf`.

## Struttura

| Sezione | Schermate |
|---|---|
| 01 Fashion Week (arancio) | Fashion Weeks · Runway · Presentations · Events · Trade Shows |
| 02 Market (lilla) | Showrooms (+ dettaglio) · Brands (+ dettaglio) · Stores |
| 03 Info (verde) | Contacts · Partners |
| — | Ricerca globale |

```
app/            rotte (una cartella per sezione)
src/data/*.json contenuti: si aggiornano a mano qui
src/data.ts     unico punto di accesso ai dati
src/ui.tsx      componenti grafici condivisi
src/theme.ts    colori e font (Montserrat)
```

## Avvio

```bash
npm install
npx expo start        # poi scansiona il QR con Expo Go, oppure premi i / a
```

## Aggiornare i contenuti (area admin)

I contenuti stanno nel database Supabase (tabella `waooo_items`) e si modificano da
**`/admin`** (sul sito: https://mirkoori.github.io/waooo/admin), con login email + password.
L'app legge il database a ogni apertura; se è offline usa i file in `src/data/*.json`
come copia di riserva (sono anche i dati iniziali importati nel database).

- Lettura: pubblica. Scrittura: solo le email presenti nella tabella `waooo_admins`
  (regole RLS nel database, non solo nella pagina).
- **Aggiungere un admin:** 1) Supabase → Authentication → Users → *Add user* (email + password,
  spunta *Auto Confirm*); 2) Table Editor → `waooo_admins` → inserisci la stessa email.
- Le date/ore delle sfilate sono sempre in ora di Milano.
- Se cambi la struttura dei dati, aggiorna `src/types.ts`, `src/adminSchema.ts` e (se serve) i JSON di riserva.

## Pubblicazione

```bash
npm i -g eas-cli && eas login
eas build:configure
eas build --platform all --profile production
eas submit --platform all
```

Servono un account Apple Developer e uno Google Play Console. Bundle id / package
attuali: `com.waooo.app` (da cambiare in `app.json` se vuoi un altro identificativo).

## Da fare prima dello store

- Icona e splash definitive (ora sono quelle di default di Expo in `assets/`)
- Dati reali mancanti: contatti WAOOO / Camera Showroom Milano, email e telefono showroom, siti dei brand, store, presentations
- Per Events: data di "Artisanal Evolution" (ora "Date TBA")
