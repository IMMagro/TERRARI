export const prerender = false;

import type { APIRoute } from 'astro';
import { z } from 'astro:schema';
import { Resend } from 'resend';

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const schema = z.object({
  nome: z.string().min(1, 'Il nome è obbligatorio.').max(120),
  email: z
    .string()
    .min(1, 'L’email è obbligatoria.')
    .max(200)
    .refine((v) => emailRe.test(v), 'Inserisci un’email valida.'),
  messaggio: z.string().min(1, 'Descrivi il tuo progetto.').max(4000),
  // Campi opzionali (pre-popolati dal configuratore della gallery, uso futuro)
  modello: z.string().max(200).optional(),
  biome: z.string().max(60).optional(),
  // Honeypot anti-spam: deve restare vuoto.
  website: z.string().optional(),
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request }) => {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, error: 'Richiesta non valida.' }, 400);
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? 'Dati non validi.';
    return json({ ok: false, error: first }, 422);
  }

  const { nome, email, messaggio, modello, biome, website } = parsed.data;

  // Bot: honeypot compilato → fingi successo senza inviare nulla.
  if (website && website.trim() !== '') {
    return json({ ok: true });
  }

  const key = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.CONTACT_TO_EMAIL || 'studio@terrari.example';

  // Fallback di sviluppo: senza chiave non invia, logga soltanto.
  if (!key) {
    console.log('[preventivo] dev fallback (nessuna RESEND_API_KEY):', {
      nome,
      email,
      modello,
      biome,
      messaggio,
    });
    return json({ ok: true, dev: true });
  }

  try {
    const resend = new Resend(key);
    const dettaglio = [
      modello ? `Modello di partenza: ${modello}` : null,
      biome ? `Bioma: ${biome}` : null,
      '',
      messaggio,
    ]
      .filter((l) => l !== null)
      .join('\n');

    const { error } = await resend.emails.send({
      // TODO: sostituire con un mittente su dominio verificato al deploy.
      from: 'Terrari <onboarding@resend.dev>',
      to: [to],
      replyTo: email,
      subject: `Nuova richiesta di preventivo — ${nome}`,
      text: `Da: ${nome} <${email}>\n\n${dettaglio}`,
    });

    if (error) {
      console.error('[preventivo] Resend error:', error);
      return json(
        { ok: false, error: 'Invio non riuscito. Riprova tra poco.' },
        502,
      );
    }
    return json({ ok: true });
  } catch (err) {
    console.error('[preventivo] errore server:', err);
    return json({ ok: false, error: 'Errore del server. Riprova più tardi.' }, 500);
  }
};
