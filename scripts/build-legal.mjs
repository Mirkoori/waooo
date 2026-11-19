// Generates public/privacy, public/terms and public/support (plain HTML, served with HTTP 200)
// from legal.config.json. Run: node scripts/build-legal.mjs
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const c = JSON.parse(readFileSync(new URL('../legal.config.json', import.meta.url), 'utf8'));
const esc = (s) => String(s).replace(/[&<>]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[ch]));
const missing = Object.entries(c).filter(([, v]) => String(v).includes('[DA COMPLETARE')).map(([k]) => k);
if (missing.length) console.warn(`⚠ legal.config.json: still to fill in -> ${missing.join(', ')}`);

const owner = `${esc(c.controllerName)}, ${esc(c.controllerAddress)} (${esc(c.controllerVatOrTaxId)})`;
const mail = esc(c.contactEmail);

const page = (title, body) => `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} — ${esc(c.appName)}</title>
<style>
body{margin:0;background:#ECE9E3;color:#141414;font:16px/1.6 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
main{max-width:760px;margin:0 auto;padding:28px 20px 80px}
h1{font-size:34px;letter-spacing:-1px;margin:.2em 0}h2{font-size:20px;margin:1.8em 0 .4em}
.tag{font-weight:800;font-size:12px;letter-spacing:1px}
nav a{color:inherit;margin-right:16px;font-weight:600}
hr{border:0;border-top:2px solid #141414;margin:48px 0}
.card{background:#fff;border-radius:14px;padding:4px 20px 14px}
small{color:#6B6862}
</style></head><body><main>
<div class="tag">${esc(c.appName)} · MILAN FASHION WEEK, UNLOCKED.</div>
<nav><a href="${c.siteUrl}/privacy/">Privacy</a><a href="${c.siteUrl}/terms/">Terms</a><a href="${c.siteUrl}/support/">Support</a></nav>
<div class="card">${body}</div>
<p><small>Last updated / Ultimo aggiornamento: ${esc(c.effectiveDate)}</small></p>
</main></body></html>`;

const privacyEn = `
<h1>Privacy Policy</h1>
<p>This policy explains how the ${esc(c.appName)} app and website (the “Service”) handle personal data, under Regulation (EU) 2016/679 (GDPR).</p>
<h2>1. Data controller</h2>
<p>${owner}. Contact: <a href="mailto:${mail}">${mail}</a>.</p>
<h2>2. What we collect</h2>
<p><b>The app does not require an account and does not collect your location, contacts, photos or advertising identifiers.</b> It contains no advertising, no analytics and no tracking tools. The only personal data we collect is what you choose to submit when you register for an event.</p>
<ul>
<li><b>Event registration (optional).</b> If you register for an event we collect your first and last name, email address, professional role, the time of your consent and a ticket number and secret code used to generate your QR ticket. We share this data with the organizer of that event so they can manage the guest list and check you in. Your ticket is also stored on your device. We keep registration data for ${c.registrationRetentionDays ?? 90} days after the event, then delete it. You can ask us to delete it earlier.</li>
<li><b>Technical connection data.</b> To show you up-to-date content, the app requests it from our servers. As for any internet service, the servers and hosting providers process technical data such as your IP address, date/time and the type of request, for security and to deliver the content. We do not use it to identify you.</li>
<li><b>Calendar.</b> When you tap “Add to calendar”, the app opens your phone’s own calendar screen with the event details. The app does not read your calendar and nothing is sent to us.</li>
<li><b>Maps, phone, email and websites.</b> Buttons such as Map, Call, Email and Website open other apps or websites. Their own privacy policies apply from that point.</li>
<li><b>Editors’ area (web only).</b> People authorised to update the content sign in at /admin with email and password. We process that email address and an encrypted password hash only to authenticate them and keep the content safe.</li>
</ul>
<h2>3. Legal basis</h2>
<p>Delivering the content and keeping the Service secure is our legitimate interest (art. 6(1)(f) GDPR); for the editors’ area, performance of the agreement with the editor (art. 6(1)(b)).</p>
<h2>4. Who processes data for us</h2>
<p>Hosting and database: Supabase (data region: EU, Ireland). Website hosting: GitHub Pages (GitHub, Inc.). These providers act as processors and may transfer data outside the EEA under the safeguards required by GDPR (such as Standard Contractual Clauses). We do not sell personal data and do not share it for advertising.</p>
<h2>5. Retention</h2>
<p>Technical logs are kept by the providers for the short periods set in their own policies. Editor accounts are kept while the person is authorised and deleted on request.</p>
<h2>6. Your rights</h2>
<p>You can ask for access, rectification, erasure, restriction, portability and object to processing by writing to <a href="mailto:${mail}">${mail}</a>. You may also lodge a complaint with the Italian data protection authority (Garante per la protezione dei dati personali, <a href="https://www.garanteprivacy.it">garanteprivacy.it</a>) or with your local authority.</p>
<h2>7. Children</h2>
<p>The Service is not directed to children and does not knowingly collect their data.</p>
<h2>8. Changes</h2>
<p>If we change how the Service works (for example by adding accounts or analytics) we will update this page before the change and show the new date below.</p>`;

