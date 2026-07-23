import { useState, type FormEvent } from 'react';
import { Send, Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function InquiryForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    setStatus('submitting');
    setError('');
    try {
      const res = await fetch('/api/preventivo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? 'Invio non riuscito. Riprova tra poco.');
      }
      setStatus('success');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Errore imprevisto.');
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="glass rounded-2xl p-8 text-center">
        <CheckCircle2 className="mx-auto text-tropic-bright" size={40} strokeWidth={1.4} />
        <h3 className="mt-4 font-display text-2xl font-semibold text-ink">
          Richiesta inviata
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
          Grazie. Leggiamo ogni messaggio con cura e rispondiamo entro due
          giorni lavorativi con una prima proposta.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-tropic-bright hover:underline"
        >
          Invia un’altra richiesta
          <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  const busy = status === 'submitting';

  return (
    <form onSubmit={onSubmit} className="glass rounded-2xl p-6 sm:p-8" noValidate>
      {/* honeypot anti-spam (nascosto agli utenti) */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="sr-only"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nome" className="mb-1.5 block text-sm text-ink-soft">
            Nome <span className="text-tropic-bright">*</span>
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            required
            autoComplete="name"
            disabled={busy}
            className="w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-ink placeholder:text-ink-mute focus:border-tropic focus:outline-none focus:ring-2 focus:ring-tropic/30 disabled:opacity-50"
            placeholder="Come ti chiami"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-ink-soft">
            Email <span className="text-tropic-bright">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            disabled={busy}
            className="w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-ink placeholder:text-ink-mute focus:border-tropic focus:outline-none focus:ring-2 focus:ring-tropic/30 disabled:opacity-50"
            placeholder="dove ti scriviamo"
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="messaggio" className="mb-1.5 block text-sm text-ink-soft">
          Il tuo progetto <span className="text-tropic-bright">*</span>
        </label>
        <textarea
          id="messaggio"
          name="messaggio"
          required
          rows={4}
          disabled={busy}
          className="w-full resize-y rounded-lg border border-line bg-surface px-3.5 py-2.5 text-ink placeholder:text-ink-mute focus:border-tropic focus:outline-none focus:ring-2 focus:ring-tropic/30 disabled:opacity-50"
          placeholder="Bioma, spazio a disposizione, atmosfera che immagini…"
        ></textarea>
      </div>

      {status === 'error' && (
        <p
          role="alert"
          className="mt-4 flex items-center gap-2 text-sm text-arid-bright"
        >
          <AlertCircle size={16} />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-tropic px-6 py-3 font-semibold text-bg-deep transition-colors hover:bg-tropic-bright disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {busy ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Invio in corso…
          </>
        ) : (
          <>
            <Send size={18} />
            Richiedi il tuo terrario
          </>
        )}
      </button>

      <p className="mt-3 text-xs text-ink-mute">
        Nessuna newsletter, nessuno spam: usiamo i tuoi dati solo per risponderti.
      </p>
    </form>
  );
}
