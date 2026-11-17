# Privacy, classificazione e conformità (risposte per i moduli degli store)

Le risposte descrivono l'app **com'è oggi**: nessun account nell'app, nessuna analytics, nessuna pubblicità, nessun SDK di terzi che raccoglie dati. Se cambia (analisi, login utenti, notifiche push, EAS Update) vanno riviste **insieme alla pagina Privacy** (`legal.config.json` → `npm run legal`).

## Apple — App Privacy ("nutrition labels")
- **Data collection:** *Data Not Collected*.
- Motivo: l'app non invia dati che identificano la persona; l'unica comunicazione è la richiesta dei contenuti al nostro server (Supabase), usata solo per rispondere. Il calendario si apre con la schermata di sistema e l'app non lo legge.
- ⚠ Verifica finale a carico del titolare: se in futuro usi analytics o conservi indirizzi IP per i tuoi scopi, la risposta cambia.
- **Tracking (ATT):** no, quindi niente richiesta di tracciamento.
- **Encryption / export compliance:** l'app usa solo HTTPS standard → esente. Già impostato `ITSAppUsesNonExemptEncryption = false` in `app.json`, così Apple non chiede il questionario a ogni build.
- **Age rating:** nessun contenuto sensibile (violenza, nudità, gioco d'azzardo, alcol ecc.: tutte risposte "None") → **4+**.
- **Account deletion:** non richiesta, perché l'app non ha account.
- **Sign in with Apple:** non richiesto (nessun login di terze parti).

## Google Play
- **Data safety:** "This app doesn't collect or share any required user data"; dati cifrati in transito: **Sì**; eliminazione dati: non applicabile (nessun account). 
- **Content rating (IARC):** tutte "No" → Everyone / PEGI 3.
- **Target audience:** 18+ (evita le regole per app per famiglie/bambini).
- **Ads:** nessuna. **App access:** nessun login necessario. **News/Government/Health/Finance:** no.
- **Permessi dichiarati:** solo internet (nessun permesso su calendario, posizione, contatti, foto). Il pulsante "Add to calendar" apre l'editor del calendario di sistema.
- **Privacy policy URL:** obbligatoria → https://mirkoori.github.io/waooo/privacy/

## GDPR / Italia
- Titolare, indirizzo, P.IVA e email vanno inseriti in `legal.config.json` e le pagine rigenerate (`npm run legal`, già eseguito nel deploy automatico). **Finché restano i segnaposto "[DA COMPLETARE…]" la privacy policy non è pubblicabile.**
- Informativa e Termini sono in italiano e inglese. Sono modelli ragionevoli per un'app informativa senza account, ma non sono una consulenza legale: se il titolare è un'azienda, fai rivedere il testo a un professionista (o al consulente privacy).
- Registro dei trattamenti (art. 30) e nomina dei responsabili (Supabase, GitHub): dati di sicurezza e DPA sono disponibili nelle rispettive consoles (Supabase → Organization → Legal/DPA).
- Area `/admin`: tratta email e hash password dei redattori (Supabase Auth). Usa password lunghe, attiva la "leaked password protection" in Supabase → Authentication, e toglie l'accesso a chi non serve (riga in `waooo_admins` + utente).

## Proprietà intellettuale (rischio rifiuto/segnalazioni)
- L'app cita marchi di terzi (Prada, Fendi, Marni, Pitti Uomo, White, Tranoi, brand e showroom) a solo scopo informativo, senza loghi né immagini loro. È una prassi comune, ma Apple (linea guida 5.2) e Google possono chiedere prova di autorizzazione se un titolare segnala.
- Consiglio: avere una conferma scritta (anche email) di showroom/Camera Showroom Milano e degli organizzatori che i dati possono essere pubblicati. Non inserire loghi o foto senza licenza.
- Il nome "WAOOO": verifica che non esistano marchi simili in classe 9/41/35 (ricerca su EUIPO / UIBM) prima del lancio.