const privacyIt = `
<h1>Informativa sulla privacy</h1>
<p>Questa informativa spiega come l’app e il sito ${esc(c.appName)} (il “Servizio”) trattano i dati personali, ai sensi del Regolamento (UE) 2016/679 (GDPR).</p>
<h2>1. Titolare del trattamento</h2>
<p>${owner}. Contatto: <a href="mailto:${mail}">${mail}</a>.</p>
<h2>2. Quali dati trattiamo</h2>
<p><b>L’app non richiede un account e non raccoglie posizione, contatti, foto o identificativi pubblicitari.</b> Non contiene pubblicità, strumenti di analisi o di tracciamento. Gli unici dati personali raccolti sono quelli che scegli di inserire per registrarti a un evento.</p>
<ul>
<li><b>Registrazione agli eventi (facoltativa).</b> Se ti registri a un evento raccogliamo nome, cognome, indirizzo email, ruolo professionale, data e ora del consenso, oltre a un numero di biglietto e a un codice segreto usati per generare il QR. Condividiamo questi dati con l’organizzatore dell’evento per gestire la lista ospiti e il check-in. Il biglietto è salvato anche sul tuo dispositivo. Conserviamo i dati di registrazione per ${c.registrationRetentionDays ?? 90} giorni dopo l’evento, poi li cancelliamo. Puoi chiederne la cancellazione prima.</li>
<li><b>Dati tecnici di connessione.</b> Per mostrare contenuti aggiornati, l’app li richiede ai nostri server. Come per ogni servizio internet, server e fornitori di hosting trattano dati tecnici come indirizzo IP, data/ora e tipo di richiesta, per motivi di sicurezza e per erogare i contenuti. Non li usiamo per identificarti.</li>
<li><b>Calendario.</b> Con “Add to calendar” l’app apre la schermata del calendario del telefono con i dati dell’evento. L’app non legge il tuo calendario e non ci invia nulla.</li>
<li><b>Mappe, telefono, email e siti web.</b> I pulsanti Map, Call, Email e Website aprono altre app o siti: da quel momento valgono le loro informative.</li>
<li><b>Area redattori (solo web).</b> Le persone autorizzate ad aggiornare i contenuti accedono da /admin con email e password. Trattiamo l’indirizzo email e un hash cifrato della password solo per autenticarle e proteggere i contenuti.</li>
</ul>
<h2>3. Base giuridica</h2>
<p>Erogare i contenuti e mantenere sicuro il Servizio è un legittimo interesse (art. 6, par. 1, lett. f GDPR); per la registrazione agli eventi, il tuo consenso (art. 6, par. 1, lett. a), revocabile in qualsiasi momento; per l’area redattori, l’esecuzione dell’accordo con il redattore (art. 6, par. 1, lett. b).</p>
<h2>4. Chi tratta i dati per noi</h2>
<p>Hosting e database: Supabase (regione dati: UE, Irlanda). Hosting del sito web: GitHub Pages (GitHub, Inc.). Questi fornitori operano come responsabili del trattamento e possono trasferire dati fuori dallo SEE con le garanzie previste dal GDPR (ad esempio clausole contrattuali standard). Non vendiamo i dati personali e non li condividiamo per pubblicità.</p>
<h2>5. Conservazione</h2>
<p>I log tecnici sono conservati dai fornitori per i tempi brevi previsti dalle loro informative. Gli account dei redattori restano attivi finché la persona è autorizzata e sono cancellati su richiesta.</p>
<h2>6. I tuoi diritti</h2>
<p>Puoi chiedere accesso, rettifica, cancellazione, limitazione, portabilità e opporti al trattamento scrivendo a <a href="mailto:${mail}">${mail}</a>. Puoi inoltre proporre reclamo al Garante per la protezione dei dati personali (<a href="https://www.garanteprivacy.it">garanteprivacy.it</a>).</p>
<h2>7. Minori</h2>
<p>Il Servizio non è rivolto ai minori e non ne raccoglie consapevolmente i dati.</p>
<h2>8. Modifiche</h2>
<p>Se cambiamo il funzionamento del Servizio (ad esempio aggiungendo account o strumenti di analisi) aggiorneremo questa pagina prima della modifica indicando la nuova data.</p>`;

