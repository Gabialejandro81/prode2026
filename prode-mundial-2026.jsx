import { useState, useEffect } from "react";

// ============================================================
// STORAGE HELPERS
// ============================================================
async function storageGet(key) {
  try {
    const result = await window.storage.get(key, true);
    return result ? JSON.parse(result.value) : null;
  } catch { return null; }
}
async function storageSet(key, value) {
  try { await window.storage.set(key, JSON.stringify(value), true); }
  catch (e) { console.error("Storage error", e); }
}

// ============================================================
// PLAYERS
// ============================================================
const INITIAL_PLAYERS = [
  { id: "p1",  name: "Leonardo",  token: "leo7x" },
  { id: "p2",  name: "Pablo F",   token: "pabf3k" },
  { id: "p3",  name: "Silvina",   token: "sil9m" },
  { id: "p4",  name: "Gabriela",  token: "gabr2n" },
  { id: "p5",  name: "Sabrina",   token: "sabr5p" },
  { id: "p6",  name: "Juan",      token: "juan8q" },
  { id: "p7",  name: "Pablo Y",   token: "paby1r" },
  { id: "p8",  name: "Matias",    token: "mati4s" },
  { id: "p9",  name: "Eliana",    token: "eli6t" },
  { id: "p10", name: "Oscar",     token: "osca3u" },
  { id: "p11", name: "Gabriel",   token: "gabi9v" },
];

