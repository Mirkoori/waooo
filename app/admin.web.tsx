import React, { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../src/supabase';
import { KINDS, Kind, useDataControls } from '../src/data';
import { CONFIG, Field, KindConfig } from '../src/adminSchema';

const C = { bg: '#ECE9E3', ink: '#141414', card: '#FEFEFE', fw: '#FE693C', mk: '#C7B5F4', info: '#BED2C0', muted: '#6B6862', err: '#B3261E' };
const F = 'Montserrat_600SemiBold, system-ui, sans-serif';
const FB = 'Montserrat_800ExtraBold, system-ui, sans-serif';
const st: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: C.bg, fontFamily: F, color: C.ink, fontSize: 14 },
  wrap: { maxWidth: 920, margin: '0 auto', padding: '20px 16px 80px' },
  top: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 },
  h1: { fontFamily: FB, fontSize: 26, margin: 0, letterSpacing: -0.5 },
  card: { background: C.card, borderRadius: 14, padding: 16, marginBottom: 10 },
  input: { width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #d6d1c7', fontFamily: F, fontSize: 14, background: '#fff' },
  label: { display: 'block', fontFamily: FB, fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase', margin: '14px 0 5px' },
  help: { color: C.muted, fontSize: 12, marginTop: 4 },
  btn: { fontFamily: FB, fontSize: 12, letterSpacing: 0.4, textTransform: 'uppercase', borderRadius: 20, padding: '9px 16px', border: `1.5px solid ${C.ink}`, background: 'transparent', color: C.ink, cursor: 'pointer' },
  btnP: { fontFamily: FB, fontSize: 12, letterSpacing: 0.4, textTransform: 'uppercase', borderRadius: 20, padding: '9px 16px', border: `1.5px solid ${C.ink}`, background: C.ink, color: C.bg, cursor: 'pointer' },
  tabs: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  pill: { display: 'inline-block', padding: '3px 10px', borderRadius: 12, background: C.mk, fontFamily: FB, fontSize: 11 },
};
const tab = (on: boolean): React.CSSProperties => ({ ...st.btn, background: on ? C.fw : 'transparent', borderColor: on ? C.fw : C.ink });

const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';

// ---- Europe/Rome offset handling for date-time fields -------------------------------
function romeOffsetMin(at: Date) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Rome', hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).formatToParts(at).map((x) => [x.type, x.value]));
  return (Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - at.getTime()) / 60000;
}
function toRomeIso(local: string) { // "2027-01-18T14:00" -> "2027-01-18T14:00:00+01:00"
  const naive = new Date(local + ':00Z');
  let off = romeOffsetMin(naive);
  off = romeOffsetMin(new Date(naive.getTime() - off * 60000));
  const sign = off >= 0 ? '+' : '-', a = Math.abs(off);
  return `${local}:00${sign}${String(Math.floor(a / 60)).padStart(2, '0')}:${String(a % 60).padStart(2, '0')}`;
}

// ---- generic form ---------------------------------------------------------------------
function Inp({ f, v, on }: { f: Field; v: any; on: (x: any) => void }) {
  if (f.type === 'textarea') return <textarea style={{ ...st.input, minHeight: 80 }} value={v ?? ''} onChange={(e) => on(e.target.value)} />;
  if (f.type === 'bool') return <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}><input type="checkbox" checked={!!v} onChange={(e) => on(e.target.checked)} /> Sì</label>;
  const type = f.type === 'datetime' ? 'datetime-local' : f.type === 'date' ? 'date' : f.type === 'time' ? 'time' : f.type === 'number' ? 'number' : 'text';
  const val = f.type === 'datetime' ? String(v ?? '').slice(0, 16) : v ?? '';
  return <input style={st.input} type={type} value={val} onChange={(e) => on(e.target.value)} />;
}

