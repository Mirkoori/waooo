# Checklist di pubblicazione WAOOO

Legenda: ✅ già fatto nel repo · ☐ da fare tu (serve un tuo account/dato).

## 1. Dati del titolare e pagine legali
- ☐ Compila `legal.config.json` (nome/ragione sociale, indirizzo, P.IVA o C.F., email di contatto) → `npm run legal` → commit/push. La pagina è online in ~1 minuto.
- ☐ Decidi se usare un dominio proprio (es. waooo.app): gli URL di privacy/assistenza nelle schede store devono restare stabili. Se cambi dominio aggiorna `siteUrl` in `legal.config.json` e `SITE_URL` in `src/links.ts`.
- ✅ Privacy Policy, Termini e Assistenza (IT + EN) su `/privacy/`, `/terms/`, `/support/` + link nell'app (Info → Contacts).

## 2. Account
- ☐ **Apple Developer Program** (99 $/anno). Come persona o come azienda (l'azienda richiede il codice D-U-N-S, 1–2 settimane).
- ☐ **Google Play Console** (25 $ una tantum, con verifica d'identità). Se l'account è personale e recente, Google può richiedere un test chiuso con almeno 12 tester per 14 giorni prima della produzione: controlla le regole attuali in Console.
- ☐ **Account Expo** (gratuito per iniziare) per costruire i binari con EAS.

## 3. Build
- ✅ Icona 1024, icona adattiva Android, splash, nome, descrizione, `ITSAppUsesNonExemptEncryption`, stringhe calendario iOS, `eas.json`.
- ☐ `npm i -g eas-cli && eas login && eas init` (aggiunge il `projectId` ad `app.json`).
- ☐ `eas build --platform all --profile production` (le chiavi/certificati li gestisce EAS).
- ☐ Prova il build `preview` su un telefono vero: Add to calendar, Map, Call, Email, Website, ricerca.
- ☐ `eas submit --platform ios` / `--platform android`.

## 4. App Store Connect
- ☐ Crea l'app (bundle id `com.waooo.app`), carica testi (`SCHEDA-STORE.md`), screenshot, URL privacy/assistenza.
- ☐ App Privacy: Name + Email, App Functionality, linked (vedi `PRIVACY-E-CONFORMITA.md`). Age rating 4+.
- ☐ Incolla le note di revisione (`NOTE-PER-LA-REVISIONE.md`) e inserisci un contatto.

## 5. Google Play Console
- ☐ Crea l'app, scheda (testi + icona 512 + immagine 1024×500 + screenshot), Data safety, Content rating, Target audience 18+, Ads: no.
- ☐ Carica l'AAB, test interno → (test chiuso se richiesto) → produzione.

## 6. Contenuti e dati (prima di mostrare/pubblicare)
- ☐ Sostituisci i dati di esempio con quelli definitivi da `/admin` (siti web, email e telefoni mancanti, data di "Artisanal Evolution", altre presentazioni).
- ☐ Conferma per iscritto con showroom/organizzatori che i dati possono essere pubblicati (vedi sezione "Proprietà intellettuale").
- ☐ Ricontrolla le date delle sfilate: il pannello le salva in ora di Milano (l'ora legale cambia il 28 marzo 2027).

## 7. Backend (Supabase)
- ☐ I progetti del piano gratuito vengono messi in pausa dopo un periodo di inattività: l'app continuerebbe a funzionare con i dati di riserva, ma `/admin` no. Per l'uso in produzione valuta il piano a pagamento (anche per backup e supporto).
- ☐ Cambia la password temporanea di Gina con una lunga; attiva "Leaked password protection".
- ✅ Regole di sicurezza (RLS): lettura pubblica, scrittura solo per le email in `waooo_admins`. Chiave pubblica nell'app (è prevista dalla piattaforma, non è un segreto).
- ☐ Se vuoi aggiornare i dati anche senza internet lato utente: i JSON in `src/data/` sono la copia di riserva dentro l'app; aggiornali ogni tanto prima di un nuovo build.

## 8. Dopo il lancio
- ☐ Aggiornamenti senza nuova revisione (`eas update`): richiede configurazione `expo-updates` + canale. **Se lo attivi, aggiorna la Privacy Policy** (le richieste di aggiornamento passano dai server Expo).
- ☐ Registrazioni eventi: cancella i dati entro 90 giorni dall'evento (admin → Registrazioni) e indica nella privacy policy chi è l'organizzatore destinatario.
- ☐ Ogni modifica a funzioni o dati raccolti → aggiorna privacy, App Privacy e Data safety.