const termsEn = `
<h1>Terms of Use</h1>
<p>By using ${esc(c.appName)} you agree to these terms. The Service is operated by ${owner}.</p>
<h2>1. What the Service is</h2>
<p>${esc(c.appName)} is an information guide to Milan Fashion Week: calendars, shows, presentations, events, trade shows, showrooms, brands and stores. It is free to use.</p>
<h2>2. Accuracy of information</h2>
<p>Dates, times, venues and access conditions are provided by third parties and may change or be cancelled. Many events are by invitation or appointment only: listing an event does not give a right to attend. Please check with the organiser before you travel. We do not guarantee that the information is complete or up to date.</p>
<h2>3. Third parties and trademarks</h2>
<p>Brand, showroom, venue and event names belong to their owners and are used for identification only. ${esc(c.appName)} is not affiliated with, endorsed by or sponsored by them unless stated. Links lead to third-party sites we do not control.</p>
<h2>4. Intellectual property</h2>
<p>The app, its design and its code belong to the operator or its licensors. You may use the app for personal purposes; you may not copy, scrape or resell its content.</p>
<h2>5. Liability</h2>
<p>To the maximum extent permitted by law, the operator is not liable for losses arising from reliance on the information in the Service. Nothing here limits liability that cannot be limited under law or your mandatory consumer rights.</p>
<h2>6. Changes and law</h2>
<p>We may update the Service and these terms. Italian law applies, without prejudice to the mandatory consumer protections of your country of residence.</p>
<h2>7. Contact</h2>
<p><a href="mailto:${mail}">${mail}</a></p>`;