function Campaigns({ v, on, brands }: { v: any[]; on: (x: any[]) => void; brands: { id: string; name: string }[] }) {
  const list = v ?? [];
  const set = (i: number, patch: any) => on(list.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  return (
    <div>
      {list.map((c, i) => (
        <div key={i} style={{ ...st.card, background: C.bg, marginTop: 8 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <select style={{ ...st.input, width: 140 }} value={c.city ?? 'Milan'} onChange={(e) => set(i, { city: e.target.value })}><option>Milan</option><option>Paris</option></select>
            <input style={st.input} placeholder="Titolo (es. Collezione)" value={c.label ?? ''} onChange={(e) => set(i, { label: e.target.value })} />
            <button type="button" style={st.btn} onClick={() => on(list.filter((_, j) => j !== i))}>Elimina</button>
          </div>
          <span style={st.label}>Periodi</span>
          {(c.ranges ?? []).map((r: any, k: number) => (
            <div key={k} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center' }}>
              <input style={st.input} type="date" value={r.start ?? ''} onChange={(e) => set(i, { ranges: c.ranges.map((x: any, y: number) => (y === k ? { ...x, start: e.target.value } : x)) })} />
              <span>→</span>
              <input style={st.input} type="date" value={r.end ?? ''} onChange={(e) => set(i, { ranges: c.ranges.map((x: any, y: number) => (y === k ? { ...x, end: e.target.value } : x)) })} />
              <button type="button" style={st.btn} onClick={() => set(i, { ranges: c.ranges.filter((_: any, y: number) => y !== k) })}>×</button>
            </div>
          ))}
          <button type="button" style={st.btn} onClick={() => set(i, { ranges: [...(c.ranges ?? []), { start: '', end: '' }] })}>+ Periodo</button>
          <span style={st.label}>Indirizzo</span>
          <input style={st.input} value={c.address ?? ''} onChange={(e) => set(i, { address: e.target.value })} />
          <span style={st.label}>Brand presenti ({(c.brands ?? []).length})</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px' }}>
            {brands.map((b) => (
              <label key={b.id} style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 13 }}>
                <input type="checkbox" checked={(c.brands ?? []).includes(b.id)} onChange={(e) => set(i, { brands: e.target.checked ? [...(c.brands ?? []), b.id] : (c.brands ?? []).filter((x: string) => x !== b.id) })} />
                {b.name}
              </label>
            ))}
          </div>
          {brands.length === 0 && <div style={st.help}>Aggiungi prima i brand nella sezione Brands.</div>}
        </div>
      ))}
      <div style={{ marginTop: 8 }}><button type="button" style={st.btn} onClick={() => on([...list, { city: 'Milan', label: 'Collezione', ranges: [{ start: '', end: '' }], address: '', brands: [] }])}>+ Campagna</button></div>
    </div>
  );
}

function Editor({ cfg, item, brands, existingIds, onCancel, onSave }: {
  cfg: KindConfig; item: any | null; brands: { id: string; name: string }[]; existingIds: string[];
  onCancel: () => void; onSave: (obj: any) => Promise<void>;
}) {
  const [v, setV] = useState<any>(() => (item ? JSON.parse(JSON.stringify(item)) : cfg.kind === 'showrooms' ? { campaigns: [] } : {}));
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k: string, x: any) => setV((p: any) => ({ ...p, [k]: x }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const o: any = { ...v };
    for (const f of cfg.fields) {
      let x = o[f.key];
      if (typeof x === 'string') x = x.trim();
      if (f.required && (x === undefined || x === '')) return setErr(`Compila il campo "${f.label}".`);
      if (f.type === 'datetime' && x) x = String(x).length === 16 ? toRomeIso(x) : x;
      if (f.type === 'bool') x = x ? true : undefined;
      if (f.type === 'number') x = x === '' || x === undefined ? undefined : Number(x);
      if (x === '' || x === undefined || (Array.isArray(x) && f.type !== 'campaigns')) delete o[f.key]; else o[f.key] = x;
    }
    if (o.start && o.end && String(o.end) < String(o.start)) return setErr('La fine non può essere prima dell’inizio.');
    if (cfg.kind === 'showrooms') {
      for (const c of o.campaigns ?? []) {
        c.ranges = (c.ranges ?? []).filter((r: any) => r.start && r.end);
        if (!c.address) return setErr('Ogni campagna ha bisogno di un indirizzo.');
        if (c.ranges.some((r: any) => r.end < r.start)) return setErr('In un periodo la fine è prima dell’inizio.');
      }
    }
    if (!item) {
      let id = slug(String(o[cfg.titleKey]));
      for (let n = 2; existingIds.includes(id); n++) id = `${slug(String(o[cfg.titleKey]))}-${n}`;
      o.id = id;
    }
    setBusy(true); setErr('');
    try { await onSave(o); } catch (x: any) { setErr(x?.message ?? 'Salvataggio non riuscito.'); setBusy(false); }
  }

  return (
    <form onSubmit={submit} style={st.card}>
      <h2 style={{ fontFamily: FB, margin: 0 }}>{item ? 'Modifica' : 'Nuovo'} {cfg.singular}</h2>
      {cfg.fields.map((f) => (
        <div key={f.key}>
          <span style={st.label}>{f.label}{f.required ? ' *' : ''}</span>
          {f.type === 'campaigns' ? <Campaigns v={v[f.key]} on={(x) => set(f.key, x)} brands={brands} /> : <Inp f={f} v={v[f.key]} on={(x) => set(f.key, x)} />}
          {f.help && <div style={st.help}>{f.help}</div>}
        </div>
      ))}
      {err && <p style={{ color: C.err, fontFamily: FB }}>{err}</p>}
      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <button style={st.btnP} disabled={busy}>{busy ? 'Salvo…' : 'Salva'}</button>
        <button type="button" style={st.btn} onClick={onCancel}>Annulla</button>
      </div>
    </form>
  );
}

// ---- screens --------------------------------------------------------------------------
function Login() {
  const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  async function go(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr('');
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pw });
    if (error) { setErr('Email o password non corretti.'); setBusy(false); }
  }
  return (
    <div style={st.page}><div style={{ ...st.wrap, maxWidth: 420, paddingTop: 80 }}>
      <h1 style={{ ...st.h1, fontSize: 40, letterSpacing: -1.5 }}>WAOOO</h1>
      <p style={{ marginTop: 4, fontFamily: FB, fontSize: 11, letterSpacing: 1 }}>AREA ADMIN</p>
      <form onSubmit={go} style={{ ...st.card, marginTop: 24 }}>
        <span style={{ ...st.label, marginTop: 0 }}>Email</span>
        <input style={st.input} type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
        <span style={st.label}>Password</span>
        <input style={st.input} type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} />
        {err && <p style={{ color: C.err, fontFamily: FB }}>{err}</p>}
        <div style={{ marginTop: 18 }}><button style={st.btnP} disabled={busy}>{busy ? 'Accesso…' : 'Entra'}</button></div>
      </form>
    </div></div>
  );
}


