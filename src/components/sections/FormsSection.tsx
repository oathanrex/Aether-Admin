import { useEffect, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from 'react';
import { CheckCircle2, Eye, EyeOff, Lock, Mail, Search, UploadCloud } from 'lucide-react';
import { assessPasswordStrength, validateEmailAddress } from '../../utils/dashboardLogic.ts';

interface FormsSectionProps {
  onAnnounce: (msg: string) => void;
}

const SWATCHES = [
  { name: 'Violet', hex: '#8b7bff' },
  { name: 'Coral', hex: '#ff5a7a' },
  { name: 'Lagoon', hex: '#2ec4d6' },
  { name: 'Amber', hex: '#ffc53d' },
];

export function FormsSection({ onAnnounce }: FormsSectionProps) {
  const [fullName, setFullName] = useState('Elena Vance');
  const [email, setEmail] = useState('elena@aether.dev');
  const [emailTouched, setEmailTouched] = useState(false);
  const [password, setPassword] = useState('AuraSecurePassword982!');
  const [showPw, setShowPw] = useState(false);
  const [region, setRegion] = useState('us-east-1');
  const [zoneList, setZoneList] = useState('Frankfurt (eu-central-1)');
  const [urlVal, setUrlVal] = useState('https://admin.aether.dev');
  const [telVal, setTelVal] = useState('+1 (415) 555-0194');
  const [dateVal, setDateVal] = useState('2025-05-12');
  const [timeVal, setTimeVal] = useState('14:30');
  const [accentHex, setAccentHex] = useState('#8b7bff');
  const [waveBlur, setWaveBlur] = useState(68);
  const [nodeCount, setNodeCount] = useState(4);
  const [notes, setNotes] = useState('Deploy zero-downtime canary policy across edge nodes.');
  const [selectedTier, setSelectedTier] = useState<'starter' | 'pro' | 'enterprise'>('pro');
  const [rating, setRating] = useState(4);
  const [swatch, setSwatch] = useState(SWATCHES[0]);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; sizeKb: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState<string | null>(null);

  // Indeterminate checkbox group state
  const [perms, setPerms] = useState({ read: true, write: true, deploy: false });
  const parentCheckRef = useRef<HTMLInputElement | null>(null);

  const allChecked = perms.read && perms.write && perms.deploy;
  const someChecked = perms.read || perms.write || perms.deploy;

  useEffect(() => {
    if (parentCheckRef.current) {
      parentCheckRef.current.indeterminate = someChecked && !allChecked;
    }
  }, [someChecked, allChecked]);

  const emailCheck = validateEmailAddress(email);
  const pwStrength = assessPasswordStrength(password);

  const handleToggleAllPerms = () => {
    const next = !allChecked;
    setPerms({ read: next, write: next, deploy: next });
  };

  const handleFilePick = (file: File | undefined) => {
    if (!file) return;
    setUploadedFile({ name: file.name, sizeKb: Math.max(1, Math.round(file.size / 1024)) });
    onAnnounce(`Selected file ${file.name}`);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    handleFilePick(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);
    if (!emailCheck.valid) {
      onAnnounce('Please fix the email validation error before submitting');
      return;
    }
    const msg = `Configuration saved for ${fullName} (${region}, ${selectedTier.toUpperCase()} tier).`;
    setSubmittedNotice(msg);
    onAnnounce(msg);
  };

  return (
    <section aria-labelledby="forms-heading" className="space-y-5">
      <div>
        <p className="text-xs font-semibold tracking-wider text-accent uppercase">
          HTML5 Form Controls &amp; Validation
        </p>
        <h2 id="forms-heading" className="mt-1 text-2xl font-bold tracking-tight text-main">
          Complete Inputs, Fieldsets, Selects &amp; Interactive Pickers
        </h2>
      </div>

      <form onSubmit={handleSubmit} noValidate className="grid grid-cols-12 gap-4">
        {/* Fieldset 1: Identity & Native Inputs */}
        <fieldset className="col-span-12 space-y-4 rounded-2xl border border-line bg-surface p-6 lg:col-span-7">
          <legend className="px-2 text-xs font-bold tracking-wider text-accent uppercase">
            Administrator &amp; Native HTML5 Input Types
          </legend>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="f-name" className="mb-1.5 block text-xs font-semibold text-secondary">
                Full Name (<code>type="text"</code>)
              </label>
              <input
                id="f-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-10 w-full rounded-xl border border-line-strong bg-input px-3 text-sm text-main focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="f-email" className="mb-1.5 block text-xs font-semibold text-secondary">
                Email Address (<code>type="email"</code>) <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-3 left-3 h-4 w-4 text-muted" aria-hidden="true" />
                <input
                  id="f-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  aria-invalid={emailTouched && !emailCheck.valid}
                  aria-describedby="f-email-msg"
                  className={[
                    'h-10 w-full rounded-xl border bg-input pr-3 pl-9 text-sm text-main focus:outline-none',
                    emailTouched && !emailCheck.valid
                      ? 'border-danger focus:border-danger'
                      : 'border-line-strong focus:border-accent',
                  ].join(' ')}
                />
              </div>
              <p
                id="f-email-msg"
                role={emailTouched && !emailCheck.valid ? 'alert' : undefined}
                className={
                  emailTouched && !emailCheck.valid
                    ? 'mt-1 text-xs font-semibold text-danger'
                    : 'mt-1 text-xs text-muted'
                }
              >
                {emailTouched && !emailCheck.valid
                  ? emailCheck.error
                  : 'Validated cleanly via pure client logic.'}
              </p>
            </div>

            <div>
              <label htmlFor="f-pw" className="mb-1.5 block text-xs font-semibold text-secondary">
                Master Password (<code>type="password"</code>)
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-3 left-3 h-4 w-4 text-muted" aria-hidden="true" />
                <input
                  id="f-pw"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 w-full rounded-xl border border-line-strong bg-input pr-10 pl-9 font-mono text-sm text-main focus:border-accent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  aria-pressed={showPw}
                  className="absolute top-1 right-1 grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-subtle hover:text-main"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="mt-1.5 flex items-center justify-between gap-2 text-xs">
                <meter min={0} max={4} low={2} high={3} optimum={4} value={pwStrength.score} className="aether-meter flex-1" />
                <span className="font-mono font-semibold text-main">{pwStrength.label}</span>
              </div>
            </div>

            <div>
              <label htmlFor="f-region" className="mb-1.5 block text-xs font-semibold text-secondary">
                Region (<code>&lt;select&gt;</code> + <code>&lt;optgroup&gt;</code>)
              </label>
              <select
                id="f-region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="h-10 w-full rounded-xl border border-line-strong bg-input px-3 text-sm text-main focus:border-accent focus:outline-none"
              >
                <optgroup label="Americas">
                  <option value="us-east-1">US-East (N. Virginia)</option>
                  <option value="us-west-2">US-West (Oregon)</option>
                </optgroup>
                <optgroup label="Europe &amp; Asia">
                  <option value="eu-central-1">EU-Central (Frankfurt)</option>
                  <option value="ap-south-1">AP-South (Mumbai)</option>
                  <option value="ap-northeast-1">AP-East (Tokyo)</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label htmlFor="f-datalist" className="mb-1.5 block text-xs font-semibold text-secondary">
                Zone Autocomplete (<code>&lt;datalist&gt;</code>)
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute top-3 left-3 h-4 w-4 text-muted" aria-hidden="true" />
                <input
                  id="f-datalist"
                  type="search"
                  list="edge-zones"
                  value={zoneList}
                  onChange={(e) => setZoneList(e.target.value)}
                  className="h-10 w-full rounded-xl border border-line-strong bg-input pr-3 pl-9 text-sm text-main focus:border-accent focus:outline-none"
                />
              </div>
              <datalist id="edge-zones">
                <option value="Frankfurt (eu-central-1)" />
                <option value="London (eu-west-2)" />
                <option value="Mumbai (ap-south-1)" />
                <option value="Tokyo (ap-northeast-1)" />
                <option value="Virginia (us-east-1)" />
              </datalist>
            </div>

            <div>
              <label htmlFor="f-url" className="mb-1.5 block text-xs font-semibold text-secondary">
                Webhook Endpoint (<code>type="url"</code>)
              </label>
              <input
                id="f-url"
                type="url"
                value={urlVal}
                onChange={(e) => setUrlVal(e.target.value)}
                className="h-10 w-full rounded-xl border border-line-strong bg-input px-3 font-mono text-xs text-main focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="f-tel" className="mb-1.5 block text-xs font-semibold text-secondary">
                On-Call Phone (<code>type="tel"</code>)
              </label>
              <input
                id="f-tel"
                type="tel"
                value={telVal}
                onChange={(e) => setTelVal(e.target.value)}
                className="h-10 w-full rounded-xl border border-line-strong bg-input px-3 font-mono text-xs tabular-nums text-main focus:border-accent focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="f-date" className="mb-1.5 block text-xs font-semibold text-secondary">
                  Date (<code>type="date"</code>)
                </label>
                <input
                  id="f-date"
                  type="date"
                  value={dateVal}
                  onChange={(e) => setDateVal(e.target.value)}
                  className="h-10 w-full rounded-xl border border-line-strong bg-input px-2.5 font-mono text-xs text-main focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="f-time" className="mb-1.5 block text-xs font-semibold text-secondary">
                  Time (<code>type="time"</code>)
                </label>
                <input
                  id="f-time"
                  type="time"
                  value={timeVal}
                  onChange={(e) => setTimeVal(e.target.value)}
                  className="h-10 w-full rounded-xl border border-line-strong bg-input px-2.5 font-mono text-xs text-main focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="f-notes" className="text-xs font-semibold text-secondary">
                Deployment Notes (<code>&lt;textarea&gt;</code>)
              </label>
              <span className="font-mono text-xs tabular-nums text-muted">{notes.length} chars</span>
            </div>
            <textarea
              id="f-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-line-strong bg-input p-3 text-sm text-main focus:border-accent focus:outline-none"
            />
          </div>
        </fieldset>

        {/* Fieldset 2: Sliders, Steppers, File Upload, Checkboxes & Radio Tiers */}
        <fieldset className="col-span-12 space-y-5 rounded-2xl border border-line bg-surface p-6 lg:col-span-5">
          <legend className="px-2 text-xs font-bold tracking-wider text-accent uppercase">
            Pickers, Permissions &amp; File Upload
          </legend>

          {/* Range, Number Stepper & Color */}
          <div className="space-y-4">
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <label htmlFor="f-range" className="font-semibold text-secondary">
                  Wave Blur (<code>range</code>)
                </label>
                <output htmlFor="f-range" className="font-mono font-bold tabular-nums text-main">
                  {waveBlur}%
                </output>
              </div>
              <input
                id="f-range"
                type="range"
                min={0}
                max={100}
                value={waveBlur}
                onChange={(e) => setWaveBlur(Number(e.target.value))}
                className="w-full accent-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="min-w-0">
                <span className="mb-1.5 block text-xs font-semibold text-secondary">
                  Nodes (<code>number</code>)
                </span>
                <div className="inline-flex h-10 w-full items-center justify-between rounded-xl border border-line-strong bg-input px-1">
                  <button
                    type="button"
                    aria-label="Decrease node count"
                    onClick={() => setNodeCount((n) => Math.max(1, n - 1))}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-secondary hover:bg-subtle hover:text-main"
                  >
                    −
                  </button>
                  <output className="text-center font-mono text-sm font-bold tabular-nums text-main">
                    {nodeCount}
                  </output>
                  <button
                    type="button"
                    aria-label="Increase node count"
                    onClick={() => setNodeCount((n) => Math.min(32, n + 1))}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-secondary hover:bg-subtle hover:text-main"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="min-w-0">
                <label htmlFor="f-color" className="mb-1.5 block text-xs font-semibold text-secondary">
                  Color (<code>type="color"</code>)
                </label>
                <div className="flex h-10 w-full items-center gap-2 rounded-xl border border-line-strong bg-input px-2.5">
                  <input
                    id="f-color"
                    type="color"
                    value={accentHex}
                    onChange={(e) => setAccentHex(e.target.value)}
                    className="h-6 w-7 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                  <span className="truncate font-mono text-xs text-main">{accentHex}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Indeterminate Checkboxes */}
          <div className="rounded-xl border border-line bg-elevated p-3.5">
            <p className="mb-2 text-xs font-semibold text-muted uppercase">
              Checkboxes (with Indeterminate Parent)
            </p>
            <div className="space-y-2 text-sm">
              <label className="flex cursor-pointer items-center gap-2.5 font-semibold text-main">
                <input
                  ref={parentCheckRef}
                  type="checkbox"
                  checked={allChecked}
                  onChange={handleToggleAllPerms}
                  className="h-4 w-4 rounded accent-accent"
                />
                <span>All Cluster Permissions</span>
              </label>
              <div className="grid grid-cols-3 gap-2 pl-6 text-xs text-secondary">
                {(['read', 'write', 'deploy'] as const).map((key) => (
                  <label key={key} className="flex cursor-pointer items-center gap-1.5 capitalize">
                    <input
                      type="checkbox"
                      checked={perms[key]}
                      onChange={(e) => setPerms((p) => ({ ...p, [key]: e.target.checked }))}
                      className="h-3.5 w-3.5 rounded accent-accent"
                    />
                    <span>{key}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Radio Tier Cards */}
          <div>
            <p className="mb-2 text-xs font-semibold text-secondary">
              Plan Selection (<code>role="radiogroup"</code> / <code>type="radio"</code>)
            </p>
            <div role="radiogroup" aria-label="Select hosting plan" className="grid grid-cols-3 gap-2">
              {(
                [
                  ['starter', 'Starter', 'Free'],
                  ['pro', 'Pro', '$12/mo'],
                  ['enterprise', 'Team', '$40/mo'],
                ] as const
              ).map(([id, title, price]) => {
                const selected = selectedTier === id;
                return (
                  <label
                    key={id}
                    className={[
                      'flex cursor-pointer flex-col rounded-xl border p-3 transition-colors',
                      selected
                        ? 'border-accent bg-accent/15'
                        : 'border-line bg-elevated hover:border-line-strong',
                    ].join(' ')}
                  >
                    <input
                      type="radio"
                      name="hostingTier"
                      value={id}
                      checked={selected}
                      onChange={() => setSelectedTier(id)}
                      className="sr-only"
                    />
                    <span className="text-xs font-bold text-main">{title}</span>
                    <span className="mt-0.5 font-mono text-xs tabular-nums text-accent">{price}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Swatch & 5-Star Rating */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-elevated p-3.5">
            <div>
              <span className="mb-1.5 block text-xs font-semibold text-secondary">
                Color Swatch ({swatch.name})
              </span>
              <div className="flex items-center gap-2">
                {SWATCHES.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    aria-label={s.name}
                    aria-pressed={swatch.name === s.name}
                    onClick={() => setSwatch(s)}
                    style={{ backgroundColor: s.hex }}
                    className={[
                      'h-6 w-6 rounded-full transition-transform',
                      swatch.name === s.name
                        ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-surface'
                        : 'opacity-80 hover:opacity-100',
                    ].join(' ')}
                  />
                ))}
              </div>
            </div>

            <div>
              <span className="mb-1 block text-xs font-semibold text-secondary">
                Rating (<span className="font-mono tabular-nums">{rating}.0/5</span>)
              </span>
              <div role="group" aria-label="Rate component quality" className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    aria-label={`Rate ${star} stars`}
                    onClick={() => setRating(star)}
                    className={[
                      'text-xl leading-none transition-transform hover:scale-115',
                      star <= rating ? 'text-amber-400' : 'text-line-strong',
                    ].join(' ')}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* File Dropzone */}
          <label
            htmlFor="f-file"
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={[
              'flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed p-4 text-center transition-colors',
              dragging
                ? 'border-accent bg-accent/15'
                : 'border-line-strong bg-elevated hover:border-accent/60',
            ].join(' ')}
          >
            <input
              id="f-file"
              type="file"
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleFilePick(e.target.files?.[0])}
              className="sr-only"
            />
            <UploadCloud className="h-5 w-5 text-accent" aria-hidden="true" />
            <span className="text-xs font-semibold text-main">
              {uploadedFile
                ? `${uploadedFile.name} (${uploadedFile.sizeKb} KB)`
                : 'Drop config file or click to browse (<input type="file">)'}
            </span>
          </label>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <button
              type="reset"
              onClick={() => {
                setEmail('elena@aether.dev');
                setSubmittedNotice(null);
              }}
              className="h-10 rounded-xl border border-line bg-elevated px-4 text-xs font-semibold text-secondary hover:bg-subtle hover:text-main"
            >
              Reset
            </button>
            <button
              type="submit"
              className="h-10 rounded-xl bg-accent px-5 text-sm font-semibold text-accent-contrast transition-colors hover:bg-accent-hover"
            >
              Save Form Settings
            </button>
          </div>

          {submittedNotice && (
            <div
              role="status"
              className="flex items-center gap-2 rounded-xl border border-success/40 bg-success/15 px-3 py-2 text-xs font-semibold text-success"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{submittedNotice}</span>
            </div>
          )}
        </fieldset>
      </form>
    </section>
  );
}