// ============================================================
// FIXTURE OFICIAL MUNDIAL 2026 - FASE DE GRUPOS (horarios ARG)
// ============================================================
const INITIAL_MATCHES = [
  // JUEVES 11/06
  { id:"m001", home:"México",        away:"Sudáfrica",       kickoff:"2026-06-11T16:00:00", group:"Grupo A", venue:"Ciudad de México" },
  { id:"m002", home:"Corea del Sur", away:"República Checa", kickoff:"2026-06-11T23:00:00", group:"Grupo A", venue:"Guadalajara" },
  // VIERNES 12/06
  { id:"m003", home:"Canadá",        away:"Bosnia y Herz.",  kickoff:"2026-06-12T16:00:00", group:"Grupo B", venue:"Toronto" },
  { id:"m004", home:"Estados Unidos",away:"Paraguay",        kickoff:"2026-06-12T22:00:00", group:"Grupo D", venue:"Los Ángeles" },
  // SÁBADO 13/06
  { id:"m005", home:"Qatar",         away:"Suiza",           kickoff:"2026-06-13T16:00:00", group:"Grupo B", venue:"San Francisco" },
  { id:"m006", home:"Brasil",        away:"Marruecos",       kickoff:"2026-06-13T19:00:00", group:"Grupo C", venue:"Nueva Jersey" },
  { id:"m007", home:"Haití",         away:"Escocia",         kickoff:"2026-06-13T22:00:00", group:"Grupo C", venue:"Boston" },
  { id:"m008", home:"Australia",     away:"Turquía",         kickoff:"2026-06-14T01:00:00", group:"Grupo D", venue:"Vancouver" },
  // DOMINGO 14/06
  { id:"m009", home:"Alemania",      away:"Curazao",         kickoff:"2026-06-14T14:00:00", group:"Grupo E", venue:"Houston" },
  { id:"m010", home:"Países Bajos",  away:"Japón",           kickoff:"2026-06-14T17:00:00", group:"Grupo F", venue:"Dallas" },
  { id:"m011", home:"Costa de Marfil",away:"Ecuador",        kickoff:"2026-06-14T20:00:00", group:"Grupo E", venue:"Philadelphia" },
  { id:"m012", home:"Suecia",        away:"Túnez",           kickoff:"2026-06-14T23:00:00", group:"Grupo F", venue:"Monterrey" },
  // LUNES 15/06
  { id:"m013", home:"España",        away:"Cabo Verde",      kickoff:"2026-06-15T13:00:00", group:"Grupo H", venue:"Atlanta" },
  { id:"m014", home:"Bélgica",       away:"Egipto",          kickoff:"2026-06-15T16:00:00", group:"Grupo G", venue:"Seattle" },
  { id:"m015", home:"Arabia Saudita",away:"Uruguay",         kickoff:"2026-06-15T19:00:00", group:"Grupo H", venue:"Miami" },
  { id:"m016", home:"Irán",          away:"Nueva Zelanda",   kickoff:"2026-06-15T22:00:00", group:"Grupo G", venue:"Los Ángeles" },
  // MARTES 16/06
  { id:"m017", home:"Francia",       away:"Senegal",         kickoff:"2026-06-16T16:00:00", group:"Grupo I", venue:"Nueva Jersey" },
  { id:"m018", home:"Irak",          away:"Noruega",         kickoff:"2026-06-16T19:00:00", group:"Grupo I", venue:"Boston" },
  { id:"m019", home:"Argentina",     away:"Argelia",         kickoff:"2026-06-16T22:00:00", group:"Grupo J", venue:"Kansas City" },
  { id:"m020", home:"Austria",       away:"Jordania",        kickoff:"2026-06-17T01:00:00", group:"Grupo J", venue:"San Francisco" },
  // MIÉRCOLES 17/06
  { id:"m021", home:"Portugal",      away:"RD Congo",        kickoff:"2026-06-17T14:00:00", group:"Grupo K", venue:"Houston" },
  { id:"m022", home:"Inglaterra",    away:"Croacia",         kickoff:"2026-06-17T17:00:00", group:"Grupo L", venue:"Dallas" },
  { id:"m023", home:"Ghana",         away:"Panamá",          kickoff:"2026-06-17T20:00:00", group:"Grupo L", venue:"Toronto" },
  { id:"m024", home:"Uzbekistán",    away:"Colombia",        kickoff:"2026-06-17T23:00:00", group:"Grupo K", venue:"Ciudad de México" },
  // JUEVES 18/06
  { id:"m025", home:"Rep. Checa",    away:"Sudáfrica",       kickoff:"2026-06-18T13:00:00", group:"Grupo A", venue:"Atlanta" },
  { id:"m026", home:"Suiza",         away:"Bosnia y Herz.",  kickoff:"2026-06-18T16:00:00", group:"Grupo B", venue:"Los Ángeles" },
  { id:"m027", home:"Canadá",        away:"Qatar",           kickoff:"2026-06-18T19:00:00", group:"Grupo B", venue:"Vancouver" },
  { id:"m028", home:"México",        away:"Corea del Sur",   kickoff:"2026-06-18T22:00:00", group:"Grupo A", venue:"Guadalajara" },
  // VIERNES 19/06
  { id:"m029", home:"Estados Unidos",away:"Australia",       kickoff:"2026-06-19T16:00:00", group:"Grupo D", venue:"Seattle" },
  { id:"m030", home:"Escocia",       away:"Marruecos",       kickoff:"2026-06-19T19:00:00", group:"Grupo C", venue:"Boston" },
  { id:"m031", home:"Brasil",        away:"Haití",           kickoff:"2026-06-19T21:30:00", group:"Grupo C", venue:"Philadelphia" },
  { id:"m032", home:"Turquía",       away:"Paraguay",        kickoff:"2026-06-20T00:00:00", group:"Grupo D", venue:"San Francisco" },
  // SÁBADO 20/06
  { id:"m033", home:"Países Bajos",  away:"Suecia",          kickoff:"2026-06-20T14:00:00", group:"Grupo F", venue:"Houston" },
  { id:"m034", home:"Alemania",      away:"Costa de Marfil", kickoff:"2026-06-20T17:00:00", group:"Grupo E", venue:"Toronto" },
  { id:"m035", home:"Ecuador",       away:"Curazao",         kickoff:"2026-06-20T21:00:00", group:"Grupo E", venue:"Kansas City" },
  { id:"m036", home:"Túnez",         away:"Japón",           kickoff:"2026-06-21T01:00:00", group:"Grupo F", venue:"Monterrey" },
  // DOMINGO 21/06
  { id:"m037", home:"España",        away:"Arabia Saudita",  kickoff:"2026-06-21T13:00:00", group:"Grupo H", venue:"Atlanta" },
  { id:"m038", home:"Bélgica",       away:"Irán",            kickoff:"2026-06-21T16:00:00", group:"Grupo G", venue:"Los Ángeles" },
  { id:"m039", home:"Uruguay",       away:"Cabo Verde",      kickoff:"2026-06-21T19:00:00", group:"Grupo H", venue:"Miami" },
  { id:"m040", home:"Nueva Zelanda", away:"Egipto",          kickoff:"2026-06-21T22:00:00", group:"Grupo G", venue:"Vancouver" },
  // LUNES 22/06
  { id:"m041", home:"Argentina",     away:"Austria",         kickoff:"2026-06-22T14:00:00", group:"Grupo J", venue:"Dallas" },
  { id:"m042", home:"Francia",       away:"Irak",            kickoff:"2026-06-22T18:00:00", group:"Grupo I", venue:"Philadelphia" },
  { id:"m043", home:"Noruega",       away:"Senegal",         kickoff:"2026-06-22T21:00:00", group:"Grupo I", venue:"Nueva Jersey" },
  { id:"m044", home:"Jordania",      away:"Argelia",         kickoff:"2026-06-23T00:00:00", group:"Grupo J", venue:"San Francisco" },
  // MARTES 23/06
  { id:"m045", home:"Portugal",      away:"Uzbekistán",      kickoff:"2026-06-23T14:00:00", group:"Grupo K", venue:"Houston" },
  { id:"m046", home:"Inglaterra",    away:"Ghana",           kickoff:"2026-06-23T17:00:00", group:"Grupo L", venue:"Boston" },
  { id:"m047", home:"Panamá",        away:"Croacia",         kickoff:"2026-06-23T20:00:00", group:"Grupo L", venue:"Toronto" },
  { id:"m048", home:"Colombia",      away:"RD Congo",        kickoff:"2026-06-23T23:00:00", group:"Grupo K", venue:"Guadalajara" },
  // MIÉRCOLES 24/06
  { id:"m049", home:"Suiza",         away:"Canadá",          kickoff:"2026-06-24T16:00:00", group:"Grupo B", venue:"Vancouver" },
  { id:"m050", home:"Bosnia y Herz.",away:"Qatar",           kickoff:"2026-06-24T16:00:00", group:"Grupo B", venue:"Seattle" },
  { id:"m051", home:"Marruecos",     away:"Haití",           kickoff:"2026-06-24T19:00:00", group:"Grupo C", venue:"Atlanta" },
  { id:"m052", home:"Brasil",        away:"Escocia",         kickoff:"2026-06-24T19:00:00", group:"Grupo C", venue:"Miami" },
  { id:"m053", home:"Sudáfrica",     away:"Corea del Sur",   kickoff:"2026-06-24T22:00:00", group:"Grupo A", venue:"Monterrey" },
  { id:"m054", home:"Rep. Checa",    away:"México",          kickoff:"2026-06-24T22:00:00", group:"Grupo A", venue:"Ciudad de México" },
  // JUEVES 25/06
  { id:"m055", home:"Curazao",       away:"Costa de Marfil", kickoff:"2026-06-25T17:00:00", group:"Grupo E", venue:"Philadelphia" },
  { id:"m056", home:"Ecuador",       away:"Alemania",        kickoff:"2026-06-25T17:00:00", group:"Grupo E", venue:"Nueva Jersey" },
  { id:"m057", home:"Japón",         away:"Suecia",          kickoff:"2026-06-25T20:00:00", group:"Grupo F", venue:"Dallas" },
  { id:"m058", home:"Túnez",         away:"Países Bajos",    kickoff:"2026-06-25T20:00:00", group:"Grupo F", venue:"Kansas City" },
  { id:"m059", home:"Paraguay",      away:"Australia",       kickoff:"2026-06-25T23:00:00", group:"Grupo D", venue:"San Francisco" },
  { id:"m060", home:"Turquía",       away:"Estados Unidos",  kickoff:"2026-06-25T23:00:00", group:"Grupo D", venue:"Los Ángeles" },
  // VIERNES 26/06
  { id:"m061", home:"Noruega",       away:"Francia",         kickoff:"2026-06-26T16:00:00", group:"Grupo I", venue:"Boston" },
  { id:"m062", home:"Senegal",       away:"Irak",            kickoff:"2026-06-26T16:00:00", group:"Grupo I", venue:"Toronto" },
  { id:"m063", home:"Cabo Verde",    away:"Arabia Saudita",  kickoff:"2026-06-26T21:00:00", group:"Grupo H", venue:"Houston" },
  { id:"m064", home:"Uruguay",       away:"España",          kickoff:"2026-06-26T21:00:00", group:"Grupo H", venue:"Guadalajara" },
  { id:"m065", home:"Egipto",        away:"Irán",            kickoff:"2026-06-27T00:00:00", group:"Grupo G", venue:"Seattle" },
  { id:"m066", home:"Nueva Zelanda", away:"Bélgica",         kickoff:"2026-06-27T00:00:00", group:"Grupo G", venue:"Vancouver" },
  // SÁBADO 27/06
  { id:"m067", home:"Croacia",       away:"Ghana",           kickoff:"2026-06-27T18:00:00", group:"Grupo L", venue:"Philadelphia" },
  { id:"m068", home:"Panamá",        away:"Inglaterra",      kickoff:"2026-06-27T18:00:00", group:"Grupo L", venue:"Nueva Jersey" },
  { id:"m069", home:"Colombia",      away:"Portugal",        kickoff:"2026-06-27T20:30:00", group:"Grupo K", venue:"Miami" },
  { id:"m070", home:"RD Congo",      away:"Uzbekistán",      kickoff:"2026-06-27T20:30:00", group:"Grupo K", venue:"Atlanta" },
  { id:"m071", home:"Argelia",       away:"Austria",         kickoff:"2026-06-27T23:00:00", group:"Grupo J", venue:"Kansas City" },
  { id:"m072", home:"Jordania",      away:"Argentina",       kickoff:"2026-06-27T23:00:00", group:"Grupo J", venue:"Dallas" },
];

