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

## Aggiornare i contenuti

Modifica i file in `src/data/` (date in formato ISO, es. `2027-01-18` oppure
`2027-01-18T14:00:00+01:00` per gli orari). I campi opzionali (`website`, `email`,
`phone`, …) si possono omettere: il pulsante corrispondente non viene mostrato
dove è previsto così, altrimenti non fa nulla finché il dato non c'è.

- **Con aggiornamenti OTA** (consigliato): dopo la prima pubblicazione negli store,
  `eas update` invia i nuovi JSON agli utenti senza una nuova revisione Apple/Google.
- Se in futuro i dati devono essere modificabili da pannello, basta cambiare `src/data.ts`
  (es. leggere da Supabase) senza toccare le schermate.

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