function Registrations({ events, flash }: { events: any[]; flash: (t: string) => void }) {
  const [eid, setEid] = useState(events[0]?.id ?? '');
  const [rows, setRows] = useState<any[]>([]);
  const load = useCallback(async () => {
    if (!eid) return setRows([]);
    const { data, error } = await supabase.from('waooo_registrations').select('*').eq('event_id', eid).order('ticket_no');
    if (error) flash('Errore: ' + error.message); else setRows(data ?? []);
  }, [eid]);
  useEffect(() => { load(); }, [load]);
  async function del(r: any) {
    if (!window.confirm(`Eliminare la registrazione di ${r.first_name} ${r.last_name}?`)) return;
    const { error } = await supabase.from('waooo_registrations').delete().eq('id', r.id);
    if (error) return flash('Errore: ' + error.message);
    load();
  }
  function csv() {
    const q = (x: any) => `"${String(x ?? '').replace(/"/g, '""')}"`;
    const head = ['Biglietto', 'Nome', 'Cognome', 'Email', 'Ruolo', 'Consenso', 'Registrato il'];
    const lines = rows.map((r) => [`WAOOO-${String(r.ticket_no).padStart(4, '0')}`, r.first_name, r.last_name, r.email, r.role, r.consent_at, r.created_at].map(q).join(','));
    const blob = new Blob(['\ufeff' + [head.map(q).join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `registrazioni-${eid}.csv`; a.click();
  }
  return (
    <>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
        <h2 style={{ fontFamily: FB, margin: 0 }}>Registrazioni <span style={st.pill}>{rows.length}</span></h2>
        <select style={{ ...st.input, width: 'auto' }} value={eid} onChange={(e) => setEid(e.target.value)}>
          {events.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
        <button style={st.btnP} disabled={!rows.length} onClick={csv}>Scarica CSV</button>
      </div>
      <div style={st.help}>Dati personali: usali solo per l’evento e cancellali entro i tempi indicati nella privacy policy.</div>
      {rows.length === 0 && <div style={{ ...st.card, color: C.muted }}>Nessuna registrazione per questo evento.</div>}
      {rows.map((r) => (
        <div key={r.id} style={{ ...st.card, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: FB, fontSize: 15 }}>{r.first_name} {r.last_name}</div>
            <div style={st.help}>WAOOO-{String(r.ticket_no).padStart(4, '0')} · {r.email} · {r.role}</div>
          </div>
          <button style={st.btn} onClick={() => del(r)}>Elimina</button>
        </div>
      ))}
    </>
  );
}

function Panel({ session }: { session: Session }) {
  const { data, reload, remote } = useDataControls();
  const [kind, setKind] = useState<Kind | 'registrations'>('runway');
  const [editing, setEditing] = useState<{ item: any | null } | null>(null);
  const [msg, setMsg] = useState('');
  const cfg = (CONFIG.find((c) => c.kind === kind) ?? CONFIG[0])!;
  const isReg = kind === 'registrations';
  const items: any[] = data[cfg.kind] as any[];
  const ordered = cfg.sortBy ? [...items].sort((a, b) => String(a[cfg.sortBy!]).localeCompare(String(b[cfg.sortBy!]))) : items;

  const flash = (t: string) => { setMsg(t); setTimeout(() => setMsg(''), 3500); };

  async function save(o: any) {
    const sort = items.findIndex((x) => x.id === o.id);
    const { error } = await supabase.from('waooo_items').upsert({ kind, id: o.id, data: o, sort: sort >= 0 ? sort : items.length }, { onConflict: 'kind,id' });
    if (error) throw new Error(error.code === '42501' ? 'Il tuo account non ha il permesso di modificare.' : error.message);
    await reload(); setEditing(null); flash('Salvato. L’app si aggiorna alla prossima apertura.');
  }
  async function del(o: any) {
    if (!window.confirm(`Eliminare "${o[cfg.titleKey]}"?`)) return;
    const { error } = await supabase.from('waooo_items').delete().eq('kind', kind).eq('id', o.id);
    if (error) return flash('Errore: ' + error.message);
    await reload(); flash('Eliminato.');
  }
  async function move(i: number, d: -1 | 1) {
    const j = i + d; if (j < 0 || j >= items.length) return;
    const a = items[i], b = items[j];
    const r = await Promise.all([
      supabase.from('waooo_items').update({ sort: j }).eq('kind', kind).eq('id', a.id),
      supabase.from('waooo_items').update({ sort: i }).eq('kind', kind).eq('id', b.id),
    ]);
    if (r.some((x) => x.error)) return flash('Errore nel cambio ordine.');
    await reload();
  }

  return (
    <div style={st.page}><div style={st.wrap}>
      <div style={st.top}>
        <div><h1 style={st.h1}>WAOOO · Admin</h1><div style={st.help}>{session.user.email}</div></div>
        <button style={st.btn} onClick={() => supabase.auth.signOut()}>Esci</button>
      </div>
      {!remote && <div style={{ ...st.card, background: '#FDE7E4' }}>I dati non sono stati caricati dal database (connessione?). Ricarica la pagina prima di modificare.</div>}
      {msg && <div style={{ ...st.card, background: C.info, fontFamily: FB }}>{msg}</div>}
      <div style={st.tabs}>{CONFIG.map((c) => <button key={c.kind} style={tab(c.kind === kind)} onClick={() => { setKind(c.kind); setEditing(null); }}>{c.label}</button>)}<button style={tab(isReg)} onClick={() => { setKind('registrations'); setEditing(null); }}>Registrazioni</button></div>

      {isReg ? <Registrations events={data.events} flash={flash} /> : editing ? (
        <Editor key={editing.item?.id ?? 'new'} cfg={cfg} item={editing.item} brands={data.brands} existingIds={items.map((x) => x.id)} onCancel={() => setEditing(null)} onSave={save} />
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h2 style={{ fontFamily: FB, margin: 0 }}>{cfg.label} <span style={st.pill}>{items.length}</span></h2>
            <button style={st.btnP} onClick={() => setEditing({ item: null })}>+ Nuovo {cfg.singular}</button>
          </div>
          {cfg.help && <div style={st.help}>{cfg.help}</div>}
          {ordered.length === 0 && <div style={{ ...st.card, color: C.muted }}>Ancora niente qui. Premi "+ Nuovo {cfg.singular}".</div>}
          {ordered.map((o) => {
            const i = items.indexOf(o);
            return (
              <div key={o.id} style={{ ...st.card, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: FB, fontSize: 15 }}>{o[cfg.titleKey]}</div>
                  {cfg.subtitle && <div style={st.help}>{cfg.subtitle(o)}</div>}
                </div>
                {cfg.manualOrder && <><button style={st.btn} title="Su" onClick={() => move(i, -1)}>▲</button><button style={st.btn} title="Giù" onClick={() => move(i, 1)}>▼</button></>}
                <button style={st.btn} onClick={() => setEditing({ item: o })}>Modifica</button>
                <button style={st.btn} onClick={() => del(o)}>Elimina</button>
              </div>
            );
          })}
        </>
      )}
    </div></div>
  );
}

export default function Admin() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const { reload } = useDataControls();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);
  const check = useCallback(async () => {
    if (!session) return setAllowed(null);
    const { data } = await supabase.rpc('waooo_is_admin');
    setAllowed(data === true); if (data === true) reload();
  }, [session, reload]);
  useEffect(() => { check(); }, [check]);

  if (session === undefined) return <div style={st.page} />;
  if (!session) return <Login />;
  if (allowed === null) return <div style={st.page} />;
  if (!allowed) return (
    <div style={st.page}><div style={{ ...st.wrap, maxWidth: 480, paddingTop: 80 }}>
      <div style={st.card}><h2 style={{ fontFamily: FB, marginTop: 0 }}>Account non abilitato</h2>
        <p>L'account {session.user.email} non è tra gli amministratori di WAOOO. Chiedi di essere aggiunto.</p>
        <button style={st.btn} onClick={() => supabase.auth.signOut()}>Esci</button></div>
    </div></div>
  );
  return <Panel session={session} />;
}