const ADMIN_TOKEN = "admin2026";

function calcPoints(pred, result) {
  if (!pred || !result) return 0;
  const ph = Number(pred.home), pa = Number(pred.away);
  const rh = Number(result.home), ra = Number(result.away);
  if (isNaN(ph)||isNaN(pa)||isNaN(rh)||isNaN(ra)) return 0;
  if (ph===rh && pa===ra) return 6;
  const po = ph>pa?"H":ph<pa?"A":"D", ro = rh>ra?"H":rh<ra?"A":"D";
  if (po===ro) return 3;
  return 0;
}

function getMatchStatus(kickoff) {
  const now = new Date(), ko = new Date(kickoff);
  const diff = (ko-now)/60000;
  if (diff > 10) return "upcoming";
  if (diff > -100) return "live";
  return "finished";
}

function fmt(kickoff) {
  const d = new Date(kickoff);
  return d.toLocaleDateString("es-AR",{weekday:"short",day:"2-digit",month:"short"})+" "+
         d.toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"});
}

// ============================================================
// CSS
// ============================================================
const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#07090f;--surface:#0f1520;--surface2:#161e30;--border:#1e2d47;
  --accent:#f5a623;--red:#e8380d;--green:#22c55e;--text:#dde3f0;--muted:#5a6a8a;--gold:#ffd700;
}
body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;min-height:100vh}
.app{max-width:480px;margin:0 auto;min-height:100vh;padding-bottom:76px}