const termsIt = `
<h1>Termini di utilizzo</h1>
<p>Usando ${esc(c.appName)} accetti questi termini. Il Servizio è gestito da ${owner}.</p>
<h2>1. Cos’è il Servizio</h2>
<p>${esc(c.appName)} è una guida informativa alla Milano Fashion Week: calendari, sfilate, presentazioni, eventi, fiere, showroom, brand e negozi. L’uso è gratuito.</p>
<h2>2. Accuratezza delle informazioni</h2>
<p>Date, orari, luoghi e condizioni di accesso sono forniti da terzi e possono cambiare o essere annullati. Molti eventi sono solo su invito o su appuntamento: la presenza in elenco non dà diritto a partecipare. Verifica con l’organizzatore prima di spostarti. Non garantiamo che le informazioni siano complete o aggiornate.</p>
<h2>3. Terze parti e marchi</h2>
<p>Nomi di brand, showroom, luoghi ed eventi appartengono ai rispettivi titolari e sono usati solo a fini identificativi. ${esc(c.appName)} non è affiliata, approvata o sponsorizzata da essi, salvo diversa indicazione. I link portano a siti di terzi che non controlliamo.</p>
<h2>4. Proprietà intellettuale</h2>
<p>App, grafica e codice appartengono al gestore o ai suoi licenzianti. Puoi usare l’app per scopi personali; non puoi copiarne, estrarne automaticamente o rivenderne i contenuti.</p>
<h2>5. Responsabilità</h2>
<p>Nei limiti massimi consentiti dalla legge, il gestore non risponde di danni derivanti dall’affidamento sulle informazioni del Servizio. Nulla qui limita responsabilità non limitabili per legge o i diritti inderogabili del consumatore.</p>
<h2>6. Modifiche e legge applicabile</h2>
<p>Possiamo aggiornare il Servizio e questi termini. Si applica la legge italiana, fatte salve le tutele inderogabili del consumatore del tuo paese di residenza.</p>
<h2>7. Contatti</h2>
<p><a href="mailto:${mail}">${mail}</a></p>`;

const supportEn = `
<h1>Support</h1>
<p>Questions, corrections to an event or a showroom, or a problem with the app? Write to <a href="mailto:${mail}">${mail}</a> and we will reply as soon as we can.</p>
<h2>Common questions</h2>
<p><b>Do I need an account?</b> No. The app works without signing in.</p>
<p><b>An event in the app is wrong or missing.</b> Send us the event name, date and a source: the information is updated by the editorial team.</p>
<p><b>“Add to calendar” does nothing.</b> Make sure a calendar app is installed and allowed to add events, then try again.</p>
<p><b>Can I attend an event listed as “By invitation only” or “By appointment only”?</b> Only if you are invited or have booked with the brand or showroom: use the Email, Call or Website buttons on the page.</p>
<p><b>Privacy.</b> See the <a href="${c.siteUrl}/privacy/">Privacy Policy</a>.</p>`;

const supportIt = `
<h1>Assistenza</h1>
<p>Domande, correzioni su un evento o uno showroom, o un problema con l’app? Scrivi a <a href="mailto:${mail}">${mail}</a> e ti rispondiamo appena possibile.</p>
<h2>Domande frequenti</h2>
<p><b>Serve un account?</b> No. L’app funziona senza accedere.</p>
<p><b>Un evento nell’app è sbagliato o manca.</b> Mandaci nome dell’evento, data e una fonte: le informazioni sono aggiornate dalla redazione.</p>
<p><b>“Add to calendar” non fa nulla.</b> Controlla che sia installata un’app calendario autorizzata ad aggiungere eventi e riprova.</p>
<p><b>Posso partecipare a un evento “By invitation only” o “By appointment only”?</b> Solo se sei invitato o hai prenotato con il brand o lo showroom: usa i pulsanti Email, Call o Website nella pagina.</p>
<p><b>Privacy.</b> Vedi l’<a href="${c.siteUrl}/privacy/">Informativa sulla privacy</a>.</p>`;

const both = (en, it) => `${en}<hr>${it}`;
for (const [dir, title, body] of [
  ['privacy', 'Privacy Policy / Informativa privacy', both(privacyEn, privacyIt)],
  ['terms', 'Terms of Use / Termini di utilizzo', both(termsEn, termsIt)],
  ['support', 'Support / Assistenza', both(supportEn, supportIt)],
]) {
  mkdirSync(new URL(`../public/${dir}`, import.meta.url), { recursive: true });
  writeFileSync(new URL(`../public/${dir}/index.html`, import.meta.url), page(title, body));
}
console.log('legal pages written to public/{privacy,terms,support}');
