import { getStore } from "@netlify/blobs";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const MAX_ENTRIES = 10;
const STORE_KEY   = "leaderboard";

export default async function handler(req) {
  // Preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  const store = getStore("trivia-leaderboard");

  // ── GET: return top 10 ──────────────────────────────────────────────────
  if (req.method === "GET") {
    try {
      const raw = await store.get(STORE_KEY);
      const entries = raw ? JSON.parse(raw) : [];
      return new Response(JSON.stringify({ entries }), {
        status: 200,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(JSON.stringify({ entries: [] }), {
        status: 200,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }
  }

  // ── POST: submit a score ────────────────────────────────────────────────
  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const { name, score, time, category, difficulty } = body;

    // Basic validation
    if (
      typeof name     !== "string" || name.trim().length === 0 ||
      typeof score    !== "number" || score < 0 || score > 10  ||
      typeof time     !== "number" || time  < 0
    ) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const newEntry = {
      name:       name.trim().slice(0, 30),
      score,
      time,           // seconds, lower is better
      category:   category  || "Unknown",
      difficulty: difficulty || "any",
      date:       new Date().toISOString(),
    };

    // Load existing, append, sort, trim to top 10
    let entries = [];
    try {
      const raw = await store.get(STORE_KEY);
      entries = raw ? JSON.parse(raw) : [];
    } catch { entries = []; }

    entries.push(newEntry);

    // Sort: higher score first; ties broken by lower time
    entries.sort((a, b) =>
      b.score !== a.score ? b.score - a.score : a.time - b.time
    );

    entries = entries.slice(0, MAX_ENTRIES);

    await store.set(STORE_KEY, JSON.stringify(entries));

    // Find rank of newly submitted entry (1-based)
    const rank = entries.findIndex(
      e => e.name === newEntry.name &&
           e.score === newEntry.score &&
           e.time  === newEntry.time  &&
           e.date  === newEntry.date
    ) + 1;

    return new Response(JSON.stringify({ entries, rank }), {
      status: 200,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  return new Response("Method not allowed", { status: 405, headers: CORS });
}

export const config = { path: "/leaderboard" };