/* HEADER */
.hdr{background:linear-gradient(135deg,#07090f 0%,#150820 100%);padding:16px 16px 12px;border-bottom:2px solid var(--accent);position:sticky;top:0;z-index:100}
.hdr-row{display:flex;align-items:center;justify-content:space-between}
.logo{font-family:'Bebas Neue',sans-serif;font-size:26px;letter-spacing:3px;color:var(--accent);line-height:1}
.logo em{color:#fff;font-style:normal}
.chip{background:var(--surface2);border:1px solid var(--border);border-radius:20px;padding:4px 12px;font-size:12px;font-weight:600;color:var(--accent)}
.logout{background:none;border:none;color:var(--muted);font-size:11px;cursor:pointer;padding:4px}

/* TABS */
.tabs{display:flex;gap:4px;margin-top:12px}
.tb{flex:1;padding:7px 4px;border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;cursor:pointer;transition:all .2s;text-transform:uppercase;letter-spacing:.5px;background:var(--surface2);color:var(--muted)}
.tb.on{background:var(--accent);color:#000}

/* BOTTOM NAV */
.bnav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;background:var(--surface);border-top:1px solid var(--border);display:flex;padding:6px 0 10px;z-index:100}
.bi{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;background:none;border:none;cursor:pointer;color:var(--muted);font-size:10px;font-family:'DM Sans',sans-serif;font-weight:600;text-transform:uppercase;padding:4px 0;transition:color .2s}
.bi.on{color:var(--accent)}
.bi-ico{font-size:19px}

/* SECTIONS */
.sec{padding:14px 14px 0}
.stitle{font-family:'Bebas Neue',sans-serif;font-size:19px;letter-spacing:1.5px;color:var(--accent);margin-bottom:12px}

/* MATCH CARD */
.mc{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:13px;margin-bottom:10px;transition:border-color .2s}
.mc:hover{border-color:rgba(245,166,35,.4)}
.mc-meta{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.mc-grp{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:1px}
.mc-time{font-size:11px;color:var(--accent);font-weight:600}
.mc-teams{display:flex;align-items:center;justify-content:space-between;gap:6px}
.tn{font-size:14px;font-weight:600;flex:1}
.tn.r{text-align:right}
.vs{font-family:'Bebas Neue',sans-serif;font-size:15px;color:var(--muted);min-width:28px;text-align:center}
.venue{font-size:10px;color:var(--muted);margin-top:4px;text-align:center}

/* BADGES */
.bdg{display:inline-block;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-top:6px}
.bdg-up{background:rgba(245,166,35,.12);color:var(--accent);border:1px solid rgba(245,166,35,.4)}
.bdg-lv{background:rgba(232,56,13,.15);color:var(--red);border:1px solid var(--red);animation:pulse 1.5s infinite}
.bdg-fn{background:rgba(34,197,94,.12);color:var(--green);border:1px solid rgba(34,197,94,.4)}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}

/* RESULT DISPLAY */
.res-big{font-family:'Bebas Neue',sans-serif;font-size:30px;text-align:center;letter-spacing:6px;margin-top:8px;color:var(--text)}

/* SCORE INPUT */
.si-row{display:flex;align-items:center;gap:7px;margin-top:10px}
.si{width:50px;height:42px;background:var(--surface2);border:2px solid var(--border);border-radius:8px;color:var(--text);font-family:'Bebas Neue',sans-serif;font-size:22px;text-align:center;outline:none;transition:border-color .2s;-moz-appearance:textfield}
.si::-webkit-outer-spin-button,.si::-webkit-inner-spin-button{-webkit-appearance:none}
.si:focus{border-color:var(--accent)}
.si:disabled{opacity:.35;cursor:not-allowed}
.si-sep{font-family:'Bebas Neue',sans-serif;font-size:20px;color:var(--muted)}
.sbtn{flex:1;padding:9px;background:var(--accent);color:#000;border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-weight:700;font-size:12px;cursor:pointer;transition:opacity .2s;text-transform:uppercase}
.sbtn:hover{opacity:.85}
.sbtn:disabled{opacity:.3;cursor:not-allowed}
.sbtn.ok{background:var(--green)}

/* PREDICTION INFO */
.my-pred{font-size:12px;color:var(--green);margin-top:6px;font-weight:600}
.locked{font-size:11px;color:var(--red);font-weight:600;margin-top:6px}
.pts-chip{display:flex;align-items:center;gap:5px;margin-top:8px;padding:5px 9px;background:var(--surface2);border-radius:7px;border:1px solid var(--border);width:fit-content}
.pts-val{font-family:'Bebas Neue',sans-serif;font-size:20px;color:var(--gold)}
.pts-lbl{font-size:10px;color:var(--muted);text-transform:uppercase}

/* GROUP FILTER */
.gf{display:flex;gap:5px;overflow-x:auto;padding-bottom:6px;margin-bottom:12px;scrollbar-width:none}
.gf::-webkit-scrollbar{display:none}
.gfb{flex-shrink:0;padding:5px 10px;border-radius:20px;border:1px solid var(--border);background:var(--surface2);color:var(--muted);font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap;transition:all .2s}
.gfb.on{background:var(--accent);color:#000;border-color:var(--accent)}

/* LEADERBOARD */
.lb-row{display:flex;align-items:center;gap:11px;padding:11px 13px;background:var(--surface);border:1px solid var(--border);border-radius:10px;margin-bottom:7px;transition:all .2s}
.lb-row.me{border-color:var(--accent);background:rgba(245,166,35,.06)}
.lb-pos{font-family:'Bebas Neue',sans-serif;font-size:20px;color:var(--muted);min-width:26px}
.lb-pos.g1{color:var(--gold)}.lb-pos.g2{color:#c0c0c0}.lb-pos.g3{color:#cd7f32}
.lb-name{flex:1;font-weight:600;font-size:14px}
.lb-pts{font-family:'Bebas Neue',sans-serif;font-size:22px;color:var(--accent)}
.lb-ptsl{font-size:10px;color:var(--muted)}

/* STATS */
.stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:16px}
.stat-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:13px 14px}
.stat-val{font-family:'Bebas Neue',sans-serif;font-size:32px}
.stat-lbl{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.3px}

/* ADMIN */
.adm-sec{padding:14px}
.adm-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:13px;margin-bottom:10px}
.adm-title{font-family:'Bebas Neue',sans-serif;font-size:14px;color:var(--red);margin-bottom:8px;text-transform:uppercase;letter-spacing:1px}
.ri{width:44px;height:36px;background:var(--surface2);border:2px solid var(--border);border-radius:6px;color:var(--text);font-family:'Bebas Neue',sans-serif;font-size:19px;text-align:center;outline:none;-moz-appearance:textfield}
.ri::-webkit-outer-spin-button,.ri::-webkit-inner-spin-button{-webkit-appearance:none}
.ri:focus{border-color:var(--red)}
.cbtn{width:100%;padding:9px;background:var(--red);color:#fff;border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-weight:700;font-size:12px;cursor:pointer;margin-top:6px;text-transform:uppercase}
.cbtn:hover{opacity:.85}

/* LINKS */
.lcard{background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:10px 12px;margin-bottom:7px}
.lname{font-weight:600;font-size:13px;margin-bottom:4px}
.lurl{font-size:10px;color:var(--muted);word-break:break-all;font-family:monospace;margin-top:2px}
.copybtn{padding:4px 10px;background:var(--surface);border:1px solid var(--border);border-radius:6px;color:var(--accent);font-size:10px;cursor:pointer;margin-top:6px;font-weight:700}
.copybtn:hover{border-color:var(--accent)}
.ne-row{display:flex;align-items:center;gap:7px;margin-bottom:5px}
.ne-inp{background:var(--surface2);border:2px solid var(--accent);border-radius:6px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:13px;padding:5px 9px;width:120px;outline:none}
.ne-btn{padding:4px 9px;background:var(--accent);border:none;border-radius:6px;color:#000;font-size:11px;cursor:pointer;font-weight:700}

/* PRED GRID */
.pg{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:8px}
.pg-item{background:var(--surface2);border-radius:6px;padding:5px 9px}
.pg-name{font-size:10px;color:var(--muted)}
.pg-score{font-family:'Bebas Neue',sans-serif;font-size:17px}
.pg-ok{color:var(--green)}.pg-par{color:var(--accent)}

/* LOGIN */
.login{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px 20px;background:linear-gradient(160deg,#07090f 0%,#150820 100%)}
.login-logo{font-family:'Bebas Neue',sans-serif;font-size:54px;letter-spacing:5px;color:var(--accent);text-align:center;line-height:1;margin-bottom:6px}
.login-sub{font-size:13px;color:var(--muted);text-align:center;margin-bottom:36px;text-transform:uppercase;letter-spacing:2px}
.login-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:26px 22px;width:100%;max-width:340px}
.login-lbl{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:7px}
.login-inp{width:100%;padding:11px 13px;background:var(--surface2);border:2px solid var(--border);border-radius:8px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:16px;outline:none;margin-bottom:14px;transition:border-color .2s}
.login-inp:focus{border-color:var(--accent)}
.login-btn{width:100%;padding:13px;background:var(--accent);color:#000;border:none;border-radius:8px;font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:2px;cursor:pointer;transition:opacity .2s}
.login-btn:hover{opacity:.85}
.login-err{color:var(--red);font-size:12px;margin-top:7px;text-align:center}

/* TOAST */
.toast{position:fixed;bottom:86px;left:50%;transform:translateX(-50%);background:var(--green);color:#000;padding:9px 18px;border-radius:20px;font-weight:700;font-size:12px;z-index:300;animation:tin .3s ease;white-space:nowrap}
@keyframes tin{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}

.empty{text-align:center;color:var(--muted);padding:36px 20px;font-size:13px}
`;

// ============================================================
// APP
// ============================================================
export default function App() {
  const [players, setPlayers]       = useState(null);
  const [matches]                    = useState(INITIAL_MATCHES);
  const [preds, setPreds]           = useState(null);
  const [results, setResults]       = useState(null);
  const [user, setUser]             = useState(null);
  const [tab, setTab]               = useState("matches");
  const [toast, setToast]           = useState("");
  const [loaded, setLoaded]         = useState(false);

  useEffect(()=>{
    (async()=>{
      const [p,pr,r] = await Promise.all([
        storageGet("prode_players"), storageGet("prode_preds"), storageGet("prode_results")
      ]);
      setPlayers(p||INITIAL_PLAYERS);
      setPreds(pr||{});
      setResults(r||{});
      setLoaded(true);
    })();
  },[]);

  useEffect(()=>{ if(players) storageSet("prode_players",players); },[players]);
  useEffect(()=>{ if(preds)   storageSet("prode_preds",preds); },[preds]);
  useEffect(()=>{ if(results) storageSet("prode_results",results); },[results]);

  function showToast(m){ setToast(m); setTimeout(()=>setToast(""),2500); }

  function login(token){
    if(token===ADMIN_TOKEN){ setUser({id:"admin",name:"Admin"}); return true; }
    const p=players.find(x=>x.token===token.trim());
    if(p){ setUser(p); return true; }
    return false;
  }

  function leaderboard(){
    return players.map(p=>({
      ...p,
      pts: matches.reduce((acc,m)=>acc+calcPoints(preds[`${m.id}_${p.id}`],results[m.id]),0)
    })).sort((a,b)=>b.pts-a.pts);
  }

  if(!loaded) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#07090f",color:"#f5a623",fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:2}}>Cargando…</div>;

  if(!user) return <><style>{css}</style><Login onLogin={login}/></>;

  const isAdmin = user.id==="admin";

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <Header user={user} isAdmin={isAdmin} onLogout={()=>setUser(null)}/>
        {isAdmin ? (
          <AdminPanel matches={matches} players={players} preds={preds} results={results}
            setResults={setResults} setPlayers={setPlayers} showToast={showToast}/>
        ):(
          <>
            {tab==="matches" && <MatchesTab matches={matches} preds={preds} setPreds={setPreds} results={results} user={user} showToast={showToast}/>}
            {tab==="table"   && <TableTab lb={leaderboard()} user={user}/>}
            {tab==="stats"   && <StatsTab matches={matches} preds={preds} results={results} user={user}/>}
            <BottomNav tab={tab} setTab={setTab}/>
          </>
        )}
        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}

// LOGIN
function Login({onLogin}){
  const [tok,setTok]=useState(""); const [err,setErr]=useState("");
  return(
    <div className="login">
      <div className="login-logo">PRODE<em>⚽</em>26</div>
      <div className="login-sub">Mundial USA · México · Canadá</div>
      <div className="login-card">
        <div className="login-lbl">Ingresá tu token</div>
        <input className="login-inp" placeholder="ej: leo7x" value={tok}
          onChange={e=>{setTok(e.target.value);setErr("");}}
          onKeyDown={e=>e.key==="Enter"&&(!onLogin(tok)&&setErr("Token inválido"))}
          autoCapitalize="none" autoCorrect="off"/>
        <button className="login-btn" onClick={()=>!onLogin(tok)&&setErr("Token inválido. Pedíselo al admin.")}>
          ENTRAR
        </button>
        {err&&<div className="login-err">{err}</div>}
      </div>
      <div style={{marginTop:20,fontSize:11,color:"#2a3550",textAlign:"center"}}>Tu token está en el link que te mandó el admin</div>
    </div>
  );
}

// HEADER
function Header({user,isAdmin,onLogout}){
  return(
    <div className="hdr">
      <div className="hdr-row">
        <div className="logo">PRODE<em>⚽</em>26</div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div className="chip">{isAdmin?"🔧 ADMIN":user.name}</div>
          <button className="logout" onClick={onLogout}>salir</button>
        </div>
      </div>
    </div>
  );
}

// BOTTOM NAV
function BottomNav({tab,setTab}){
  return(
    <nav className="bnav">
      {[{id:"matches",ico:"⚽",lbl:"Partidos"},{id:"table",ico:"🏆",lbl:"Tabla"},{id:"stats",ico:"📊",lbl:"Mis stats"}].map(t=>(
        <button key={t.id} className={`bi ${tab===t.id?"on":""}`} onClick={()=>setTab(t.id)}>
          <span className="bi-ico">{t.ico}</span>{t.lbl}
        </button>
      ))}
    </nav>
  );
}

// MATCHES TAB
function MatchesTab({matches,preds,setPreds,results,user,showToast}){
  const [local,setLocal]=useState({});
  const [saved,setSaved]=useState({});
  const [grp,setGrp]=useState("Todos");

  const groups=["Todos",...[...new Set(matches.map(m=>m.group))]];
  const filtered = grp==="Todos" ? matches : matches.filter(m=>m.group===grp);

  function inp(mid,side,v){ setLocal(p=>({...p,[`${mid}_${side}`]:v.replace(/\D/,"").slice(0,2)})); }

  function save(mid){
    const h=local[`${mid}_home`]??preds[`${mid}_${user.id}`]?.home??"";
    const a=local[`${mid}_away`]??preds[`${mid}_${user.id}`]?.away??"";
    if(h===""||a===""){ showToast("⚠️ Completá ambos goles"); return; }
    setPreds(p=>({...p,[`${mid}_${user.id}`]:{home:Number(h),away:Number(a)}}));
    setSaved(s=>({...s,[mid]:true})); setTimeout(()=>setSaved(s=>({...s,[mid]:false})),2000);
    showToast("✅ Pronóstico guardado");
  }

  return(
    <div className="sec">
      <div className="stitle">Partidos</div>
      <div className="gf">
        {groups.map(g=>(
          <button key={g} className={`gfb ${grp===g?"on":""}`} onClick={()=>setGrp(g)}>{g}</button>
        ))}
      </div>
      {filtered.map(m=>{
        const st=getMatchStatus(m.kickoff);
        const pred=preds[`${m.id}_${user.id}`];
        const res=results[m.id];
        const pts=calcPoints(pred,res);
        const hv=local[`${m.id}_home`]!==undefined?local[`${m.id}_home`]:(pred?.home??"");
        const av=local[`${m.id}_away`]!==undefined?local[`${m.id}_away`]:(pred?.away??"");
        return(
          <div key={m.id} className="mc">
            <div className="mc-meta">
              <span className="mc-grp">{m.group}</span>
              <span className="mc-time">{fmt(m.kickoff)}</span>
            </div>
            <div className="mc-teams">
              <span className="tn">{m.home}</span>
              <span className="vs">VS</span>
              <span className="tn r">{m.away}</span>
            </div>
            <div className="venue">{m.venue}</div>
            <div>
              {st==="upcoming"&&<span className="bdg bdg-up">Abierto</span>}
              {st==="live"    &&<span className="bdg bdg-lv">● En vivo</span>}
              {st==="finished"&&<span className="bdg bdg-fn">Finalizado</span>}
            </div>
            {res!==undefined&&<div className="res-big">{res.home} — {res.away}</div>}
            {st==="upcoming"&&(
              <div className="si-row">
                <input className="si" type="number" placeholder="—" value={hv} onChange={e=>inp(m.id,"home",e.target.value)}/>
                <span className="si-sep">:</span>
                <input className="si" type="number" placeholder="—" value={av} onChange={e=>inp(m.id,"away",e.target.value)}/>
                <button className={`sbtn${saved[m.id]?" ok":""}`} onClick={()=>save(m.id)}>
                  {saved[m.id]?"✓ Guardado":pred?"Actualizar":"Guardar"}
                </button>
              </div>
            )}
            {st!=="upcoming"&&!pred&&<div className="locked">🔒 No ingresaste pronóstico</div>}
            {pred&&<div className="my-pred">Tu pronóstico: {pred.home} - {pred.away}{res!==undefined&&<span style={{marginLeft:8}}>{pts===6?"🎯 +6 pts":pts===3?"✅ +3 pts":"❌ 0 pts"}</span>}</div>}
            {res!==undefined&&pred&&<div className="pts-chip"><span className="pts-val">{pts}</span><span className="pts-lbl">pts este partido</span></div>}
          </div>
        );
      })}
    </div>
  );
}

// TABLE TAB
function TableTab({lb,user}){
  return(
    <div className="sec">
      <div className="stitle">🏆 Tabla de posiciones</div>
      {lb.map((p,i)=>(
        <div key={p.id} className={`lb-row ${p.id===user.id?"me":""}`}>
          <span className={`lb-pos ${i===0?"g1":i===1?"g2":i===2?"g3":""}`}>
            {i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}
          </span>
          <span className="lb-name">{p.name}{p.id===user.id&&<span style={{color:"var(--accent)",fontSize:10,marginLeft:6}}>← vos</span>}</span>
          <div style={{textAlign:"right"}}><div className="lb-pts">{p.pts}</div><div className="lb-ptsl">pts</div></div>
        </div>
      ))}
    </div>
  );
}

// STATS TAB
function StatsTab({matches,preds,results,user}){
  const played=matches.filter(m=>results[m.id]!==undefined);
  const mine=played.filter(m=>preds[`${m.id}_${user.id}`]);
  const exact=mine.filter(m=>calcPoints(preds[`${m.id}_${user.id}`],results[m.id])===6);
  const part=mine.filter(m=>calcPoints(preds[`${m.id}_${user.id}`],results[m.id])===3);
  const miss=mine.filter(m=>calcPoints(preds[`${m.id}_${user.id}`],results[m.id])===0);
  const total=exact.length*6+part.length*3;
  const pct=mine.length>0?Math.round((exact.length+part.length)/mine.length*100):0;
  return(
    <div className="sec">
      <div className="stitle">📊 Mis estadísticas</div>
      <div className="stat-grid">
        {[{l:"Total puntos",v:total,c:"var(--gold)"},{l:"Exactos 🎯",v:exact.length,c:"var(--green)"},{l:"Ganador ✅",v:part.length,c:"var(--accent)"},{l:"Errores ❌",v:miss.length,c:"var(--red)"},{l:"Partidos jugados",v:mine.length,c:"var(--text)"},{l:"% acierto",v:pct+"%",c:"#a78bfa)"}].map(s=>(
          <div key={s.l} className="stat-card"><div className="stat-val" style={{color:s.c}}>{s.v}</div><div className="stat-lbl">{s.l}</div></div>
        ))}
      </div>
      {played.length===0&&<div className="empty">Sin resultados cargados todavía. ¡Volvé cuando arranque el mundial!</div>}
    </div>
  );
}

// ADMIN PANEL
function AdminPanel({matches,players,preds,results,setResults,setPlayers,showToast}){
  const [at,setAt]=useState("results");
  const [lr,setLr]=useState({});
  const [editing,setEditing]=useState(null);
  const [nv,setNv]=useState("");
  const [grp,setGrp]=useState("Todos");

  function saveRes(mid){
    const h=lr[`${mid}_h`],a=lr[`${mid}_a`];
    if(h===undefined||h===""||a===undefined||a===""){ showToast("⚠️ Completá ambos goles"); return; }
    setResults(p=>({...p,[mid]:{home:Number(h),away:Number(a)}}));
    showToast("✅ Resultado guardado");
  }

  function saveName(pid){
    if(!nv.trim()) return;
    setPlayers(p=>p.map(x=>x.id===pid?{...x,name:nv.trim()}:x));
    setEditing(null); showToast("✅ Nombre actualizado");
  }

  const BASE=window.location.href.split("?")[0];
  const groups=["Todos",...[...new Set(matches.map(m=>m.group))]];
  const fmatches=grp==="Todos"?matches:matches.filter(m=>m.group===grp);

  return(
    <div className="adm-sec">
      <div style={{display:"flex",gap:6,margin:"12px 0"}}>
        {[{id:"results",l:"Resultados"},{id:"links",l:"Links"},{id:"all",l:"Pronósticos"}].map(t=>(
          <button key={t.id} onClick={()=>setAt(t.id)} style={{flex:1,padding:"7px 4px",border:"none",borderRadius:8,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:700,textTransform:"uppercase",background:at===t.id?"var(--red)":"var(--surface2)",color:at===t.id?"#fff":"var(--muted)"}}>
            {t.l}
          </button>
        ))}
      </div>

      {at==="results"&&(
        <>
          <div className="stitle" style={{color:"var(--red)"}}>Cargar resultados</div>
          <div className="gf">
            {groups.map(g=><button key={g} className={`gfb ${grp===g?"on":""}`} onClick={()=>setGrp(g)}>{g}</button>)}
          </div>
          {fmatches.map(m=>{
            const ex=results[m.id];
            const hv=lr[`${m.id}_h`]!==undefined?lr[`${m.id}_h`]:(ex?.home??"");
            const av=lr[`${m.id}_a`]!==undefined?lr[`${m.id}_a`]:(ex?.away??"");
            return(
              <div key={m.id} className="adm-card">
                <div className="adm-title">{m.home} vs {m.away}</div>
                <div style={{fontSize:10,color:"var(--muted)",marginBottom:8}}>{m.group} · {fmt(m.kickoff)}</div>
                <div style={{display:"flex",alignItems:"center",gap:7}}>
                  <span style={{flex:1,fontSize:12,fontWeight:600}}>{m.home}</span>
                  <input className="ri" type="number" placeholder="—" value={hv} onChange={e=>setLr(p=>({...p,[`${m.id}_h`]:e.target.value.replace(/\D/,"").slice(0,2)}))}/>
                  <span style={{fontFamily:"'Bebas Neue',sans-serif",color:"var(--muted)"}}>—</span>
                  <input className="ri" type="number" placeholder="—" value={av} onChange={e=>setLr(p=>({...p,[`${m.id}_a`]:e.target.value.replace(/\D/,"").slice(0,2)}))}/>
                  <span style={{flex:1,fontSize:12,fontWeight:600,textAlign:"right"}}>{m.away}</span>
                </div>
                <button className="cbtn" onClick={()=>saveRes(m.id)}>{ex?"Actualizar":"Guardar resultado"}</button>
              </div>
            );
          })}
        </>
      )}

      {at==="links"&&(
        <>
          <div className="stitle" style={{color:"var(--red)"}}>Links de jugadores</div>
          <div style={{fontSize:11,color:"var(--muted)",marginBottom:12}}>Mandá el link único a cada jugador. Ese es su acceso.</div>
          {players.map(p=>(
            <div key={p.id} className="lcard">
              <div className="ne-row">
                {editing===p.id?(
                  <><input className="ne-inp" value={nv} onChange={e=>setNv(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveName(p.id)} autoFocus/>
                  <button className="ne-btn" onClick={()=>saveName(p.id)}>OK</button>
                  <button className="ne-btn" style={{background:"var(--surface2)",color:"var(--muted)"}} onClick={()=>setEditing(null)}>✕</button></>
                ):(
                  <><span className="lname">🙋 {p.name}</span>
                  <button className="ne-btn" style={{background:"var(--surface2)",color:"var(--accent)",fontSize:10}} onClick={()=>{setEditing(p.id);setNv(p.name);}}>✏️</button></>
                )}
              </div>
              <div className="lurl">Token: <strong style={{color:"var(--accent)"}}>{p.token}</strong></div>
              <div className="lurl">Link: {BASE}?t={p.token}</div>
              <button className="copybtn" onClick={()=>{navigator.clipboard.writeText(`${BASE}?t=${p.token}`);showToast(`📋 Link de ${p.name} copiado`);}}>📋 Copiar link</button>
            </div>
          ))}
        </>
      )}

      {at==="all"&&(
        <>
          <div className="stitle" style={{color:"var(--red)"}}>Todos los pronósticos</div>
          <div className="gf">
            {groups.map(g=><button key={g} className={`gfb ${grp===g?"on":""}`} onClick={()=>setGrp(g)}>{g}</button>)}
          </div>
          {fmatches.map(m=>{
            const st=getMatchStatus(m.kickoff);
            const res=results[m.id];
            return(
              <div key={m.id} className="adm-card">
                <div className="adm-title">{m.home} vs {m.away}</div>
                <div style={{fontSize:10,color:"var(--muted)",marginBottom:6}}>{fmt(m.kickoff)}</div>
                {st==="upcoming"?(
                  <div style={{fontSize:11,color:"var(--muted)"}}>🔒 Pronósticos ocultos hasta que empiece</div>
                ):(
                  <div className="pg">
                    {players.map(p=>{
                      const pred=preds[`${m.id}_${p.id}`];
                      const pts=calcPoints(pred,res);
                      return(
                        <div key={p.id} className="pg-item">
                          <div className="pg-name">{p.name}</div>
                          {pred?(
                            <div className={`pg-score ${res?(pts===6?"pg-ok":pts===3?"pg-par":""):""}`}>
                              {pred.home}-{pred.away} {res?(pts===6?"🎯":pts===3?"✅":"❌"):""}
                            </div>
                          ):<div style={{fontSize:12,color:"var(--border)"}}>—</div>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
