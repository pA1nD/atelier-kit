/* Kit — showroom for UI primitives that might be useful elsewhere. All
 * components are defined locally. The Module renders them in a gallery so we
 * can look at each and decide: keep, promote to a real helper, or delete.
 *
 * Rule of the project: modules own their UI. If a primitive earns its keep,
 * copy it into the module that wants it. If not, remove it from this file.
 */

const { useState, useEffect, useRef } = React;

export const meta = { icon: 'package-open', group: 'dev' };

/* =========================================================================
 * THE PRIMITIVES
 * ========================================================================= */

/* Button — primary / secondary / ghost / danger, sm / md / lg */
function Button({ variant = 'secondary', size = 'md', kbd, children, onClick, disabled, className = '', style, ...rest }) {
  const sizeCls =
    size === 'sm' ? 'text-12 px-2 py-1' :
    size === 'lg' ? 'text-13 px-4 py-[9px]' :
                    'text-13 px-3 py-1.5';

  const variantCls = {
    primary:
      'font-semibold bg-accent-primary border border-accent-primary-hi text-fg-on-accent ' +
      'hover:bg-accent-primary-hi',
    secondary:
      'font-medium bg-card border border-default text-fg-primary ' +
      'hover:bg-card-hi hover:border-strong',
    ghost:
      'font-medium bg-transparent border border-transparent text-fg-secondary ' +
      'hover:bg-card hover:text-fg-primary',
    danger:
      'font-medium bg-transparent text-gb-red-br ' +
      'border border-[rgba(251,73,52,0.35)] hover:bg-[rgba(251,73,52,0.1)]',
  }[variant] || '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        'inline-flex items-center gap-1.5 rounded-sm whitespace-nowrap',
        'font-sans tracking-[-0.005em] cursor-pointer',
        'transition-[background-color,border-color,color] duration-fast ease-enter',
        'disabled:cursor-not-allowed disabled:opacity-45',
        sizeCls,
        variantCls,
        className,
      ].join(' ')}
      style={style}
      {...rest}
    >
      {children}
      {kbd && (
        <span
          className={[
            'font-mono text-11 tracking-[0.04em] pl-1.5 ml-1 leading-none',
            variant === 'primary'
              ? 'text-[rgba(29,32,33,0.7)] border-l border-[rgba(29,32,33,0.25)]'
              : 'text-fg-muted border-l border-default',
          ].join(' ')}
        >
          {kbd}
        </span>
      )}
    </button>
  );
}

/* Kbd — keyboard shortcut chip */
function Kbd({ children }) {
  return (
    <kbd className="font-mono text-11 px-[5px] py-[1px] rounded-xs bg-card border border-default border-b-2 text-fg-secondary shadow-inset-well">
      {children}
    </kbd>
  );
}

/* Input — text field, focus state managed locally */
function Input({ value, onChange, placeholder, mono, className = '', style, autoFocus, onKeyDown }) {
  const fontCls = mono ? 'font-mono text-12' : 'font-sans text-13';
  return (
    <input
      value={value || ''}
      onChange={(e) => onChange && onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      onKeyDown={onKeyDown}
      className={[
        'w-full box-border outline-none rounded-sm px-2.5 py-[7px]',
        'bg-sunken text-fg-primary border',
        'shadow-inset-well',
        'border-default focus:border-focus',
        'focus:shadow-[inset_0_1px_0_rgba(0,0,0,0.25),0_0_0_3px_rgba(215,153,33,0.15)]',
        'transition-[border-color,box-shadow] duration-fast',
        fontCls,
        className,
      ].join(' ')}
      style={style}
    />
  );
}

/* Badge — mono pill with tone */
function Badge({ kind = 'default', children }) {
  const map = {
    default: { bg: 'transparent',               bd: 'var(--color-border-default)',   fg: 'var(--color-fg-muted)' },
    accent:  { bg: 'rgba(215,153,33,0.12)',     bd: 'rgba(215,153,33,0.35)',         fg: '#fabd2f' },
    success: { bg: 'rgba(152,151,26,0.12)',     bd: 'rgba(152,151,26,0.35)',         fg: '#b8bb26' },
    warning: { bg: 'rgba(215,153,33,0.12)',     bd: 'rgba(215,153,33,0.35)',         fg: '#fabd2f' },
    danger:  { bg: 'rgba(204,36,29,0.12)',      bd: 'rgba(204,36,29,0.35)',          fg: '#fb4934' },
    info:    { bg: 'rgba(69,133,136,0.12)',     bd: 'rgba(69,133,136,0.35)',         fg: '#83a598' },
  };
  const c = map[kind] || map.default;
  return (
    <span
      className="inline-block font-mono text-[10.5px] tracking-normal px-[7px] py-[2px] rounded-xs border whitespace-nowrap"
      style={{ background: c.bg, borderColor: c.bd, color: c.fg }}
    >
      {children}
    </span>
  );
}

/* Tag — small mono label with a colored dot prefix. Note: kanban has its own
 * local Tag with different dot placement and extra states (active/dim). If
 * this primitive survives, the kanban version may collapse into it. */
function Tag({ color = 'amber', children }) {
  const dots = {
    amber:  '#d79921',
    aqua:   '#689d6a',
    blue:   '#458588',
    purple: '#b16286',
    red:    '#cc241d',
  };
  return (
    <span className="relative font-mono text-11 text-fg-secondary bg-card border border-default rounded-xs pl-[14px] pr-[6px] py-[1px] whitespace-nowrap">
      <span
        className="absolute left-[6px] top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full"
        style={{ background: dots[color] || dots.amber }}
      />
      {children}
    </span>
  );
}

/* Cursor — blinking text caret. The Kanban detail drawer uses a CSS-class
 * equivalent (.cursor in styles.css); this is the component version. */
function Cursor({ ch = 0.55, color = 'var(--color-accent-primary)' }) {
  return (
    <span
      className="inline-block align-[-0.12em] ml-[1px] h-[1em] animate-cursor-blink"
      style={{ width: ch + 'ch', background: color }}
    />
  );
}

/* StatusDot — halo'd dot for module/row state. Atelier shell holds an
 * inline copy (currently commented out in atelier/client.jsx) for the rail;
 * promoted here so future modules don't reinvent it. */
function StatusDot({ kind = 'idle', size = 6, pulse = false }) {
  const tone = {
    ok:     { bg: 'var(--color-signal-success)', ring: 'var(--color-signal-success-wash)' },
    warn:   { bg: 'var(--color-signal-warning)', ring: 'var(--color-signal-warning-wash)' },
    danger: { bg: 'var(--color-signal-danger)',  ring: 'var(--color-signal-danger-wash)' },
    info:   { bg: 'var(--color-signal-info)',    ring: 'var(--color-signal-info-wash)' },
    idle:   { bg: 'var(--color-fg-muted)',       ring: 'transparent' },
  }[kind] || { bg: 'var(--color-fg-muted)', ring: 'transparent' };
  return (
    <span
      className={['inline-block rounded-full align-middle', pulse ? 'animate-pulse-dot' : ''].join(' ')}
      style={{
        width: size, height: size,
        background: tone.bg,
        boxShadow: tone.ring === 'transparent' ? 'none' : `0 0 0 3px ${tone.ring}`,
      }}
    />
  );
}

/* Spinner — braille frames. Atelier shell has a private copy used by the
 * boot LoadingScreen; this is the same shape, exposed for module use. */
function Spinner({ color = 'var(--color-accent-primary)', size = 14 }) {
  const frames = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % frames.length), 90);
    return () => clearInterval(id);
  }, []);
  return (
    <span
      className="inline-block font-mono text-center leading-none"
      style={{ color, fontSize: size, width: size }}
    >
      {frames[i]}
    </span>
  );
}

/* Sparkline — tiny inline trend SVG. Activity has a near-identical local
 * `Spark`; converging on one shape here. Pass an array of numbers; flat
 * series renders a centered line. */
function Sparkline({ data, color = 'var(--color-accent-primary)', w = 100, h = 28, fill = true }) {
  if (!data || data.length === 0) return <svg width={w} height={h} />;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = data.length > 1 ? w / (data.length - 1) : 0;
  const pts = data.map((v, i) => [i * step, h - ((v - min) / range) * h]);
  const line = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const area = line + ` L${w},${h} L0,${h} Z`;
  return (
    <svg width={w} height={h} className="block">
      {fill && <path d={area} fill={color} opacity="0.14" />}
      <path d={line} fill="none" stroke={color} strokeWidth="1.25" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* Ring — circular progress. Value 0..1; tracks behind, accent in front. */
function Ring({ value = 0, size = 46, stroke = 4, color = 'var(--color-accent-primary)', track = 'var(--color-border-default)' }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * Math.max(0, Math.min(1, value));
  return (
    <svg width={size} height={size} className="block">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={`${dash} ${c - dash}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

/* Bar — horizontal progress. Value 0..1. Kanban inlines a 2px variant on
 * cards; same shape, parameterized. */
function Bar({ value = 0, color = 'var(--color-accent-primary)', h = 4, className = '' }) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div className={['w-full bg-sunken rounded-[1px] overflow-hidden', className].join(' ')} style={{ height: h }}>
      <div className="h-full" style={{ width: pct + '%', background: color }} />
    </div>
  );
}

/* AgentChip — `@name` mono chip with secondary-accent prefix. Kanban detail
 * inlines the same shape against agent attribution lines. */
function AgentChip({ name }) {
  return (
    <span className="font-mono text-[10px] text-fg-muted tracking-normal whitespace-nowrap">
      <span className="text-accent-secondary-hi">@</span>{name}
    </span>
  );
}

/* =========================================================================
 * THE GALLERY
 * ========================================================================= */

function Row({ label, desc, children }) {
  return (
    <section className="grid grid-cols-[160px_1fr] gap-6 py-6 border-b border-subtle">
      <div className="flex flex-col gap-1">
        <div className="font-mono text-11 text-fg-display tracking-caps lowercase">{label}</div>
        <div className="font-sans text-12 text-fg-muted leading-snug">{desc}</div>
      </div>
      <div className="flex flex-wrap items-center gap-3 min-w-0">{children}</div>
    </section>
  );
}

/* =========================================================================
 * THE PAGES — kit · design · brand. Active tab doubles as the title
 * (italic Newsreader 34px); inactives are small mono caps on the same
 * baseline. The page subtitle sits directly under the title block. A mono
 * counter on the right shows position, with a → arrow for next-page.
 * Keyboard: ←/→ navigate between pages.
 * ========================================================================= */

const PAGES = [
  {
    id: 'kit',
    sub: "a showroom of primitives that might be useful elsewhere. look at each one. if you'd use it in a future feature, say so and we'll keep it. if not, delete it.",
  },
  {
    id: 'design',
    sub: 'the design system made visible — every token mapped to a swatch, a type sample, or a spacing bar.',
  },
  {
    id: 'brand',
    sub: 'the mark, the wordmark, the tagline, the voice. carved from gruvbox dark, lit by a single amber accent. what makes atelier feel like atelier — and what to leave alone.',
  },
  {
    id: 'pegboard',
    sub: 'atelier\'s empty surface — a regular grid of dots. signals "you could put something here." everything else is built on top of this.',
  },
  {
    id: 'mission-control',
    sub: 'the global agent bar — every state, every density, every panel. ported from claude design. components are real and interactive; the mock data on the right of each row drives them.',
  },
];

/* View Transitions API — Chromium has it, Safari recently, Firefox not yet.
 * When supported, wrap setPage in startViewTransition so the browser snapshots
 * the old DOM, applies our React update, then animates between snapshots.
 * Elements with matching `view-transition-name` morph in place — that's how
 * the active title word slides + scales smoothly between mono-caps and italic
 * serif. flushSync forces React to commit before the snapshot. */
const SUPPORTS_VT = typeof document !== 'undefined' && typeof document.startViewTransition === 'function';

function navigateWith(setPage) {
  return (id) => {
    if (SUPPORTS_VT && window.ReactDOM && window.ReactDOM.flushSync) {
      document.startViewTransition(() => {
        window.ReactDOM.flushSync(() => setPage(id));
      });
    } else {
      setPage(id);
    }
  };
}

function PageTabs({ page, onPage }) {
  const idx = PAGES.findIndex((p) => p.id === page);
  const total = PAGES.length;
  const go = navigateWith(onPage);
  const next = () => go(PAGES[(idx + 1) % total].id);
  const prev = () => go(PAGES[(idx - 1 + total) % total].id);

  useEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [page]);

  return (
    <header className="pt-6 pb-2 relative z-10">
      <div className="flex items-baseline gap-4">
        {PAGES.map((p, i) => (
          <React.Fragment key={p.id}>
            {i > 0 && <span className="font-mono text-13 text-fg-subtle select-none">·</span>}
            <button
              onClick={() => go(p.id)}
              style={{ viewTransitionName: `vt-tab-${p.id}` }}
              className={[
                'cursor-pointer transition-colors duration-base ease-enter',
                page === p.id
                  ? 'font-display italic text-[34px] text-fg-display leading-tight tracking-[-0.015em]'
                  : 'font-mono text-11 tracking-caps lowercase text-fg-muted hover:text-fg-secondary',
              ].join(' ')}
            >
              {p.id}
            </button>
          </React.Fragment>
        ))}
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <div
            className="font-mono text-11 text-fg-muted tabular-nums"
            style={{ viewTransitionName: 'vt-counter' }}
          >
            <span className="text-accent-primary-hi">{String(idx + 1).padStart(2, '0')}</span>
            <span className="mx-1 text-fg-subtle">/</span>
            <span>{String(total).padStart(2, '0')}</span>
          </div>
          <button
            onClick={next}
            aria-label="next page"
            title="next page (→)"
            style={{ viewTransitionName: 'vt-arrow' }}
            className="group cursor-pointer font-display italic text-[34px] leading-tight tracking-[-0.015em] text-fg-muted hover:text-accent-primary-hi transition-colors duration-base ease-enter px-1.5 self-baseline"
          >
            <span className="inline-block transition-transform duration-base ease-enter group-hover:translate-x-1">›</span>
          </button>
        </div>
      </div>
      <p
        className="font-sans text-13 text-fg-secondary leading-body mt-2 max-w-[640px]"
        style={{ viewTransitionName: 'vt-subtitle' }}
      >
        {PAGES[idx].sub}
      </p>
    </header>
  );
}

function KitPage() {
  const [text, setText] = useState('type something…');
  const trend = [3, 5, 4, 6, 7, 6, 8, 7, 9, 10, 9, 11, 12, 11, 13];
  return (
    <div className="mt-4" data-kit-page>
      <Row label="button" desc="4 variants × 3 sizes. primary / secondary / ghost / danger.">
        <Button variant="primary">primary</Button>
        <Button variant="secondary">secondary</Button>
        <Button variant="ghost">ghost</Button>
        <Button variant="danger">danger</Button>
        <span className="w-2" />
        <Button size="sm">sm</Button>
        <Button size="md">md</Button>
        <Button size="lg">lg</Button>
        <span className="w-2" />
        <Button variant="primary" kbd="⌘↵">with kbd</Button>
        <Button disabled>disabled</Button>
      </Row>

      <Row label="kbd" desc="keyboard shortcut chip. was in TopBar ⌘k until search was removed.">
        <Kbd>⌘k</Kbd>
        <Kbd>esc</Kbd>
        <Kbd>⇧⌘p</Kbd>
        <Kbd>/</Kbd>
      </Row>

      <Row label="input" desc="single-line text field with focus ring.">
        <div className="w-[260px]">
          <Input value={text} onChange={setText} placeholder="something…" />
        </div>
        <div className="w-[180px]">
          <Input mono placeholder="mono input" />
        </div>
        <div className="font-mono text-11 text-fg-muted">value → <span className="text-fg-primary">{text}</span></div>
      </Row>

      <Row label="badge" desc="mono pill with a tone. counts, status markers, small flags.">
        <Badge>default</Badge>
        <Badge kind="accent">accent</Badge>
        <Badge kind="success">success</Badge>
        <Badge kind="warning">warning</Badge>
        <Badge kind="danger">danger</Badge>
        <Badge kind="info">info</Badge>
      </Row>

      <Row label="tag" desc="colored-dot label. kanban has its own local variant.">
        <Tag color="amber">amber</Tag>
        <Tag color="aqua">aqua</Tag>
        <Tag color="blue">blue</Tag>
        <Tag color="purple">purple</Tag>
        <Tag color="red">red</Tag>
      </Row>

      <Row label="cursor" desc="blinking text caret. styles.css has a .cursor class equivalent.">
        <span className="font-mono text-13 text-fg-primary">end of prompt<Cursor /></span>
        <span className="font-mono text-13 text-fg-primary">
          custom color<Cursor color="var(--color-gb-aqua-br)" />
        </span>
      </Row>

      <Row label="statusdot" desc="halo'd dot. ok/warn/danger/info/idle. optional pulse.">
        <span className="inline-flex items-center gap-1.5 font-mono text-11 text-fg-secondary">
          <StatusDot kind="ok" /> ok
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-11 text-fg-secondary">
          <StatusDot kind="warn" /> warn
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-11 text-fg-secondary">
          <StatusDot kind="danger" /> danger
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-11 text-fg-secondary">
          <StatusDot kind="info" /> info
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-11 text-fg-secondary">
          <StatusDot kind="idle" /> idle
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-11 text-fg-secondary">
          <StatusDot kind="ok" pulse /> pulse
        </span>
      </Row>

      <Row label="spinner" desc="braille frames. atelier boot screen uses a private copy.">
        <Spinner />
        <Spinner size={18} color="var(--color-gb-aqua-br)" />
        <Spinner size={11} color="var(--color-fg-muted)" />
      </Row>

      <Row label="sparkline" desc="tiny trend svg. activity has a near-identical local copy.">
        <Sparkline data={trend} />
        <Sparkline data={trend} color="var(--color-gb-aqua-br)" w={140} h={32} />
        <Sparkline data={trend} fill={false} color="var(--color-gb-red-br)" />
      </Row>

      <Row label="ring" desc="circular progress. value 0..1.">
        <Ring value={0.25} />
        <Ring value={0.62} color="var(--color-gb-aqua-br)" />
        <Ring value={0.95} size={32} stroke={3} color="var(--color-gb-yellow-br)" />
      </Row>

      <Row label="bar" desc="horizontal progress. kanban inlines a 2px variant.">
        <div className="w-45"><Bar value={0.25} /></div>
        <div className="w-45"><Bar value={0.62} h={2} color="var(--color-gb-aqua-br)" /></div>
        <div className="w-45"><Bar value={0.95} h={6} color="var(--color-gb-yellow-br)" /></div>
      </Row>

      <Row label="agentchip" desc="`@name` mono chip. kanban detail inlines the same shape.">
        <AgentChip name="operator" />
        <AgentChip name="drafter" />
        <AgentChip name="ada" />
        <AgentChip name="archivist" />
      </Row>
    </div>
  );
}

/* ---- design page — visual reading of the design tokens. Each section maps
 * to a token group: surfaces, foregrounds, accents, signals, type, radii,
 * spacing, motion. ---- */

/* ---- visual building blocks for the design page ---- */

function Swatch({ name, varName, fg = 'var(--color-fg-display)' }) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className="h-14 rounded-sm border border-default flex items-end px-2 py-1.5 font-mono text-[10px]"
        style={{ background: `var(--color-${varName})`, color: fg }}
      >
        {name}
      </div>
      <div className="font-mono text-[10px] text-fg-subtle leading-tight">--color-{varName}</div>
    </div>
  );
}

function TypeRow({ label, varName, sample, italic = false, weight = 400, family = 'sans' }) {
  const fontMap = {
    display: 'var(--font-display)',
    sans:    'var(--font-sans)',
    mono:    'var(--font-mono)',
  };
  return (
    <div className="grid grid-cols-[140px_1fr] gap-6 items-baseline py-2 border-b border-subtle">
      <div className="flex flex-col gap-0.5">
        <div className="font-mono text-11 text-fg-display tracking-caps lowercase">{label}</div>
        <div className="font-mono text-[10px] text-fg-subtle">{varName}</div>
      </div>
      <div
        className="text-fg-display"
        style={{
          fontFamily:    fontMap[family],
          fontSize:      `var(--text-${varName.replace('text-', '')})`,
          fontStyle:     italic ? 'italic' : 'normal',
          fontWeight:    weight,
          lineHeight:    'var(--leading-snug)',
          letterSpacing: family === 'display' ? 'var(--tracking-display)' : family === 'mono' ? '0' : 'var(--tracking-body)',
        }}
      >
        {sample}
      </div>
    </div>
  );
}

function DesignPage() {
  return (
    <div className="mt-4 flex flex-col gap-12" data-kit-page>

      {/* Surfaces */}
      <section className="flex flex-col gap-4">
        <h5 className="font-mono text-11 text-fg-muted tracking-caps uppercase">surfaces</h5>
        <div className="grid grid-cols-5 gap-3 max-w-[760px]">
          <Swatch name="sunken"  varName="bg-sunken" />
          <Swatch name="canvas"  varName="bg-canvas" />
          <Swatch name="raised"  varName="bg-raised" />
          <Swatch name="card"    varName="bg-card" />
          <Swatch name="card-hi" varName="bg-card-hi" />
        </div>
      </section>

      {/* Foregrounds */}
      <section className="flex flex-col gap-4">
        <h5 className="font-mono text-11 text-fg-muted tracking-caps uppercase">foregrounds</h5>
        <div className="grid grid-cols-5 gap-3 max-w-[760px]">
          <Swatch name="display"   varName="fg-display"   fg="var(--color-bg-canvas)" />
          <Swatch name="primary"   varName="fg-primary"   fg="var(--color-bg-canvas)" />
          <Swatch name="secondary" varName="fg-secondary" fg="var(--color-bg-canvas)" />
          <Swatch name="muted"     varName="fg-muted"     fg="var(--color-bg-canvas)" />
          <Swatch name="subtle"    varName="fg-subtle"    fg="var(--color-bg-canvas)" />
        </div>
      </section>

      {/* Brand accents */}
      <section className="flex flex-col gap-4">
        <h5 className="font-mono text-11 text-fg-muted tracking-caps uppercase">brand accents</h5>
        <div className="grid grid-cols-6 gap-3 max-w-[760px]">
          <Swatch name="primary"      varName="accent-primary"      fg="var(--color-fg-on-accent)" />
          <Swatch name="primary-hi"   varName="accent-primary-hi"   fg="var(--color-fg-on-accent)" />
          <Swatch name="primary-lo"   varName="accent-primary-lo"   fg="var(--color-fg-display)" />
          <Swatch name="secondary"    varName="accent-secondary"    fg="var(--color-fg-display)" />
          <Swatch name="secondary-hi" varName="accent-secondary-hi" fg="var(--color-fg-on-accent)" />
          <Swatch name="secondary-lo" varName="accent-secondary-lo" fg="var(--color-fg-display)" />
        </div>
      </section>

      {/* Signals */}
      <section className="flex flex-col gap-4">
        <h5 className="font-mono text-11 text-fg-muted tracking-caps uppercase">signals</h5>
        <div className="flex flex-wrap items-center gap-5">
          {['ok', 'warn', 'danger', 'info', 'idle'].map((k) => (
            <span key={k} className="inline-flex items-center gap-2 font-mono text-12 text-fg-secondary">
              <StatusDot kind={k} /> {k}
            </span>
          ))}
          <span className="font-mono text-11 text-fg-subtle ml-2">+ wash variants at 12%</span>
        </div>
      </section>

      {/* Typography */}
      <section className="flex flex-col gap-2">
        <h5 className="font-mono text-11 text-fg-muted tracking-caps uppercase mb-2">typography</h5>
        <TypeRow label="hero"       varName="text-64" sample="The voice of the room." family="display" italic />
        <TypeRow label="display"    varName="text-48" sample="atelier" family="display" italic />
        <TypeRow label="h1"         varName="text-34" sample="Heading one" family="display" italic />
        <TypeRow label="h2"         varName="text-28" sample="Heading two" family="display" italic />
        <TypeRow label="h3"         varName="text-19" sample="Heading three" weight={600} />
        <TypeRow label="h4"         varName="text-16" sample="Heading four" weight={600} />
        <TypeRow label="body"       varName="text-14" sample="The quick brown fox jumps over the lazy dog. 0123456789" />
        <TypeRow label="body-sm"    varName="text-12" sample="Smaller body — meta, secondary text." />
        <TypeRow label="label-caps" varName="text-11" sample="label · 042 entries · running" family="mono" weight={500} />
        <TypeRow label="mono"       varName="text-13" sample="atelier-211 · operator · 0123456789 · ⌘↵" family="mono" />
      </section>

      {/* Radii */}
      <section className="flex flex-col gap-4">
        <h5 className="font-mono text-11 text-fg-muted tracking-caps uppercase">radii</h5>
        <div className="flex items-end gap-4">
          {[
            { name: 'xs', cls: 'rounded-xs', size: 24 },
            { name: 'sm', cls: 'rounded-sm', size: 32 },
            { name: 'md', cls: 'rounded-md', size: 40 },
            { name: 'lg', cls: 'rounded-lg', size: 56 },
          ].map((r) => (
            <div key={r.name} className="flex flex-col items-center gap-1">
              <div className={['bg-card border border-default', r.cls].join(' ')} style={{ width: r.size, height: r.size }} />
              <span className="font-mono text-[10px] text-fg-subtle">{r.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Spacing */}
      <section className="flex flex-col gap-4">
        <h5 className="font-mono text-11 text-fg-muted tracking-caps uppercase">spacing</h5>
        <div className="flex flex-col gap-1.5 max-w-[420px]">
          {[
            { name: 'xs', value: 4  },
            { name: 'sm', value: 8  },
            { name: 'md', value: 12 },
            { name: 'lg', value: 16 },
            { name: 'xl', value: 24 },
          ].map((s) => (
            <div key={s.name} className="flex items-center gap-3">
              <div className="font-mono text-11 text-fg-muted w-10">{s.name}</div>
              <div className="bg-accent-primary h-2 rounded-xs" style={{ width: s.value * 4 }} />
              <div className="font-mono text-[10px] text-fg-subtle">{s.value}px</div>
            </div>
          ))}
        </div>
      </section>

      {/* Motion */}
      <section className="flex flex-col gap-4">
        <h5 className="font-mono text-11 text-fg-muted tracking-caps uppercase">motion</h5>
        <div className="font-mono text-12 text-fg-secondary leading-loose max-w-[640px]">
          <div><span className="text-fg-muted">duration ·</span> instant 80 / fast 120 / base 180 / slow 240 / enter 320</div>
          <div><span className="text-fg-muted">ease ·</span> enter <span className="text-accent-secondary-hi">cubic-bezier(.2, .8, .2, 1)</span> · exit <span className="text-accent-secondary-hi">cubic-bezier(.4, 0, .6, 1)</span></div>
          <div className="text-fg-muted italic mt-1">no bounce. no scale. opacity + translate, that's it.</div>
        </div>
      </section>

    </div>
  );
}

/* ---- brand page — mark, wordmark, voice ---- */

/* ---- Mark — the canonical SVG. tone shifts for monochrome / inverse use;
 * variant 'solid' fills all four quadrants for app-icon contexts where the
 * outline reads weakly at small sizes. ---- */

function Mark({ size = 96, tone = 'default', variant = 'outline', stroke = 1.5 }) {
  const palette = tone === 'inverse' ? { a: '#fbf1c7', b: '#fbf1c7', fill: 'rgba(251,241,199,0.18)' }
                : tone === 'mono'    ? { a: '#a89984', b: '#a89984', fill: 'rgba(168,153,132,0.18)' }
                : tone === 'on-dark' ? { a: '#fabd2f', b: '#8ec07c', fill: 'rgba(251,189,47,0.22)' }
                : tone === 'on-light'? { a: '#b57614', b: '#427b58', fill: 'rgba(181,118,20,0.22)' }
                :                       { a: '#d79921', b: '#689d6a', fill: 'rgba(215,153,33,0.18)' };
  const w = (8 / 24) * size; // for solid variant scaling reference
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      {variant === 'solid' ? (
        <>
          <rect x="3"  y="3"  width="8" height="8" rx="1" fill={palette.a} />
          <rect x="13" y="3"  width="8" height="8" rx="1" fill={palette.b} />
          <rect x="3"  y="13" width="8" height="8" rx="1" fill={palette.b} />
          <rect x="13" y="13" width="8" height="8" rx="1" fill={palette.a} />
        </>
      ) : (
        <>
          <rect x="3"  y="3"  width="8" height="8" rx="1" stroke={palette.a} strokeWidth={stroke} />
          <rect x="13" y="3"  width="8" height="8" rx="1" stroke={palette.b} strokeWidth={stroke} />
          <rect x="3"  y="13" width="8" height="8" rx="1" stroke={palette.b} strokeWidth={stroke} />
          <rect x="13" y="13" width="8" height="8" rx="1" stroke={palette.a} strokeWidth={stroke} fill={palette.fill} />
        </>
      )}
    </svg>
  );
}

/* Render the Mark to an SVG string for downloads / data-URI hacks. Supports
 * the same tone/variant matrix as the React Mark component. */
function markSvgString({ size = 512, tone = 'default', variant = 'solid', stroke = 2.5 } = {}) {
  const palette = {
    'default':  { a: '#d79921', b: '#689d6a' },
    'on-light': { a: '#b57614', b: '#427b58' },
    'inverse':  { a: '#fbf1c7', b: '#fbf1c7' },
    'amber':    { a: '#d79921', b: '#d79921' },
    'aqua':     { a: '#689d6a', b: '#689d6a' },
  }[tone] || { a: '#d79921', b: '#689d6a' };
  const cells = [
    { x: 3,  y: 3,  c: palette.a },
    { x: 13, y: 3,  c: palette.b },
    { x: 3,  y: 13, c: palette.b },
    { x: 13, y: 13, c: palette.a },
  ];
  const rect = ({ x, y, c }) =>
    variant === 'outline'
      ? `<rect x="${x}" y="${y}" width="8" height="8" rx="1" fill="none" stroke="${c}" stroke-width="${stroke}"/>`
      : `<rect x="${x}" y="${y}" width="8" height="8" rx="1" fill="${c}"/>`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">` +
    cells.map(rect).join('') +
    `</svg>`
  );
}

/* The five on-brand favicon faces the FaviconHack button cycles through. */
const FAVICON_VARIANTS = [
  { id: 'default', label: 'default', tone: 'default', variant: 'solid'   },
  { id: 'outline', label: 'outline', tone: 'default', variant: 'outline' },
  { id: 'amber',   label: 'all amber', tone: 'amber',   variant: 'solid' },
  { id: 'aqua',    label: 'all aqua',  tone: 'aqua',    variant: 'solid' },
  { id: 'inverse', label: 'inverse',   tone: 'inverse', variant: 'solid' },
];

const ICON_SIZES = [16, 24, 32, 48, 64, 96, 128, 180, 192, 256, 512];

function IconTile({ size, tone = 'default', variant = 'outline' }) {
  // Cap the rendered tile at 128 so the page doesn't get gigantic; for
  // larger sizes, the tile shows the icon at 128 with a "displayed @ N" tag.
  const display = Math.min(size, 128);
  const scaled = display !== size;
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="flex items-center justify-center bg-sunken border border-subtle rounded-sm"
        style={{ width: 144, height: 144 }}
      >
        <Mark size={display} tone={tone} variant={variant} stroke={size <= 24 ? 2 : 1.5} />
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="font-mono text-11 text-fg-display">{size}<span className="text-fg-subtle">×{size}</span></span>
        {scaled && <span className="font-mono text-[9px] text-fg-subtle">scaled to {display}px</span>}
      </div>
    </div>
  );
}

/* Mask shape variants — a 96×96 tile with the Mark inside a clipped shape.
 * 'squircle' = iOS-style superellipse (approximated with a high border-radius
 * + overflow-hidden), 'circle' = perfect round, 'rounded' = Android-ish,
 * 'maskable' = PWA safe-zone visualization (icon shrunk inside a 80% safe area). */
function MaskedIcon({ shape, label, hint }) {
  const radius = shape === 'circle' ? '50%' : shape === 'squircle' ? '28%' : '18%';
  const inner = shape === 'maskable' ? 70 : 96;
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="flex items-center justify-center bg-accent-primary"
        style={{ width: 112, height: 112, borderRadius: radius, overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,0.35)' }}
      >
        <Mark size={inner} tone="on-light" variant="solid" />
      </div>
      <div className="flex flex-col items-center gap-0.5 max-w-[120px] text-center">
        <span className="font-mono text-11 text-fg-display">{label}</span>
        <span className="font-mono text-[10px] text-fg-subtle leading-tight">{hint}</span>
      </div>
    </div>
  );
}

/* ---- In-context mockups — pixel approximations of where the brand actually shows up ---- */

function BrowserTabMockup() {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-11 text-fg-muted">browser tab</span>
      <div className="flex items-stretch h-9 rounded-t-md overflow-hidden">
        <div
          className="flex items-center gap-2 pl-3 pr-4 bg-card border-t border-l border-r border-default rounded-t-md min-w-0"
          style={{ maxWidth: 240 }}
        >
          <Mark size={14} variant="solid" />
          <span className="font-sans text-12 text-fg-primary truncate">atelier — a quiet room…</span>
          <span className="font-mono text-11 text-fg-subtle hover:text-fg-display cursor-default">×</span>
        </div>
        <div className="flex items-center px-3 bg-sunken border-b border-default">
          <span className="font-mono text-11 text-fg-subtle">+</span>
        </div>
        <div className="flex-1 bg-sunken border-b border-default" />
      </div>
    </div>
  );
}

function MacDockMockup() {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-11 text-fg-muted">macos dock</span>
      <div
        className="flex items-end gap-3 px-4 py-2 rounded-lg"
        style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.10)' }}
      >
        {/* placeholder app icons */}
        <div className="w-12 h-12 rounded-[14px] bg-gb-blue" />
        <div className="w-12 h-12 rounded-[14px] bg-gb-purple" />
        <div className="w-12 h-12 rounded-[14px] bg-gb-aqua" />
        {/* Atelier icon — squircle with shadow + tiny indicator dot */}
        <div className="relative">
          <div
            className="w-14 h-14 rounded-[16px] flex items-center justify-center bg-accent-primary"
            style={{ boxShadow: '0 6px 16px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.20)' }}
          >
            <Mark size={48} tone="on-light" variant="solid" />
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-1 h-1 rounded-full bg-fg-display" />
        </div>
        <div className="w-12 h-12 rounded-[14px] bg-gb-red" />
        <div className="w-12 h-12 rounded-[14px] bg-gb-green" />
      </div>
    </div>
  );
}

function MenuBarMockup() {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-11 text-fg-muted">macos menu bar</span>
      <div className="flex items-center h-7 rounded-sm border border-default" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}>
        <span className="font-sans text-11 font-semibold text-fg-display px-3"></span>
        <span className="font-sans text-11 font-semibold text-fg-display pr-3">Atelier</span>
        <span className="font-sans text-11 text-fg-secondary pr-3">File</span>
        <span className="font-sans text-11 text-fg-secondary pr-3">Edit</span>
        <span className="font-sans text-11 text-fg-secondary pr-3">View</span>
        <div className="flex-1" />
        <span className="font-mono text-11 text-fg-secondary pr-3">▶</span>
        <span className="font-mono text-11 text-fg-secondary pr-3">🔋</span>
        <div className="px-2 inline-flex items-center" title="atelier statusbar icon">
          <Mark size={14} tone="inverse" variant="outline" stroke={2} />
        </div>
        <span className="font-mono text-11 text-fg-secondary pr-3">Tue 4:38</span>
      </div>
    </div>
  );
}

function NotificationMockup() {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-11 text-fg-muted">macos notification</span>
      <div
        className="flex items-start gap-3 px-3 py-2.5 rounded-lg w-[320px]"
        style={{ background: 'rgba(50,48,47,0.92)', border: '1px solid var(--color-border-default)', backdropFilter: 'blur(20px)', boxShadow: '0 12px 36px rgba(0,0,0,0.45)' }}
      >
        <div
          className="w-9 h-9 rounded-md flex-none flex items-center justify-center bg-accent-primary"
          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.30)' }}
        >
          <Mark size={26} tone="on-light" variant="solid" />
        </div>
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="font-sans text-12 font-semibold text-fg-display truncate">Atelier</span>
            <span className="font-sans text-11 text-fg-muted flex-1">now</span>
          </div>
          <div className="font-sans text-12 text-fg-primary leading-snug">drafter just opened a card</div>
          <div className="font-sans text-11 text-fg-secondary truncate leading-snug">atl-211 · confirm warm palette for warning signals</div>
        </div>
      </div>
    </div>
  );
}

function IOSHomeMockup() {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-11 text-fg-muted">ios home screen</span>
      <div className="flex flex-col items-center gap-1.5">
        <div
          className="w-16 h-16 flex items-center justify-center bg-accent-primary"
          style={{ borderRadius: '22%', boxShadow: '0 4px 14px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.20)' }}
        >
          <Mark size={52} tone="on-light" variant="solid" />
        </div>
        <span className="font-sans text-11 text-fg-display">Atelier</span>
      </div>
    </div>
  );
}

/* ---- Open Graph / social card preview — fake share at scaled-down 600×315 ---- */

function OgCard() {
  return (
    <div
      className="flex flex-col rounded-md overflow-hidden border border-default"
      style={{ width: 600 }}
    >
      {/* the image — what gets crawled and shown */}
      <div className="relative" style={{ width: 600, height: 315, background: 'var(--color-bg-canvas)' }}>
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute inset-0 flex items-center gap-7 px-12">
          <Mark size={88} variant="solid" />
          <div className="flex flex-col gap-2">
            <div className="font-display italic text-[56px] text-fg-display leading-none tracking-[-0.025em]">atelier</div>
            <div className="font-display italic text-[20px] text-fg-secondary leading-tight tracking-[-0.015em]">A quiet room for loud work.</div>
            <div className="font-mono text-11 text-fg-muted tracking-caps lowercase mt-1">warm dark · gruvbox · workspace shell</div>
          </div>
        </div>
      </div>
      {/* the social-platform chrome */}
      <div className="flex flex-col gap-1 px-4 py-3 bg-card border-t border-default">
        <div className="font-mono text-11 text-fg-muted">atelier.local</div>
        <div className="font-sans text-13 font-semibold text-fg-display">Atelier — A quiet room for loud work.</div>
        <div className="font-sans text-12 text-fg-secondary leading-snug">A workspace shell that hosts independent modules. Warm dark, dense, mono-leaning. Carved from Gruvbox.</div>
      </div>
    </div>
  );
}

/* ---- Tileable patterns — Atelier-true, not generic wallpaper.
 *
 * The brand visual properties dictate the constraints:
 *   • SQUARE geometry — the design system caps radius at lg (10px); pills,
 *     capsules, and full circles belong only to status dots.
 *   • Restraint — "when in doubt, prefer subtraction."
 *   • Drafting / atelier metaphor — the canvas already has a 24px dot grid
 *     (.grid-bg) that hints at graph paper. These patterns are in that
 *     family: blueprint, registration marks, crop marks, module index.
 *   • Tonal palette — patterns mostly use SUBTLE borders (#3c3836, #504945,
 *     #665c54) for texture; reserve amber/aqua for moments of presence.
 *
 * No flowing arcs, no decorative wallpaper. These are textures that could
 * sit behind a module without competing with it. */

const PATTERNS = [
  {
    title: 'graph · paper',
    hint: '32px tile · subtle crosshatch · the drafting baseline',
    size: 32,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
      <line x1="0" y1="0" x2="32" y2="0" stroke="#3c3836" stroke-width="1"/>
      <line x1="0" y1="0" x2="0"  y2="32" stroke="#3c3836" stroke-width="1"/>
    </svg>`,
  },
  {
    title: 'drafting · dots',
    hint: '24px tile · sparse grid · the canvas backdrop',
    size: 24,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <circle cx="0" cy="0" r="1" fill="#504945"/>
    </svg>`,
  },
  {
    title: 'registration · cross',
    hint: "32px tile · printer's marks at every intersection",
    size: 32,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" stroke="#d79921" stroke-width="1" stroke-linecap="square">
      <line x1="-4" y1="0" x2="4" y2="0"/>
      <line x1="0" y1="-4" x2="0" y2="4"/>
    </svg>`,
  },
  {
    title: 'frame · corners',
    hint: '32px tile · L-marks meet to crop a module placeholder',
    size: 32,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" stroke="#665c54" stroke-width="1" fill="none">
      <path d="M 0,5 L 0,0 L 5,0"/>
      <path d="M 27,0 L 32,0 L 32,5"/>
      <path d="M 0,27 L 0,32 L 5,32"/>
      <path d="M 32,27 L 32,32 L 27,32"/>
    </svg>`,
  },
  {
    title: 'blueprint · two-tier',
    hint: '32px tile · major + minor dots · architectural underlay',
    size: 32,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
      <circle cx="0"  cy="0"  r="1.5"  fill="#504945"/>
      <circle cx="16" cy="16" r="0.75" fill="#3c3836"/>
    </svg>`,
  },
  {
    title: 'module · index',
    hint: '64px tile · the mark at sparse intervals · brand-forward',
    size: 64,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
      <circle cx="0"  cy="0"  r="1" fill="#504945"/>
      <circle cx="32" cy="32" r="1" fill="#504945"/>
      <g transform="translate(28,4)">
        <rect x="0" y="0" width="3" height="3" rx="0.5" fill="#d79921"/>
        <rect x="5" y="0" width="3" height="3" rx="0.5" fill="#689d6a"/>
        <rect x="0" y="5" width="3" height="3" rx="0.5" fill="#689d6a"/>
        <rect x="5" y="5" width="3" height="3" rx="0.5" fill="#d79921"/>
      </g>
      <g transform="translate(4,36)">
        <rect x="0" y="0" width="3" height="3" rx="0.5" fill="#d79921"/>
        <rect x="5" y="0" width="3" height="3" rx="0.5" fill="#689d6a"/>
        <rect x="0" y="5" width="3" height="3" rx="0.5" fill="#689d6a"/>
        <rect x="5" y="5" width="3" height="3" rx="0.5" fill="#d79921"/>
      </g>
    </svg>`,
  },
];

function PatternFrame({ title, hint, svg, size, height = 120 }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-11 text-fg-display tracking-caps lowercase">{title}</span>
        <span className="font-mono text-11 text-fg-subtle">{hint}</span>
      </div>
      <div
        className="rounded-sm overflow-hidden border border-default bg-sunken"
        style={{
          height,
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
          backgroundRepeat: 'repeat',
          backgroundSize: `${size}px ${size}px`,
        }}
      />
    </div>
  );
}

/* ---- HTML head metadata snippet — real-world copy-paste ---- */

const META_HTML = `<!-- core -->
<title>Atelier — A quiet room for loud work.</title>
<meta name="description"  content="A workspace shell that hosts independent modules. Warm dark, dense, mono-leaning." />
<meta name="theme-color"  content="#282828" media="(prefers-color-scheme: dark)" />
<meta name="theme-color"  content="#f7f5f2" media="(prefers-color-scheme: light)" />

<!-- favicons -->
<link rel="icon"             type="image/svg+xml" href="/icon.svg" />
<link rel="icon"             sizes="16x16"        href="/icon-16.png" />
<link rel="icon"             sizes="32x32"        href="/icon-32.png" />
<link rel="apple-touch-icon" sizes="180x180"      href="/apple-touch-icon.png" />
<link rel="manifest"                              href="/manifest.webmanifest" />

<!-- open graph -->
<meta property="og:title"        content="Atelier — A quiet room for loud work." />
<meta property="og:description"  content="A workspace shell that hosts independent modules." />
<meta property="og:image"        content="/og.png" />
<meta property="og:url"          content="https://atelier.local" />
<meta property="og:type"         content="website" />

<!-- twitter / x -->
<meta name="twitter:card"        content="summary_large_image" />
<meta name="twitter:title"       content="Atelier" />
<meta name="twitter:description" content="A quiet room for loud work." />
<meta name="twitter:image"       content="/og.png" />`;

/* ---- The hack: cycle the browser tab's favicon through 5 on-brand variants.
 * Stays useful even when the page already ships with a default favicon —
 * it becomes a "favicon mood ring" that swaps the live <link rel="icon">. */

function FaviconHack() {
  const [idx, setIdx] = useState(-1); // -1 = nothing applied yet
  const apply = (i) => {
    const v = FAVICON_VARIANTS[i];
    const svg = markSvgString({ size: 64, tone: v.tone, variant: v.variant, stroke: 3 });
    const url = 'data:image/svg+xml;base64,' + btoa(svg);
    document.querySelectorAll('link[rel~="icon"]').forEach((n) => n.parentNode.removeChild(n));
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = url;
    document.head.appendChild(link);
    setIdx(i);
  };
  const cycle = () => apply(((idx < 0 ? -1 : idx) + 1) % FAVICON_VARIANTS.length);
  const current = idx >= 0 ? FAVICON_VARIANTS[idx] : null;
  const nextV = FAVICON_VARIANTS[(idx < 0 ? 0 : (idx + 1) % FAVICON_VARIANTS.length)];

  return (
    <div className="flex flex-col gap-1.5 items-end">
      <button
        onClick={cycle}
        title={current ? `next: ${nextV.label}` : `apply ${nextV.label} favicon`}
        className="group inline-flex items-center gap-2 font-mono text-11 px-2.5 py-1.5 rounded-sm border border-default text-fg-secondary bg-card hover:border-accent-primary hover:text-accent-primary-hi hover:bg-card-hi transition-colors duration-fast cursor-pointer"
      >
        <span
          key={current ? current.id : 'idle'}
          className="inline-flex"
          style={{ width: 14, height: 14, animation: 'kit-modal-rise 220ms cubic-bezier(.2,.8,.2,1) both' }}
        >
          <Mark
            size={14}
            tone={current ? current.tone : 'default'}
            variant={current ? current.variant : 'solid'}
            stroke={current && current.variant === 'outline' ? 2.5 : 1.5}
          />
        </span>
        <span className="tabular-nums">{current ? current.label : 'set tab favicon'}</span>
        <span className="inline-flex text-fg-subtle group-hover:text-accent-primary-hi transition-transform duration-base ease-enter group-hover:rotate-90">
          <i data-lucide="rotate-cw" style={{ width: 11, height: 11 }} />
        </span>
      </button>
      {/* progress dots — show position in the cycle */}
      <div className="flex items-center gap-1">
        {FAVICON_VARIANTS.map((v, i) => (
          <button
            key={v.id}
            onClick={() => apply(i)}
            title={v.label}
            className="cursor-pointer p-0.5 -m-0.5"
            aria-label={`apply ${v.label}`}
          >
            <span
              className="block rounded-full transition-all duration-base ease-enter"
              style={{
                width: i === idx ? 6 : 4,
                height: i === idx ? 6 : 4,
                background: i === idx ? 'var(--color-accent-primary)' : 'var(--color-fg-subtle)',
                opacity: i === idx ? 1 : 0.6,
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---- Logo micro-gestures — atelier-quiet animations of the mark.
 * Each renders the standard Mark with one specific element animated.
 * Five variants:
 *   breath  — BR fill-opacity pulses (the mark is awake)
 *   wink    — TR briefly fades out and back, once per cycle
 *   shuffle — accent fill rotates clockwise around the four quadrants
 *   trace   — each quadrant's outline draws on then off, in sequence
 *   lift    — BR translates up 1px and back (a soft hover)
 * All loops, all opacity/translate. Nothing announces itself. */

function LogoGestureCanvas({ children, title, hint }) {
  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="flex items-center justify-center bg-sunken border border-subtle rounded-sm" style={{ width: 144, height: 144 }}>
        {children}
      </div>
      <div className="flex flex-col items-center gap-0.5 text-center">
        <span className="font-mono text-11 text-fg-display tracking-caps lowercase">{title}</span>
        <span className="font-mono text-[10px] text-fg-subtle leading-tight">{hint}</span>
      </div>
    </div>
  );
}

function LogoGesture({ variant, title, hint, size = 72 }) {
  const stroke = 1.5;
  const cells = [
    { x: 3,  y: 3,  c: '#d79921', key: 'tl' },
    { x: 13, y: 3,  c: '#689d6a', key: 'tr' },
    { x: 3,  y: 13, c: '#689d6a', key: 'bl' },
    { x: 13, y: 13, c: '#d79921', key: 'br' },
  ];

  if (variant === 'breath') {
    return (
      <LogoGestureCanvas title={title} hint={hint}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {cells.slice(0, 3).map((c) => (
            <rect key={c.key} x={c.x} y={c.y} width="8" height="8" rx="1" stroke={c.c} strokeWidth={stroke} />
          ))}
          <rect
            x="13" y="13" width="8" height="8" rx="1"
            stroke="#d79921" strokeWidth={stroke}
            fill="#d79921"
            style={{ animation: 'kit-logo-breath 4s ease-in-out infinite' }}
          />
        </svg>
      </LogoGestureCanvas>
    );
  }

  if (variant === 'wink') {
    return (
      <LogoGestureCanvas title={title} hint={hint}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="3"  y="3"  width="8" height="8" rx="1" stroke="#d79921" strokeWidth={stroke} />
          <rect
            x="13" y="3" width="8" height="8" rx="1"
            stroke="#689d6a" strokeWidth={stroke}
            style={{ animation: 'kit-logo-wink 3.5s ease-in-out infinite' }}
          />
          <rect x="3"  y="13" width="8" height="8" rx="1" stroke="#689d6a" strokeWidth={stroke} />
          <rect x="13" y="13" width="8" height="8" rx="1" stroke="#d79921" strokeWidth={stroke} fill="rgba(215,153,33,0.18)" />
        </svg>
      </LogoGestureCanvas>
    );
  }

  if (variant === 'shuffle') {
    // Order goes clockwise: TL → TR → BR → BL
    const delays = { tl: '0s', tr: '1s', br: '2s', bl: '3s' };
    return (
      <LogoGestureCanvas title={title} hint={hint}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {cells.map((c) => (
            <rect
              key={c.key}
              x={c.x} y={c.y} width="8" height="8" rx="1"
              stroke={c.c} strokeWidth={stroke}
              fill={c.c}
              style={{ animation: 'kit-logo-shuffle 4s linear infinite', animationDelay: delays[c.key] }}
            />
          ))}
        </svg>
      </LogoGestureCanvas>
    );
  }

  if (variant === 'trace') {
    // Order traces clockwise: TL → TR → BR → BL
    const delays = { tl: '0s', tr: '0.2s', br: '0.4s', bl: '0.6s' };
    return (
      <LogoGestureCanvas title={title} hint={hint}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {cells.map((c) => (
            <rect
              key={c.key}
              x={c.x} y={c.y} width="8" height="8" rx="1"
              stroke={c.c} strokeWidth={stroke}
              strokeDasharray="40"
              style={{ animation: 'kit-logo-trace 4s ease-out infinite', animationDelay: delays[c.key] }}
            />
          ))}
        </svg>
      </LogoGestureCanvas>
    );
  }

  if (variant === 'lift') {
    return (
      <LogoGestureCanvas title={title} hint={hint}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="3"  y="3"  width="8" height="8" rx="1" stroke="#d79921" strokeWidth={stroke} />
          <rect x="13" y="3"  width="8" height="8" rx="1" stroke="#689d6a" strokeWidth={stroke} />
          <rect x="3"  y="13" width="8" height="8" rx="1" stroke="#689d6a" strokeWidth={stroke} />
          <rect
            x="13" y="13" width="8" height="8" rx="1"
            stroke="#d79921" strokeWidth={stroke}
            fill="rgba(215,153,33,0.18)"
            style={{ animation: 'kit-logo-lift 3s ease-in-out infinite', transformBox: 'fill-box', transformOrigin: 'center' }}
          />
        </svg>
      </LogoGestureCanvas>
    );
  }

  if (variant === 'rotate') {
    // The two diagonals (amber/aqua) cross-fade and swap. Cells starting
    // amber use kit-logo-rot-a; aqua cells use kit-logo-rot-b. Same 5s
    // cycle, so at the midpoint both diagonals have flipped at once and
    // the mark is in the inverse arrangement, then back.
    return (
      <LogoGestureCanvas title={title} hint={hint}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="3"  y="3"  width="8" height="8" rx="1" strokeWidth={stroke} style={{ animation: 'kit-logo-rot-a 5s ease-in-out infinite' }} />
          <rect x="13" y="3"  width="8" height="8" rx="1" strokeWidth={stroke} style={{ animation: 'kit-logo-rot-b 5s ease-in-out infinite' }} />
          <rect x="3"  y="13" width="8" height="8" rx="1" strokeWidth={stroke} style={{ animation: 'kit-logo-rot-b 5s ease-in-out infinite' }} />
          <rect x="13" y="13" width="8" height="8" rx="1" strokeWidth={stroke} style={{ animation: 'kit-logo-rot-a 5s ease-in-out infinite' }} />
        </svg>
      </LogoGestureCanvas>
    );
  }

  return null;
}

function BrandPage() {
  return (
    <div className="mt-10 flex flex-col gap-16" data-kit-page>

      {/* Mark + wordmark */}
      <section className="flex items-center gap-8 max-w-[760px]">
        <Mark size={96} />
        <div className="flex flex-col gap-3">
          <div className="font-display italic text-[64px] text-fg-display leading-none tracking-[-0.025em]">
            atelier
          </div>
          <div className="font-mono text-11 text-fg-muted tracking-caps lowercase">
            warm dark · gruvbox · workspace shell
          </div>
        </div>
        <div className="flex-1" />
        <FaviconHack />
      </section>

      {/* Tagline */}
      <section className="flex flex-col gap-3 max-w-[760px]">
        <h5 className="font-mono text-11 text-fg-muted tracking-caps uppercase">tagline</h5>
        <p className="font-display italic text-28 text-fg-display leading-tight tracking-[-0.015em] max-w-[560px]">
          A quiet room for loud work.
        </p>
      </section>

      {/* Origin — the painting and the painter */}
      <section className="flex flex-col gap-4 max-w-[820px]">
        <h5 className="font-mono text-11 text-fg-muted tracking-caps uppercase">origin · the painting and the painter</h5>
        <blockquote
          className="font-display italic text-23 text-fg-display leading-snug tracking-[-0.015em] max-w-[620px] pl-4"
          style={{ borderLeft: '2px solid var(--color-accent-primary)' }}
        >
          “The painting cannot be like the painter, for otherwise it would have painted itself. And no matter how perfect the painting may be, in comparison with the painter it is utterly deficient.”
        </blockquote>
        <div className="font-mono text-11 text-fg-muted tracking-caps lowercase pl-4">
          — ‘Abdu’l-Bahá <span className="text-fg-subtle">· some answered questions</span>
        </div>
        <p className="font-sans text-13 text-fg-secondary leading-body max-w-[600px] mt-2">
          atelier is a workshop where paintings come into being. the agents are paintings; the user is the painter.
          the work reveals more of the painter than the painter could say outright — but the painting can never
          comprehend its painter. the shell stays quiet so that asymmetry has room to breathe.
        </p>

        {/* The longer story — three small panels */}
        <div className="grid grid-cols-3 gap-5 mt-6">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-11 text-accent-secondary-hi tracking-caps lowercase">i · the conversation</span>
            <p className="font-sans text-12 text-fg-secondary leading-body">
              the line was spoken at table in <span className="text-fg-display">‘akká</span>, between 1904 and 1906.
              laura dreyfus-barney came with questions; ‘abdu’l-bahá answered. she wrote them down. the book that
              became <em>some answered questions</em> is itself an atelier — a workshop where understanding is
              produced by two people in conversation.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-11 text-accent-secondary-hi tracking-caps lowercase">ii · the argument</span>
            <p className="font-sans text-12 text-fg-secondary leading-body">
              the metaphor serves a strange claim: <span className="text-fg-display">deficiency testifies to perfection</span>.
              weakness implies the existence of power; without power, weakness could not be imagined. the painting
              proves the painter not by resembling him but by the particular way it falls short of him.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-11 text-accent-secondary-hi tracking-caps lowercase">iii · the echo</span>
            <p className="font-sans text-12 text-fg-secondary leading-body">
              years earlier, ‘abdu’l-bahá sat for the painter <span className="text-fg-display">juliet thompson</span> and asked
              her to paint his <em>servitude to god</em>. she answered that only the holy spirit could accomplish
              such a task. she painted him anyway. the impossible commission is the whole job.
            </p>
          </div>
        </div>

        <p
          className="font-display italic text-19 text-fg-display leading-snug tracking-[-0.015em] max-w-[680px] mt-6 pl-4"
          style={{ borderLeft: '2px solid var(--color-border-default)' }}
        >
          So: the agents work, and what they produce is offered back. The atelier doesn’t pretend to know its painter.
          It just keeps the room quiet enough that the painter can hear what the work has been trying to say about them.
        </p>
      </section>

      {/* Voice */}
      <section className="flex flex-col gap-3 max-w-[760px]">
        <h5 className="font-mono text-11 text-fg-muted tracking-caps uppercase">voice</h5>
        <div className="grid grid-cols-2 gap-x-10 gap-y-3 font-sans text-13 text-fg-primary leading-body">
          <div>
            <span className="font-mono text-11 text-accent-secondary-hi">low-case</span>
            <p className="text-fg-secondary">labels, headings, buttons, tabs. capitalize only proper nouns and the first word of prose sentences.</p>
          </div>
          <div>
            <span className="font-mono text-11 text-accent-secondary-hi">mono for data</span>
            <p className="text-fg-secondary">ids, timestamps, counts, agent names. if it's not language, it's mono.</p>
          </div>
          <div>
            <span className="font-mono text-11 text-accent-secondary-hi">italic for moments</span>
            <p className="text-fg-secondary">newsreader italic for hero, display, taglines. used like a single drumbeat — never as decoration.</p>
          </div>
          <div>
            <span className="font-mono text-11 text-accent-secondary-hi">subtraction</span>
            <p className="text-fg-secondary">when in doubt, remove. the shell is quiet so the modules can speak.</p>
          </div>
        </div>
      </section>

      {/* Color story */}
      <section className="flex flex-col gap-3 max-w-[760px]">
        <h5 className="font-mono text-11 text-fg-muted tracking-caps uppercase">color story</h5>
        <p className="font-sans text-13 text-fg-secondary leading-body max-w-[560px]">
          carved from <span className="font-mono text-12 text-accent-secondary-hi">gruvbox dark</span>, kept warm.
          one accent — <span className="font-mono text-12" style={{color:'#fabd2f'}}>amber</span> — for everything that
          says "this is interactive and important." one secondary — <span className="font-mono text-12" style={{color:'#8ec07c'}}>aqua</span> —
          for attribution. everything else lives on a five-step ladder of brown.
        </p>
        <div className="flex h-10 rounded-sm overflow-hidden border border-default mt-2">
          {['bg-sunken','bg-canvas','bg-raised','bg-card','bg-card-hi'].map(v => (
            <div key={v} className="flex-1" style={{background:`var(--color-${v})`}} />
          ))}
          <div className="w-12" style={{background:'var(--color-accent-primary)'}} />
          <div className="w-8" style={{background:'var(--color-accent-secondary)'}} />
        </div>
      </section>

      {/* Typography stack */}
      <section className="flex flex-col gap-3 max-w-[760px]">
        <h5 className="font-mono text-11 text-fg-muted tracking-caps uppercase">typography stack</h5>
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-3">
            <span className="font-display italic text-28 text-fg-display tracking-[-0.015em]">Newsreader</span>
            <span className="font-mono text-11 text-fg-muted">— display · italic only</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-sans text-23 text-fg-display">Inter</span>
            <span className="font-mono text-11 text-fg-muted">— body · ui</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-19 text-fg-display">JetBrains Mono</span>
            <span className="font-mono text-11 text-fg-muted">— data · identifiers · labels</span>
          </div>
        </div>
      </section>

      {/* Icon suite — the full size grid */}
      <section className="flex flex-col gap-4">
        <div className="flex items-baseline gap-3">
          <h5 className="font-mono text-11 text-fg-muted tracking-caps uppercase">icon suite</h5>
          <span className="font-mono text-11 text-fg-subtle">— every size you'll need, generated from one svg source</span>
        </div>
        <div className="flex flex-wrap gap-4">
          {ICON_SIZES.map((s) => <IconTile key={s} size={s} variant={s <= 32 ? 'solid' : 'outline'} />)}
        </div>
      </section>

      {/* Mask shapes — same icon, different platform clipping */}
      <section className="flex flex-col gap-4">
        <div className="flex items-baseline gap-3">
          <h5 className="font-mono text-11 text-fg-muted tracking-caps uppercase">mask shapes</h5>
          <span className="font-mono text-11 text-fg-subtle">— same icon, every platform's preferred silhouette</span>
        </div>
        <div className="flex flex-wrap gap-6">
          <MaskedIcon shape="squircle" label="ios" hint="22% squircle · apple-touch-icon" />
          <MaskedIcon shape="rounded"  label="android" hint="18% rounded · adaptive icon" />
          <MaskedIcon shape="circle"   label="avatar" hint="circle mask · social, github" />
          <MaskedIcon shape="maskable" label="pwa maskable" hint="80% safe-zone · 'any maskable'" />
        </div>
      </section>

      {/* Mono / inverse / on-light variants */}
      <section className="flex flex-col gap-4">
        <div className="flex items-baseline gap-3">
          <h5 className="font-mono text-11 text-fg-muted tracking-caps uppercase">tonal variants</h5>
          <span className="font-mono text-11 text-fg-subtle">— for surfaces where the brand colors don't work</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 flex items-center justify-center bg-canvas border border-default rounded-sm">
              <Mark size={64} tone="default" />
            </div>
            <span className="font-mono text-11 text-fg-muted">default</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 flex items-center justify-center bg-canvas border border-default rounded-sm">
              <Mark size={64} tone="mono" />
            </div>
            <span className="font-mono text-11 text-fg-muted">mono · gray</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 flex items-center justify-center rounded-sm" style={{ background: '#1d2021' }}>
              <Mark size={64} tone="inverse" />
            </div>
            <span className="font-mono text-11 text-fg-muted">inverse · cream</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 flex items-center justify-center rounded-sm" style={{ background: '#f7f5f2' }}>
              <Mark size={64} tone="on-light" />
            </div>
            <span className="font-mono text-11 text-fg-muted">on light</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 flex items-center justify-center rounded-sm" style={{ background: '#fabd2f' }}>
              <Mark size={64} tone="on-light" variant="solid" />
            </div>
            <span className="font-mono text-11 text-fg-muted">on accent</span>
          </div>
        </div>
      </section>

      {/* In context — mockups of where the brand actually shows up */}
      <section className="flex flex-col gap-4">
        <div className="flex items-baseline gap-3">
          <h5 className="font-mono text-11 text-fg-muted tracking-caps uppercase">in context</h5>
          <span className="font-mono text-11 text-fg-subtle">— the surfaces this brand actually has to live on</span>
        </div>
        <div className="grid grid-cols-2 gap-x-10 gap-y-8 max-w-[820px]">
          <BrowserTabMockup />
          <IOSHomeMockup />
          <MacDockMockup />
          <NotificationMockup />
        </div>
        <div className="mt-2"><MenuBarMockup /></div>
      </section>

      {/* Open Graph share preview */}
      <section className="flex flex-col gap-4">
        <div className="flex items-baseline gap-3">
          <h5 className="font-mono text-11 text-fg-muted tracking-caps uppercase">open graph · social card</h5>
          <span className="font-mono text-11 text-fg-subtle">— how the link previews when pasted into slack, x, imessage</span>
        </div>
        <OgCard />
      </section>

      {/* HTML head snippet — copy-paste-able */}
      <section className="flex flex-col gap-4">
        <div className="flex items-baseline gap-3">
          <h5 className="font-mono text-11 text-fg-muted tracking-caps uppercase">html &lt;head&gt; metadata</h5>
          <span className="font-mono text-11 text-fg-subtle">— the actual tags you'd ship in production</span>
        </div>
        <pre
          className="font-mono text-12 leading-snug text-fg-secondary bg-sunken border border-default rounded-sm px-4 py-3 overflow-auto max-w-[820px] shadow-inset-well"
          style={{ tabSize: 2 }}
        >
{META_HTML}
        </pre>
      </section>

      {/* Logo micro-gestures — the mark, animated quietly */}
      <section className="flex flex-col gap-5">
        <div className="flex items-baseline gap-3">
          <h5 className="font-mono text-11 text-fg-muted tracking-caps uppercase">logo · gestures</h5>
          <span className="font-mono text-11 text-fg-subtle">— micro motions. atelier is silent. you have to be looking.</span>
        </div>
        <div className="grid grid-cols-6 gap-3 max-w-[820px]">
          <LogoGesture variant="breath"  title="breath"  hint="4s · alive" />
          <LogoGesture variant="wink"    title="wink"    hint="3.5s · once per cycle" />
          <LogoGesture variant="shuffle" title="shuffle" hint="4s · accent rotates" />
          <LogoGesture variant="trace"   title="trace"   hint="4s · draws on" />
          <LogoGesture variant="lift"    title="lift"    hint="3s · 1px hover" />
          <LogoGesture variant="rotate"  title="rotate"  hint="5s · diagonals swap" />
        </div>
      </section>

      {/* Tileable patterns — seamless wallpaper tiles built from the mark */}
      <section className="flex flex-col gap-5">
        <div className="flex items-baseline gap-3">
          <h5 className="font-mono text-11 text-fg-muted tracking-caps uppercase">patterns · tiles</h5>
          <span className="font-mono text-11 text-fg-subtle">— each is a single tile that repeats x and y. zoom your browser to see the seam (you won't).</span>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-5 max-w-[820px]">
          {PATTERNS.map((p) => (
            <PatternFrame key={p.title} {...p} />
          ))}
        </div>
      </section>

    </div>
  );
}

/* Page transitions — micro fade + directional slide. Forward (kit → design
 * → brand) glides in from the right; backward from the left. Direction is
 * computed from the index delta against the previous render. Keyframes are
 * injected once via a <style> tag so the module owns its own motion. */
if (typeof document !== 'undefined' && !document.getElementById('kit-page-anim')) {
  const s = document.createElement('style');
  s.id = 'kit-page-anim';
  s.textContent = `
    /* Fallback page transitions — used in browsers without startViewTransition */
    @keyframes kit-page-in-fwd { from { opacity: 0; transform: translateX(14px);  } to { opacity: 1; transform: translateX(0); } }
    @keyframes kit-page-in-bwd { from { opacity: 0; transform: translateX(-14px); } to { opacity: 1; transform: translateX(0); } }

    /* Modal */
    @keyframes kit-modal-fade  { from { opacity: 0; } to { opacity: 1; } }
    @keyframes kit-modal-rise  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }


    /* Logo micro-gestures — atelier is silent. None of these announce
     * themselves; you have to be looking. All loops, all opacity/translate. */
    @keyframes kit-logo-breath  { 0%,100% { fill-opacity: 0.18; } 50% { fill-opacity: 0.55; } }
    @keyframes kit-logo-wink    { 0%,82%,100% { opacity: 1; } 86%,90% { opacity: 0; } }
    @keyframes kit-logo-shuffle { 0%,100% { fill-opacity: 0.12; } 22% { fill-opacity: 0.65; } 44% { fill-opacity: 0.12; } }
    @keyframes kit-logo-trace   { 0% { stroke-dashoffset: 40; } 25% { stroke-dashoffset: 0; } 88% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -40; } }
    @keyframes kit-logo-lift    { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-1px); } }
    @keyframes kit-logo-rot-a   { 0%,100% { stroke: #d79921; } 50% { stroke: #689d6a; } }
    @keyframes kit-logo-rot-b   { 0%,100% { stroke: #689d6a; } 50% { stroke: #d79921; } }


    /* Staggered cascade — runs on incoming page sections after the
     * view-transition snapshot completes. Direct children only, capped at 12. */
    @keyframes kit-row-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    [data-kit-page] > * {
      animation: kit-row-in 280ms cubic-bezier(.2,.8,.2,1) both;
    }
    [data-kit-page] > *:nth-child(1)  { animation-delay: 0ms;   }
    [data-kit-page] > *:nth-child(2)  { animation-delay: 30ms;  }
    [data-kit-page] > *:nth-child(3)  { animation-delay: 60ms;  }
    [data-kit-page] > *:nth-child(4)  { animation-delay: 90ms;  }
    [data-kit-page] > *:nth-child(5)  { animation-delay: 120ms; }
    [data-kit-page] > *:nth-child(6)  { animation-delay: 150ms; }
    [data-kit-page] > *:nth-child(7)  { animation-delay: 180ms; }
    [data-kit-page] > *:nth-child(8)  { animation-delay: 210ms; }
    [data-kit-page] > *:nth-child(9)  { animation-delay: 240ms; }
    [data-kit-page] > *:nth-child(10) { animation-delay: 270ms; }
    [data-kit-page] > *:nth-child(11) { animation-delay: 300ms; }
    [data-kit-page] > *:nth-child(12) { animation-delay: 330ms; }

    /* View Transitions API customization. Default cross-fade is 250ms ease;
     * we lengthen + ease-enter to match the system motion vocabulary. Named
     * groups (vt-tab-*, vt-counter, vt-arrow) get a longer transition so the
     * title-word morph reads as a deliberate gesture, not a flash. */
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation-duration: 320ms;
      animation-timing-function: cubic-bezier(.2,.8,.2,1);
    }
    ::view-transition-group(vt-tab-kit),
    ::view-transition-group(vt-tab-design),
    ::view-transition-group(vt-tab-brand),
    ::view-transition-group(vt-tab-pegboard),
    ::view-transition-group(vt-counter),
    ::view-transition-group(vt-arrow),
    ::view-transition-group(vt-subtitle) {
      animation-duration: 480ms;
      animation-timing-function: cubic-bezier(.2,.8,.2,1);
    }
  `;
  document.head.appendChild(s);
}

/* =========================================================================
 * PEGBOARD PAGE — Atelier's empty surface. The .grid-bg pattern from the
 * shell stylesheet, full-bleed and tall, so we can see it as a primitive
 * before we start doing things to it.
 * ========================================================================= */

/* Build a smooth SVG path from a list of [x,y] points using a Catmull-Rom
 * spline (converted to cubic beziers). Smoother than raw L-segments, which
 * are jaggy when you drag a mouse. */
function smoothPath(points) {
  if (points.length < 2) return '';
  if (points.length === 2) return `M ${points[0][0]} ${points[0][1]} L ${points[1][0]} ${points[1][1]}`;
  const p = points;
  let d = `M ${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

function DrawnArrow({ points, inProgress }) {
  if (points.length < 2) return null;
  const d = smoothPath(points);
  return (
    <g stroke="#d79921" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path
        d={d}
        strokeWidth="1.4"
        opacity={inProgress ? 0.7 : 0.92}
        filter="url(#peg-line)"
        markerEnd={inProgress ? undefined : 'url(#peg-arrow)'}
      />
      <path
        d={d}
        strokeWidth="0.85"
        opacity={inProgress ? 0.35 : 0.45}
        stroke="#fabd2f"
        filter="url(#peg-line-2)"
      />
    </g>
  );
}

/* A single hand-placed annotation: italic text + pencil arrow. The
 * animations no longer live here — the pegboard canvas (PegboardCanvas)
 * picks up each annotation's head position via its `peg` field and runs
 * narrative dot effects there. */
function Annotation({ top, left, rotate = 0, text, svgW, svgH, viewBox, svgCls = '', d }) {
  return (
    <div
      className="absolute pointer-events-none flex flex-col"
      style={{ top, left, transform: `rotate(${rotate}deg)`, transformOrigin: 'top left' }}
    >
      <span
        className="font-display italic text-fg-display text-23 leading-tight tracking-[-0.015em] max-w-[260px]"
        style={{ textWrap: 'balance' }}
      >
        {text}
      </span>
      <svg width={svgW} height={svgH} viewBox={viewBox} fill="none" className={svgCls}>
        <g stroke="#d79921" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d={d} strokeWidth="1.3" opacity="0.9"  filter="url(#peg-line)"   markerEnd="url(#peg-arrow)" />
          <path d={d} strokeWidth="0.8" opacity="0.45" stroke="#fabd2f" filter="url(#peg-line-2)" />
        </g>
      </svg>
    </div>
  );
}

/* =========================================================================
 * PEGBOARD CANVAS — replaces the static .grid-bg with a live dot field.
 * Each dot is rendered per frame; per-source effects can claim a dot
 * (skip the base render) and draw their own narrative on top: shooting
 * stars leaving their place, dots marching in formation, dots gathering
 * into the atelier mark, a soft shape drifting behind the field, etc.
 *
 * Performance: only iterates dots in the current viewport's y-range.
 * ========================================================================= */

const GRID    = 24;
const DOT_BG  = 'rgba(80, 73, 69, 1)';   // gb-bg2 — base dot
const AMBER   = '215, 153, 33';
const AMBER_H = '251, 189, 47';
const AQUA    = '104, 157, 106';
const AQUA_H  = '142, 192, 124';

// Smooth ease in/out
function ease(p) { return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; }
// Snap a free coord to nearest grid dot. Dots sit at GRID, 2*GRID, 3*GRID, …
// so the first dot is one full grid step away from the canvas top-left.
function snap(v) { return Math.round(v / GRID) * GRID; }

/* getTextTargets(word, size) — render `word` in italic Newsreader to an
 * offscreen canvas, sample where the alpha is opaque, return [dx, dy]
 * offsets for dots to land at. Cached per (word, size). Works for any
 * word — the board can spell anything you give it. */
const _textCache = new Map();
function getTextTargets(text, fontSize = 70) {
  const key = `${text}|${fontSize}`;
  if (_textCache.has(key)) return _textCache.get(key);
  if (typeof document === 'undefined') { _textCache.set(key, []); return []; }
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  const font = `italic ${fontSize}px Newsreader, "Iowan Old Style", Palatino, Georgia, serif`;
  ctx.font = font;
  const m = ctx.measureText(text);
  c.width = Math.ceil(m.width) + 16;
  c.height = Math.ceil(fontSize * 1.3);
  ctx.font = font;
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 8, c.height / 2);
  const data = ctx.getImageData(0, 0, c.width, c.height).data;
  const targets = [];
  const STEP = 5;
  for (let y = 0; y < c.height; y += STEP) {
    for (let x = 0; x < c.width; x += STEP) {
      const a = data[(y * c.width + x) * 4 + 3];
      if (a > 100) targets.push([x - c.width / 2, y - c.height / 2]);
    }
  }
  _textCache.set(key, targets);
  return targets;
}

/* Pick the N closest grid dots to (sx, sy), within `region` px. */
function nearestDots(sx, sy, n, region) {
  const out = [];
  for (let dy = -region; dy <= region; dy += GRID) {
    for (let dx = -region; dx <= region; dx += GRID) {
      const bx = snap(sx + dx), by = snap(sy + dy);
      const dist = Math.hypot(bx - sx, by - sy);
      if (dist > region) continue;
      out.push({ bx, by, dist });
    }
  }
  out.sort((a, b) => a.dist - b.dist);
  return out.slice(0, n);
}

/* frenzyDots — like nearestDots but the boundary is fuzzy. Each dot's
 * priority is `distance + deterministic_noise * region * frenzy`. The
 * noise is a stable hash of (bx, by), so a given dot is always picked
 * for a given source — but among dots roughly the same distance, some
 * close ones get skipped and some farther ones get pulled in. The result
 * is an organic, ragged-edge selection instead of a perfect circle. */
function frenzyDots(sx, sy, n, region, frenzy = 0.45) {
  const out = [];
  for (let dy = -region; dy <= region; dy += GRID) {
    for (let dx = -region; dx <= region; dx += GRID) {
      const bx = snap(sx + dx), by = snap(sy + dy);
      const dist = Math.hypot(bx - sx, by - sy);
      if (dist > region) continue;
      // deterministic per-dot noise (xorshift-y)
      const h = ((bx * 73856093) ^ (by * 19349663)) >>> 0;
      const noise = (h % 10000) / 10000;
      const priority = dist + noise * region * frenzy;
      out.push({ bx, by, dist, priority });
    }
  }
  out.sort((a, b) => a.priority - b.priority);
  return out.slice(0, n);
}

/* Words the wordwheel cycles through. Generic — drop any word in here
 * and getTextTargets will figure out how to form it. */
const WORD_WHEEL = ['breathe', 'patience', 'silence', 'craft', 'quiet', 'design'];

/* drawTextGather — shared logic for all word-forming effects. Selects
 * dots with frenzy borders, animates them gather → hold → disperse over
 * the given cycle, draws each as a small amber square. `seed` (optional)
 * shifts the noise so successive words pick a fresh dot pattern. */
function drawTextGather(t, cycleSec, sx, sy, word, skip, draws, ctx, seed = 0) {
  const targets = getTextTargets(word);
  if (targets.length === 0) return;
  const phase = (t % cycleSec) / cycleSec;
  const region = 240;
  // perturb the source coords by seed so the same dots aren't always picked
  // (each new word in the wheel uses a slightly different set)
  const sources = frenzyDots(sx + seed * 7, sy + seed * 11, targets.length, region);

  let p;
  if (phase < 0.20)      p = phase / 0.20;
  else if (phase < 0.78) p = 1;
  else                   p = 1 - (phase - 0.78) / 0.22;
  const e = ease(Math.max(0, Math.min(1, p)));

  for (let i = 0; i < sources.length; i++) {
    const s = sources[i];
    const tgt = targets[i];
    if (!tgt) break;
    const tx = sx + tgt[0];
    const ty = sy + tgt[1];
    const x = s.bx + (tx - s.bx) * e;
    const y = s.by + (ty - s.by) * e;
    skip.add(s.bx + '_' + s.by);
    const size = 1.4 + e * 0.8;
    const alpha = 0.4 + e * 0.55;
    const xx = x, yy = y, ss = size, aa = alpha;
    draws.push({ z: 1, fn: () => {
      ctx.fillStyle = `rgba(${AMBER}, ${aa})`;
      ctx.fillRect(xx - ss/2, yy - ss/2, ss, ss);
    }});
  }
}

/* Each effect mutates `skip` (Set of "x_y" base dots to suppress) and pushes
 * draw calls into `draws` (sorted by z; negative z = behind dots). */
function applyEffect(src, t, skip, draws, ctx) {
  const sx = snap(src.x), sy = snap(src.y);

  switch (src.kind) {

    /* ---- WORDMARK ---- dots gather into "atelier" (italic Newsreader,
     * sampled from a real font render). frenzyDots gives the gather a
     * fuzzy edge — close dots almost always pulled in, occasional dots
     * from a wider radius too, no perfect circle boundary. */
    case 'wordmark': {
      drawTextGather(t, 10, sx, sy, 'atelier', skip, draws, ctx);
      break;
    }

    /* ---- WORDWHEEL ---- same idea, cycling through a list. Each word
     * gets its own gather/hold/disperse cycle. The algorithm doesn't care
     * which word — anything you put in WORD_WHEEL will be formed from the
     * surrounding dots. */
    case 'wordwheel': {
      const PER = 7;
      const idx = Math.floor(t / PER) % WORD_WHEEL.length;
      const word = WORD_WHEEL[idx];
      drawTextGather(t, PER, sx, sy, word, skip, draws, ctx, idx);
      break;
    }

    /* ---- WAVE ---- a real 3D wave: a spherical wavefront expands from
     * the source like a stone dropped in a pond. Dots at the wave radius
     * are pushed outward (crest) or pulled inward (trough), and their
     * brightness shifts to imply the 3D height of the surface. Amplitude
     * decays with radius (1/√r — energy spreading over an expanding ring).
     * Dots owned by other effects are skipped. */
    case 'wave': {
      const SPEED    = 95;    // px/sec radial expansion
      const PACKET   = 140;   // wavefront thickness
      const WAVELEN  = 42;    // internal oscillation
      const AMP      = 10;    // max radial displacement at r ≈ 100
      const MAX_R    = 720;   // max radius before recycling
      const FADE_OUT = 120;   // soft outer fade so the wave dies, not stops
      const RAMP_IN  = 80;    // soft start ramp from singularity

      const total   = MAX_R + PACKET;
      const cyc     = (t * SPEED) % total;
      const waveR   = cyc - PACKET / 2;     // wavefront radial position
      const fadeIn  = Math.min(1, waveR / RAMP_IN);
      const fadeOut = Math.min(1, (MAX_R - waveR) / FADE_OUT);
      const env0    = Math.max(0, Math.min(fadeIn, fadeOut));
      if (env0 < 0.05) break;

      const range = waveR + PACKET + GRID;
      const yMin = snap(sy - range), yMax = snap(sy + range);
      const xMin = snap(sx - range), xMax = snap(sx + range);

      for (let by = yMin; by <= yMax; by += GRID) {
        for (let bx = xMin; bx <= xMax; bx += GRID) {
          const key = bx + '_' + by;
          if (skip.has(key)) continue;
          const rx = bx - sx, ry = by - sy;
          const r  = Math.sqrt(rx * rx + ry * ry);
          if (r < 6) continue;
          const dr = r - waveR;
          if (Math.abs(dr) > PACKET) continue;

          // wavefront packet shape (cosine envelope) × oscillation
          const pkt   = Math.cos((dr / PACKET) * Math.PI * 0.5);
          const polar = Math.sin((dr / WAVELEN) * Math.PI * 2);
          // 1/√r energy decay (cylindrical wave) — stronger near source,
          // softer at the rim
          const decay = Math.min(1, 100 / Math.max(40, r));
          const a     = AMP * env0 * pkt * decay;

          // radial displacement (along radius)
          const disp = a * polar;
          const nx = rx / r, ny = ry / r;
          const xx = bx + nx * disp;
          const yy = by + ny * disp;

          // brightness — crests glow toward amber, troughs dim toward black.
          // This is the 3D height cue. Crest = +1, trough = -1.
          const heightCue = polar * pkt * env0 * decay;
          let r0, g0, b0;
          if (heightCue > 0) {
            // crest — interpolate from base toward amber
            const m = Math.min(1, heightCue * 1.4);
            r0 = Math.round(80  + (215 - 80)  * m);
            g0 = Math.round(73  + (153 - 73)  * m);
            b0 = Math.round(69  + (33  - 69)  * m);
          } else {
            // trough — dim toward black
            const m = Math.max(0.35, 1 + heightCue * 0.65);
            r0 = Math.round(80 * m);
            g0 = Math.round(73 * m);
            b0 = Math.round(69 * m);
          }

          if (Math.abs(disp) < 0.15 && Math.abs(heightCue) < 0.04) continue;
          skip.add(key);
          const cx = xx, cy = yy, cr = r0, cg = g0, cb = b0;
          draws.push({ z: 1, fn: () => {
            ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, 1)`;
            ctx.fillRect(cx - 1, cy - 1, 2, 2);
          }});
        }
      }

      // tiny pulse at the source when a new wave starts
      if (waveR < RAMP_IN) {
        const p = 1 - waveR / RAMP_IN;
        draws.push({ z: 3, fn: () => {
          ctx.fillStyle = `rgba(${AMBER_H}, ${p * 0.7})`;
          ctx.beginPath(); ctx.arc(sx, sy, 2 + p * 4, 0, Math.PI * 2); ctx.fill();
        }});
      }
      break;
    }

    /* ---- MERGE ---- two dots attract to the midpoint, fuse into one
     * bright wobbling pulse, then split apart and return to their slots. */
    case 'merge': {
      const CYCLE = 6;
      const phase = (t % CYCLE) / CYCLE;
      const a = [sx - 24, sy];
      const b = [sx + 24, sy];
      skip.add(a[0] + '_' + a[1]);
      skip.add(b[0] + '_' + b[1]);

      if (phase < 0.35) {
        const e = ease(phase / 0.35);
        const ax = a[0] + (sx - a[0]) * e;
        const ay = a[1] + (sy - a[1]) * e;
        const bx = b[0] + (sx - b[0]) * e;
        const by = b[1] + (sy - b[1]) * e;
        draws.push({ z: 1, fn: () => {
          ctx.fillStyle = `rgba(${AMBER}, ${0.85 + e * 0.15})`;
          ctx.beginPath(); ctx.arc(ax, ay, 1.6 + e * 0.8, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = `rgba(${AQUA}, ${0.85 + e * 0.15})`;
          ctx.beginPath(); ctx.arc(bx, by, 1.6 + e * 0.8, 0, Math.PI * 2); ctx.fill();
        }});
      } else if (phase < 0.55) {
        // FUSED — small, photorealistic bright dot with a soft, contained halo
        const fp = (phase - 0.35) / 0.20;
        const pulse = 1 + Math.sin(fp * Math.PI) * 0.25;
        draws.push({ z: 2, fn: () => {
          // soft contained halo (only ~6px)
          const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, 6);
          grad.addColorStop(0,   `rgba(${AMBER_H}, 0.35)`);
          grad.addColorStop(1,   `rgba(${AMBER}, 0)`);
          ctx.fillStyle = grad;
          ctx.fillRect(sx - 7, sy - 7, 14, 14);
          // crisp small core
          ctx.fillStyle = `rgba(${AMBER_H}, 1)`;
          ctx.beginPath();
          ctx.arc(sx, sy, 2.2 * pulse, 0, Math.PI * 2);
          ctx.fill();
        }});
      } else {
        // SPLIT — fly back and settle
        const e = ease((phase - 0.55) / 0.45);
        const ax = sx + (a[0] - sx) * e;
        const ay = sy;
        const bx = sx + (b[0] - sx) * e;
        const by = sy;
        draws.push({ z: 1, fn: () => {
          ctx.fillStyle = `rgba(${AMBER}, ${0.85 + (1 - e) * 0.15})`;
          ctx.beginPath(); ctx.arc(ax, ay, 1.6 + (1 - e) * 0.8, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = `rgba(${AQUA}, ${0.85 + (1 - e) * 0.15})`;
          ctx.beginPath(); ctx.arc(bx, by, 1.6 + (1 - e) * 0.8, 0, Math.PI * 2); ctx.fill();
        }});
      }
      break;
    }

    /* ---- SPHERE ---- ~64 nearby dots gather into a 3D Fibonacci sphere
     * around the source, rotate around the Y-axis with perspective so
     * front dots are bigger, hold for a beat, then dissolve back to grid. */
    case 'sphere': {
      const CYCLE = 12;
      const phase = (t % CYCLE) / CYCLE;
      const N = 72;
      const RADIUS = 56;

      // Fibonacci sphere points (cached on global)
      if (!applyEffect._sphere) {
        const pts = [];
        const phi = Math.PI * (3 - Math.sqrt(5));
        for (let i = 0; i < N; i++) {
          const y = 1 - (i / (N - 1)) * 2;
          const r = Math.sqrt(1 - y * y);
          const th = phi * i;
          pts.push([Math.cos(th) * r, y, Math.sin(th) * r]);
        }
        applyEffect._sphere = pts;
      }
      const points = applyEffect._sphere;
      const sources = nearestDots(sx, sy, N, RADIUS * 2.6);

      let formP;
      if (phase < 0.18)      formP = phase / 0.18;
      else if (phase < 0.85) formP = 1;
      else                   formP = 1 - (phase - 0.85) / 0.15;
      const formE = ease(Math.max(0, Math.min(1, formP)));

      const rotY = phase * Math.PI * 4;
      const rotX = Math.sin(phase * Math.PI * 2) * 0.4;
      const cy0 = Math.cos(rotY), sy0 = Math.sin(rotY);
      const cx0 = Math.cos(rotX), sx0 = Math.sin(rotX);

      for (let i = 0; i < sources.length; i++) {
        const s = sources[i];
        const p = points[i];
        skip.add(s.bx + '_' + s.by);

        // rotate Y, then X
        let x1 =  p[0] * cy0 + p[2] * sy0;
        let z1 = -p[0] * sy0 + p[2] * cy0;
        let y2 = p[1] * cx0 - z1 * sx0;
        let z2 = p[1] * sx0 + z1 * cx0;

        const focal = 220;
        const k = focal / (focal + z2 * RADIUS);
        const tx = sx + x1 * RADIUS * k;
        const ty = sy + y2 * RADIUS * k;

        const x = s.bx + (tx - s.bx) * formE;
        const y = s.by + (ty - s.by) * formE;

        const depth = (z2 + 1) / 2; // 0 back → 1 front
        const sizeP = (0.6 + depth * 1.2) * formE + (1 - formE);
        const alpha = (0.25 + depth * 0.7) * formE + 0.55 * (1 - formE);

        const xx = x, yy = y, ss = sizeP, aa = alpha, dd = depth;
        draws.push({ z: 1 + dd, fn: () => {
          ctx.fillStyle = `rgba(${AMBER}, ${aa})`;
          ctx.beginPath(); ctx.arc(xx, yy, ss, 0, Math.PI * 2); ctx.fill();
        }});
      }
      break;
    }

    /* ---- SHOCKWAVE ---- a real expanding wave. Dots within the wave's
     * current radius get pushed outward (peak push at the crest), brighten
     * as they move, settle back as the wave passes. Intensity follows a
     * sine bell across the cycle so it fades IN at the start and fades OUT
     * at the end — no abrupt resets, the page returns to "normal dots". */
    case 'shockwave': {
      const CYCLE = 6.5;
      const phase = (t % CYCLE) / CYCLE;
      const MAX = 230;
      const waveR = phase * MAX;
      const waveW = 38;
      const intensity = Math.sin(phase * Math.PI); // 0→1→0 over the cycle

      if (intensity < 0.02) break; // page sits at rest near the seam

      const dots = nearestDots(sx, sy, 999, MAX + waveW);
      for (const d of dots) {
        const dist = d.dist;
        if (dist < 1) continue;
        const dfw = dist - waveR;
        if (Math.abs(dfw) > waveW) continue;
        skip.add(d.bx + '_' + d.by);
        const pf = Math.cos((dfw / waveW) * Math.PI * 0.5); // 1 at crest
        const push = pf * 14 * intensity;
        const nx = (d.bx - sx) / dist, ny = (d.by - sy) / dist;
        const x = d.bx + nx * push;
        const y = d.by + ny * push;
        const xx = x, yy = y, pp = pf, ff = intensity;
        draws.push({ z: 1, fn: () => {
          ctx.fillStyle = `rgba(${AMBER_H}, ${(0.4 + pp * 0.6) * ff})`;
          ctx.beginPath(); ctx.arc(xx, yy, 1.3 + pp * 1.6 * ff, 0, Math.PI * 2); ctx.fill();
        }});
      }
      // central pulse — bell over the first 25% of cycle
      if (phase < 0.25) {
        const p = phase / 0.25;
        const bell = Math.sin(p * Math.PI); // 0→1→0
        draws.push({ z: 3, fn: () => {
          ctx.fillStyle = `rgba(${AMBER_H}, ${bell * 0.85})`;
          ctx.beginPath(); ctx.arc(sx, sy, 3 + bell * 8, 0, Math.PI * 2); ctx.fill();
        }});
      }
      break;
    }

    /* ---- SHOOTING STARS ---- a few dots from anywhere on the board
     * detach from their slots and streak across the field as shooting
     * stars. Their original slots stay vacant for a beat, then a fresh
     * dot fades in (respawn). Continuous, gentle, only ever 4–5 active. */
    case 'shooting': {
      const SPREAD = 360;
      if (!applyEffect._stars) applyEffect._stars = new Map();
      const key = sx + '_' + sy;
      let slots = applyEffect._stars.get(key);
      if (!slots) {
        slots = [];
        for (let i = 0; i < 5; i++) {
          slots.push({ state: 'wait', wakeAt: t + Math.random() * 6 });
        }
        applyEffect._stars.set(key, slots);
      }

      for (const s of slots) {
        // STATE: wait — sit idle until wakeAt
        if (s.state === 'wait') {
          if (t < s.wakeAt) continue;
          // pick a slot from anywhere within SPREAD of source
          const ang = Math.random() * Math.PI * 2;
          const dist = 60 + Math.random() * SPREAD;
          s.bx = snap(sx + Math.cos(ang) * dist);
          s.by = snap(sy + Math.sin(ang) * dist);
          // pick a streak direction (random, but generally outward)
          const flyAng = Math.random() * Math.PI * 2;
          const flyDist = 80 + Math.random() * 120;
          s.tx = s.bx + Math.cos(flyAng) * flyDist;
          s.ty = s.by + Math.sin(flyAng) * flyDist;
          s.state = 'shoot';
          s.t0 = t;
          s.dur = 1.4 + Math.random() * 1.0;
          // fall through into 'shoot'
        }

        // STATE: shoot — streak from base toward target, fade out
        if (s.state === 'shoot') {
          const lp = (t - s.t0) / s.dur;
          if (lp >= 1) {
            s.state = 'gone';
            s.t0 = t;
            s.dur = 0.8 + Math.random() * 1.2;
            continue;
          }
          skip.add(s.bx + '_' + s.by); // origin is vacant from the moment it shoots
          const e = lp * lp;            // accelerate
          const x = s.bx + (s.tx - s.bx) * e;
          const y = s.by + (s.ty - s.by) * e;
          const alpha = 1 - lp * lp;
          const xx = x, yy = y, ox = s.bx, oy = s.by, aa = alpha;
          draws.push({ z: 2, fn: () => {
            // tail
            const grad = ctx.createLinearGradient(ox, oy, xx, yy);
            grad.addColorStop(0, `rgba(${AMBER}, 0)`);
            grad.addColorStop(1, `rgba(${AMBER_H}, ${aa})`);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.4;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(ox, oy);
            ctx.lineTo(xx, yy);
            ctx.stroke();
            // head
            ctx.fillStyle = `rgba(${AMBER_H}, ${aa})`;
            ctx.beginPath();
            ctx.arc(xx, yy, 2 + aa * 1.2, 0, Math.PI * 2);
            ctx.fill();
          }});
          continue;
        }

        // STATE: gone — empty slot for a beat
        if (s.state === 'gone') {
          skip.add(s.bx + '_' + s.by);
          if (t - s.t0 >= s.dur) {
            s.state = 'respawn';
            s.t0 = t;
            s.dur = 0.9;
          }
          continue;
        }

        // STATE: respawn — fade a fresh dot back into the empty slot
        if (s.state === 'respawn') {
          const lp = (t - s.t0) / s.dur;
          if (lp >= 1) {
            s.state = 'wait';
            s.wakeAt = t + 2 + Math.random() * 5;
            continue;
          }
          skip.add(s.bx + '_' + s.by);
          const a = lp;
          const ox = s.bx, oy = s.by, aa = a;
          draws.push({ z: 1, fn: () => {
            ctx.fillStyle = `rgba(${parseInt(AMBER.split(',')[0])}, ${parseInt(AMBER.split(',')[1])}, ${parseInt(AMBER.split(',')[2])}, ${aa * 0.7 + 0.3 * 0.3})`;
            // simpler: use base dot color faded
            ctx.fillStyle = `rgba(80, 73, 69, ${aa})`;
            ctx.fillRect(ox - 1, oy - 1, 2, 2);
          }});
          continue;
        }
      }
      break;
    }
  }
}

function PegboardCanvas({ sources, height }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    const start = performance.now();

    const tick = (now) => {
      const dpr = window.devicePixelRatio || 1;
      const cw = canvas.offsetWidth, ch = canvas.offsetHeight;
      if (canvas.width !== Math.floor(cw * dpr) || canvas.height !== Math.floor(ch * dpr)) {
        canvas.width = Math.floor(cw * dpr);
        canvas.height = Math.floor(ch * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);

      const t = (now - start) / 1000;

      // Cull to visible viewport using canvas position
      const rect = canvas.getBoundingClientRect();
      const minY = Math.max(0, -rect.top - 100);
      const maxY = Math.min(ch, -rect.top + window.innerHeight + 100);

      // 1. Each effect contributes skips + draws. Wave runs LAST so it
      // can detect dots already owned by other effects and pass around them.
      const skip = new Set();
      const draws = [];
      for (const src of sources) if (src.kind !== 'wave') applyEffect(src, t, skip, draws, ctx);
      for (const src of sources) if (src.kind === 'wave') applyEffect(src, t, skip, draws, ctx);

      // 2. Behind-dots layer
      for (const d of draws) if (d.z < 0) d.fn();

      // 3. Base grid dots (skipping any claimed by effects). The first dot
      // sits one GRID step in from each canvas edge so the field has a
      // clean margin against surrounding chrome.
      ctx.fillStyle = DOT_BG;
      for (let by = GRID; by <= ch - GRID; by += GRID) {
        if (by < minY || by > maxY) continue;
        for (let bx = GRID; bx <= cw - GRID; bx += GRID) {
          if (skip.has(bx + '_' + by)) continue;
          ctx.fillRect(bx - 1, by - 1, 2, 2);
        }
      }

      // 4. In-front layer (dots/strokes from effects)
      for (const d of draws) if (d.z >= 0) d.fn();

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [sources]);

  return <canvas ref={ref} className="absolute inset-0 w-full pointer-events-none" style={{ height }} />;
}

/* Compute the arrow head's pegboard-coord position from each annotation,
 * so the canvas knows where to drop its narrative dot effects. Approximate
 * (ignores the tiny ±2° rotations) — close enough that the effect lands
 * on the same dot the arrow points at. */
function annPegHead(a) {
  const [vbx, vby] = a.viewBox.split(' ').map(Number);
  const svgL = a.svgCls.includes('-ml-2') ? -8 : 0;
  const TEXT_H = 56; // 2 lines of italic text-23 leading-tight + small buffer
  const svgT = TEXT_H - 8; // -mt-2 negative margin
  return {
    x: a.left + svgL + (a.head[0] - vbx),
    y: a.top + svgT + (a.head[1] - vby),
    kind: a.peg, // narrative effect to play here
  };
}

const ANNOTATIONS = [
  // 1. "every module starts as a single dot" → WORDMARK (atelier emerges)
  {
    top: 292, left: 380, rotate: -1.5, /* gap ↓ ~800 */
    text: 'every module starts as a single dot',
    svgW: 340, svgH: 220, viewBox: '0 -30 340 220', svgCls: '-mt-2 -ml-2',
    d: 'M 170 -10 C 201 54, 258 73, 312 70',
    head: [312, 70], peg: 'wordmark',
  },
  // 1b. just below — WORDWHEEL cycles through different words
  {
    top: 1100, left: 240, rotate: 1.2,
    text: 'or any word, really. the board can hold it.',
    svgW: 380, svgH: 200, viewBox: '0 -30 380 200', svgCls: '-mt-2 -ml-2',
    d: 'M 230 -10 C 290 30, 350 80, 340 150',
    head: [340, 150], peg: 'wordwheel',
  },
  // 2. "the silence between dots is the design" → BEHIND (something drifts behind)
  {
    top: 1900, left: 760, rotate: 2,
    text: 'the silence between the dots is the design',
    svgW: 280, svgH: 280, viewBox: '-160 0 280 280', svgCls: '-mt-2',
    d: 'M 0 0 C -40 70, -180 80, -130 220',
    head: [-130, 220], peg: 'wave',
  },
  // 3. "two dots — already a relationship" → SWAP (pairs trade places)
  {
    top: 2700, left: 220, rotate: -1,
    text: 'two dots — already a relationship',
    svgW: 420, svgH: 200, viewBox: '0 -20 420 200', svgCls: '-mt-2 -ml-2',
    d: 'M 60 -10 C 160 30, 280 80, 330 130',
    head: [330, 130], peg: 'merge',
  },
  // 4. "this column lands here, 24px on center" → BRUSH (paints a stroke)
  {
    top: 3500, left: 680, rotate: 1,
    text: 'this column lands here, 24px on center',
    svgW: 220, svgH: 240, viewBox: '0 -20 220 240', svgCls: '-mt-2 -ml-2',
    d: 'M 80 -10 C 160 40, 60 110, 110 190',
    head: [110, 190], peg: 'sphere',
  },
  // 5. "sometimes nothing fills the page best" → STAR (a dot leaves)
  {
    top: 4300, left: 320, rotate: -2,
    text: 'sometimes nothing fills the page best',
    svgW: 460, svgH: 180, viewBox: '0 -20 460 180', svgCls: '-mt-2 -ml-2',
    d: 'M 90 -10 C 220 -10, 360 40, 380 100',
    head: [380, 100], peg: 'shockwave',
  },
  // 6. "leave room. the page rewards patience." → MARCH (group walks together)
  {
    top: 5100, left: 580, rotate: 1.5,
    text: 'leave room. the page rewards patience.',
    svgW: 320, svgH: 280, viewBox: '-60 0 320 280', svgCls: '-mt-2',
    d: 'M 0 0 C 40 70, 200 80, 220 180',
    head: [220, 180], peg: 'shooting',
  },
];

function PegboardPage() {
  /* Draw mode is opt-in. When active, click + drag sketches a pencil arrow
   * on the pegboard. Toolbar buttons stop pointer-down propagation so the
   * parent's setPointerCapture doesn't swallow their click events. */
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  const [arrows, setArrows] = useState([]);
  const [drawing, setDrawing] = useState(null);

  const localXY = (e) => {
    const r = ref.current.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };

  const onDown = (e) => {
    if (!active) return;
    if (e.button !== undefined && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrawing({ points: [localXY(e)] });
  };

  const onMove = (e) => {
    if (!active || !drawing) return;
    const p = localXY(e);
    setDrawing((d) => {
      if (!d) return d;
      const last = d.points[d.points.length - 1];
      // ignore tiny moves so the path stays compact
      if (Math.hypot(p[0] - last[0], p[1] - last[1]) < 4) return d;
      return { points: [...d.points, p] };
    });
  };

  const onUp = () => {
    if (drawing && drawing.points.length >= 2) {
      setArrows((a) => [...a, drawing.points]);
    }
    setDrawing(null);
  };

  const undo  = () => setArrows((a) => a.slice(0, -1));
  const clear = () => setArrows([]);
  const close = () => { setArrows([]); setDrawing(null); setActive(false); };

  // shared button style; stopDown prevents the parent's setPointerCapture
  // from swallowing the click when you press a toolbar button.
  const btnCls = 'cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 inline-flex items-center gap-1.5 px-2 py-1 rounded-sm border border-default bg-card text-fg-secondary hover:text-accent-primary-hi hover:border-accent-primary hover:bg-card-hi transition-colors duration-fast font-mono text-11';
  const stopDown = (e) => e.stopPropagation();

  return (
    <div
      ref={ref}
      className={['-mx-8 -mb-4 relative', active && 'cursor-crosshair select-none'].filter(Boolean).join(' ')}
      style={{ marginTop: -160, height: 5800, touchAction: active ? 'none' : 'auto' }}
      data-kit-page
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      {/* live dot field — fills the entire module surface, including
       * behind the page header. PageTabs has z-10 so its text floats over
       * the canvas. Background stays transparent (the body's bg-canvas
       * shows through where the canvas paints nothing). */}
      <PegboardCanvas sources={ANNOTATIONS.map(annPegHead)} height={5800} />
      {/* toolbar — typographic, no boxes. mono dots separate verbs. */}
      <div className="absolute right-4 flex items-baseline gap-3 z-20" style={{ top: 148 }}>
        {!active ? (
          <button
            onClick={() => setActive(true)}
            onPointerDown={stopDown}
            className="cursor-pointer font-display italic text-19 leading-none tracking-[-0.015em] text-fg-muted hover:text-fg-display transition-colors duration-base ease-enter px-1"
            title="click + drag on the pegboard to sketch a pencil arrow"
          >
            draw an arrow
          </button>
        ) : (
          <>
            <span className="inline-flex items-baseline gap-1.5 pointer-events-none">
              <span className="font-mono text-11 text-accent-primary-hi tracking-caps lowercase">drawing</span>
              <span className="font-display italic text-16 text-fg-display leading-none tracking-[-0.015em]">an arrow</span>
            </span>
            <span className="font-mono text-11 text-fg-subtle pointer-events-none">·</span>
            <button
              onClick={undo}
              onPointerDown={stopDown}
              disabled={arrows.length === 0}
              className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 font-display italic text-16 leading-none tracking-[-0.015em] text-fg-muted hover:text-fg-display transition-colors duration-fast"
              title="undo last arrow"
            >
              undo
            </button>
            <span className="font-mono text-11 text-fg-subtle pointer-events-none">·</span>
            <button
              onClick={clear}
              onPointerDown={stopDown}
              disabled={arrows.length === 0}
              className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 font-display italic text-16 leading-none tracking-[-0.015em] text-fg-muted hover:text-fg-display transition-colors duration-fast"
              title="remove all arrows"
            >
              clear{arrows.length > 0 && <span className="font-mono text-11 text-fg-subtle ml-1 not-italic">({arrows.length})</span>}
            </button>
            <span className="font-mono text-11 text-fg-subtle pointer-events-none">·</span>
            <button
              onClick={close}
              onPointerDown={stopDown}
              className="cursor-pointer font-display italic text-16 leading-none tracking-[-0.015em] text-fg-muted hover:text-fg-display transition-colors duration-fast"
              title="close (also clears)"
            >
              close
            </button>
          </>
        )}
      </div>

      {/* hand-placed annotations — each a margin note on the sheet, distributed
       * vertically with plenty of breathing room. arrows point in different
       * directions so the page reads as a sketchpad, not a layout. */}
      {ANNOTATIONS.map((a, i) => <Annotation key={i} {...a} />)}

      {/* user-drawn arrows + shared defs (filter + marker) */}
      <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
        <defs>
          <filter id="peg-line" x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" />
          </filter>
          <filter id="peg-line-2" x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="13" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="1.8" />
          </filter>
          <marker
            id="peg-arrow"
            viewBox="0 0 12 12"
            refX="11"
            refY="6"
            markerWidth="13"
            markerHeight="13"
            markerUnits="userSpaceOnUse"
            orient="auto"
          >
            <path
              d="M 1 1 L 11 6 L 1 11"
              stroke="#d79921"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </marker>
        </defs>
        {arrows.map((points, i) => <DrawnArrow key={i} points={points} />)}
        {drawing && <DrawnArrow points={drawing.points} inProgress />}
      </svg>
    </div>
  );
}

/* =========================================================================
 * MISSION CONTROL — sandbox for porting the design's agent UI system.
 *
 * Built locally in kit so we can iterate on visuals before swapping the
 * components into mission-control/. Each Row demos one primitive across
 * its full state surface; mock sessions on the right drive everything.
 *
 * Once the visuals are right, copy the MC* components into
 * mission-control/frontend.jsx (same prop shape — they're drop-in).
 * ========================================================================= */

/* ---- one-shot CSS for keyframes used across MC components.
 * Mounted on first MC component render (idempotent). ---- */
function useMcKitStyles() {
  useEffect(() => {
    if (document.getElementById('mc-kit-styles')) return;
    const s = document.createElement('style');
    s.id = 'mc-kit-styles';
    s.textContent = `
      @keyframes mck-eye-pulse  { 0%,100% { opacity: 1 } 50% { opacity: 0.35 } }
      @keyframes mck-need-pulse { 0%,100% { transform: scale(1); opacity: 1 }
                                  50%      { transform: scale(1.25); opacity: 0.7 } }
      @keyframes mck-caret      { 0%,49% { opacity: 1 } 50%,100% { opacity: 0 } }
      @keyframes mck-progress   { 0% { transform: translateX(-100%) }
                                  100% { transform: translateX(280%) } }
      @keyframes mck-input-in   { from { opacity: 0; transform: translateX(-3px) }
                                  to   { opacity: 1; transform: translateX(0) } }
      @keyframes mck-slot-in    { from { opacity: 0 } to { opacity: 1 } }
      .mck-stream-caret {
        display: inline-block; width: 6px; height: 11px;
        background: currentColor; vertical-align: -1px; margin-left: 2px;
        animation: mck-caret 900ms steps(1) infinite;
      }
      .mck-bar-input::placeholder {
        color: var(--color-fg-muted);
        opacity: 1;
      }
    `;
    document.head.appendChild(s);
  }, []);
}

/* ---- avatar palette (16 hues, ported from MissionControl.jsx). ---- */
const MC_HUES = [
  '#fabd2f', '#fe8019', '#fb4934', '#d3869b',
  '#b16286', '#83a598', '#458588', '#8ec07c',
  '#689d6a', '#b8bb26', '#98971a', '#d79921',
  '#d65d0e', '#cc241d', '#a89984', '#bdae93',
];

function mcHash32(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function mcAvatarFor(sessionId) {
  let seed = mcHash32(sessionId);
  for (let attempts = 0; attempts < 8; attempts++) {
    const hue = MC_HUES[seed % MC_HUES.length];
    const grid = new Array(64).fill(false);
    let count = 0;
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 4; x++) {
        const bit = (mcHash32(sessionId + ':' + seed + ':' + y + ',' + x) & 1) === 1;
        grid[y * 8 + x] = bit;
        grid[y * 8 + (7 - x)] = bit;
        if (bit) count += 2;
      }
    }
    const hasHead = grid.slice(0, 16).some(Boolean);
    const hasEye = grid.slice(16, 32).some(Boolean);
    if (count >= 14 && count <= 44 && hasHead && hasEye) return { hue, grid };
    seed = mcHash32('perturb:' + seed + ':' + attempts);
  }
  const hue = MC_HUES[mcHash32(sessionId) % MC_HUES.length];
  const grid = new Array(64).fill(false);
  [10, 11, 12, 13, 18, 21, 26, 29, 34, 35, 36, 37, 42, 45].forEach((i) => (grid[i] = true));
  return { hue, grid };
}

/* ---- AgentAvatar — pixel face with state overlays. Verbatim from
 * MissionControl.jsx, just re-rooted on `mck-` keyframe names. ---- */
function MCAgentAvatar({ session, size = 14, state = 'idle', title }) {
  useMcKitStyles();
  const { hue, grid } = React.useMemo(() => mcAvatarFor(session), [session]);
  const eyeIndices = React.useMemo(() => {
    const out = [];
    for (let y = 2; y <= 3; y++) {
      for (let x = 1; x <= 2; x++) {
        const li = y * 8 + x;
        const ri = y * 8 + (7 - x);
        if (grid[li]) out.push(li);
        if (grid[ri]) out.push(ri);
      }
    }
    return out;
  }, [grid]);
  // The icon keeps its identity hue across every state — failure is signalled
  // by the red `!` badge in the corner, not by repainting the face.
  const renderHue = hue;
  const overlayPulse = state === 'working' || state === 'needs-input';
  const animDur = state === 'needs-input' ? '900ms' : '1400ms';
  return (
    <span
      title={title || session}
      style={{
        display: 'inline-block', width: size, height: size,
        position: 'relative', flex: '0 0 auto',
      }}
    >
      <svg width={size} height={size} viewBox="0 0 8 8" style={{ display: 'block', imageRendering: 'pixelated' }}>
        {grid.map((on, i) => {
          if (!on) return null;
          const x = i % 8, y = Math.floor(i / 8);
          const isEye = eyeIndices.includes(i);
          return (
            <rect key={i}
              x={x} y={y} width={1} height={1}
              fill={renderHue}
              style={isEye && overlayPulse ? { animation: `mck-eye-pulse ${animDur} ease-in-out infinite` } : undefined}
            />
          );
        })}
      </svg>
      {state === 'needs-input' && (
        <span style={{
          position: 'absolute', right: -3, top: -3,
          width: 6, height: 6, borderRadius: '50%',
          background: '#fabd2f',
          boxShadow: '0 0 0 1.5px var(--color-bg-canvas, #1d2021)',
          animation: 'mck-need-pulse 900ms ease-in-out infinite',
        }} />
      )}
      {state === 'done' && (
        <span style={{
          position: 'absolute', right: -3, bottom: -3,
          width: 8, height: 8, borderRadius: '50%',
          background: '#98971a',
          boxShadow: '0 0 0 1.5px var(--color-bg-canvas, #1d2021)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 6, color: '#1d2021', fontWeight: 700, lineHeight: 1,
        }}>✓</span>
      )}
      {state === 'failed' && (
        <span style={{
          position: 'absolute', right: -3, bottom: -3,
          width: 8, height: 8, borderRadius: '50%',
          background: '#cc241d',
          boxShadow: '0 0 0 1.5px var(--color-bg-canvas, #1d2021)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 6, color: '#fbf1c7', fontWeight: 700, lineHeight: 1,
        }}>!</span>
      )}
    </span>
  );
}

function MCSparkleGlyph({ size = 12, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M6 1 L7 5 L11 6 L7 7 L6 11 L5 7 L1 6 L5 5 Z" fill={color} />
    </svg>
  );
}

function MCKbd({ children }) {
  return (
    <span style={{
      padding: '1px 5px', borderRadius: 3,
      border: '1px solid rgba(255,255,255,0.08)',
      background: 'rgba(255,255,255,0.03)',
      fontFamily: 'var(--font-mono)', fontSize: 9.5,
      color: 'var(--color-fg-muted)', textTransform: 'lowercase',
      lineHeight: 1.4,
    }}>{children}</span>
  );
}

/* ---- AGENT_SESSIONS — the design's pool of fake sessions, used for any
 * non-interactive demo on this page. Stable identities so layouts stay put.
 * Each session has a `startedAt` (ms epoch) and, if finished, an `endedAt`.
 * Display strings are derived live via `elapsedFor()` — working sessions
 * keep counting; done/failed ones are frozen at their endedAt. */
const _mcAnchor = Date.now();
const MC_SESSIONS = [
  { id: 'a3k', blueprint: 'debug-runner',     module: 'flows',         status: 'reading run logs',              startedAt: _mcAnchor - 14_000,  state: 'working' },
  { id: 'k7x', blueprint: 'flow-builder',     module: 'flows',         status: 'transcribing youtube',          startedAt: _mcAnchor - 138_000, state: 'working' },
  { id: 'b2p', blueprint: 'inbox-summarizer', module: 'activity',      status: '23 unread → 4 themes',          startedAt: _mcAnchor - 8_000,   state: 'working' },
  { id: 'm9v', blueprint: 'sprint-planner',   module: 'sprint 14',     status: 'drafting plan from notes',      startedAt: _mcAnchor - 42_000,  state: 'needs-input' },
  { id: 'q4f', blueprint: 'refine',           module: 'flows',         status: 'changes ready — review',        startedAt: _mcAnchor - 64_000,  endedAt: _mcAnchor, state: 'done', result: '3 changes ready' },
  { id: 'r8j', blueprint: 'tax-helper',       module: 'daybook',       status: 'matching receipts to invoices', startedAt: _mcAnchor - 312_000, state: 'working' },
  { id: 'w1n', blueprint: 'debug-runner',     module: 'flows',         status: 'fixed null guard · ran ok',     startedAt: _mcAnchor - 47_000,  endedAt: _mcAnchor, state: 'done', result: 'patch applied' },
  { id: 'z6t', blueprint: 'shell-runner',     module: 'shell',         status: 'pulling main · 17 commits',     startedAt: _mcAnchor - 11_000,  state: 'working' },
  { id: 'g0e', blueprint: 'snippet-extract',  module: 'snippets',      status: 'parsing slack thread',          startedAt: _mcAnchor - 3_000,   state: 'working' },
  { id: 'h2u', blueprint: 'flow-builder',     module: 'flows',         status: 'failed — could not parse n8n',  startedAt: _mcAnchor - 83_000,  endedAt: _mcAnchor, state: 'failed' },
  { id: 'p5c', blueprint: 'compose-recap',    module: 'activity',      status: 'done — drafted weekly recap',   startedAt: _mcAnchor - 38_000,  endedAt: _mcAnchor, state: 'done', result: 'draft ready' },
  { id: 's3y', blueprint: 'api-watcher',      module: 'api·realtime',  status: 'monitoring 4 endpoints',        startedAt: _mcAnchor - 840_000, state: 'working' },
  { id: 't7l', blueprint: 'refine',           module: 'flows',         status: 'editing _workflows/hn-news.js', startedAt: _mcAnchor - 22_000,  state: 'working' },
  { id: 'u4d', blueprint: 'doc-writer',       module: 'snippets',      status: 'done — 3 docs written',         startedAt: _mcAnchor - 131_000, endedAt: _mcAnchor, state: 'done', result: '3 docs' },
  { id: 'v8b', blueprint: 'image-mod',        module: 'flows',         status: 'upscaling iris portrait',       startedAt: _mcAnchor - 28_000,  state: 'working' },
  { id: 'x1s', blueprint: 'inbox-summarizer', module: 'activity',      status: 'done',                          startedAt: _mcAnchor - 12_000,  endedAt: _mcAnchor, state: 'done' },
];
const mcFind = (id) => MC_SESSIONS.find((s) => s.id === id);

/* =========================================================================
 * MissionControl — single consolidated component.
 *
 * One thing, one job: render the split bar plus whatever panel is currently
 * attached below it (composer / inventory / focused-agent). Every kit demo
 * row is just `<MissionControl {...props} />` with different data — no
 * isolated avatar/pill/panel showcases, because the building blocks are
 * always seen in the context where they actually live.
 *
 * Click rules:
 *   • input zone with no primary  → inline composer (textarea in the bar)
 *   • input zone with a primary   → focused-agent panel below the bar
 *   • chevron                     → inventory dropdown below the bar
 *   • Esc                         → close whichever panel is open
 *
 * Self-contained. Depends only on window.React and the helpers above this
 * comment (useMcKitStyles, MC_HUES, mcHash32, mcAvatarFor, MCAgentAvatar,
 * MCSparkleGlyph, MCKbd). To copy into another module, copy this whole
 * section AND those helpers above it.
 * ========================================================================= */

// ---- internals: live elapsed display ---------------------------------------
//
// Sessions carry `startedAt` (ms epoch) and optionally `endedAt` for finished
// runs. `elapsedFor()` formats the difference; `useNowTick()` re-renders the
// caller once a second so working sessions visibly count up.
function formatElapsed(ms) {
  if (ms < 0) ms = 0;
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) {
    const m = Math.floor(s / 60);
    return `${m}m ${String(s % 60).padStart(2, '0')}s`;
  }
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}h ${String(m).padStart(2, '0')}m`;
}
function elapsedFor(session) {
  if (!session) return '';
  if (session.startedAt) {
    const end = session.endedAt || Date.now();
    return formatElapsed(end - session.startedAt);
  }
  return session.elapsed || '';
}
function useNowTick() {
  const [, setTick] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);
}

// ---- internals: secondary pill ----------------------------------------------
function _MCSecondaryPill({ session, onClick }) {
  return (
    <span
      onClick={onClick}
      title={`${session.blueprint} · ${session.status}`}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '3px 5px', borderRadius: 4,
        background: session.state === 'failed' ? 'rgba(251,73,52,0.10)'
                  : session.state === 'done'   ? 'rgba(152,151,26,0.08)'
                  : 'rgba(250,189,47,0.06)',
        border: '1px solid ' + (
          session.state === 'failed' ? 'rgba(251,73,52,0.25)'
          : session.state === 'needs-input' ? 'rgba(250,189,47,0.45)'
          : 'rgba(255,255,255,0.06)'),
        cursor: 'pointer',
      }}
    >
      <MCAgentAvatar session={session.id} size={12} state={session.state} />
    </span>
  );
}

// ---- internals: primary slot inside the bar --------------------------------
function _MCPrimarySlot({ primary, focusedOpen }) {
  useNowTick();
  if (!primary) {
    return (
      <span style={{
        flex: 1, fontFamily: 'var(--font-sans)', fontSize: 12.5,
        color: 'var(--color-fg-muted)', letterSpacing: '-0.005em',
      }}>
        quietly…
      </span>
    );
  }
  return (
    <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
      <MCAgentAvatar session={primary.id} size={14} state={primary.state} />
      <span style={{
        fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 13,
        color: primary.state === 'failed' ? '#fb4934' : 'var(--color-fg-display)',
        whiteSpace: 'nowrap', flex: '0 0 auto',
      }}>{primary.blueprint}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--color-fg-muted)', flex: '0 0 auto' }}>·</span>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 10.5,
        color: primary.state === 'done' ? 'var(--color-accent-secondary-hi)'
              : primary.state === 'failed' ? '#fb4934'
              : 'var(--color-fg-secondary)',
        // Pack flush against the dot — no flex-grow. A spacer below pushes
        // the trailing indicator to the right edge of the bar.
        minWidth: 0, flexShrink: 1,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {primary.status}
        {primary.state === 'working' && <span className="mck-stream-caret" />}
      </span>
      <span style={{ flex: 1 }} />
      {/* Right-edge indicator. When the focused-agent panel is open below the
          bar, the elapsed timer is visible inside the chat header — so up here
          we replace the duplicate timer with an `esc` hint that mirrors how
          the panel is dismissed. */}
      {focusedOpen ? (
        <MCKbd>esc</MCKbd>
      ) : (
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--color-fg-muted)',
          flex: '0 0 auto', fontVariantNumeric: 'tabular-nums',
        }}>{elapsedFor(primary)}</span>
      )}
    </span>
  );
}

// ---- internals: split bar (presentational) ---------------------------------
//
// Three independent open states:
//   inputOpen    → primary slot replaced by a real textarea (composer mode,
//                  only used when there is no primary). Right-edge shows ↵.
//   focusedOpen  → focused-agent panel attached below the bar. Right-edge
//                  shows `esc` (the timer is duplicated in the panel header).
//   chevronOpen  → inventory dropdown attached below the bar.
// inputOpen / focusedOpen both highlight the input zone amber so the bar
// visually connects to whichever panel is below it.
function _MCBar({
  primary, secondary, width,
  inputOpen, chevronOpen, focusedOpen,
  onInput, onChevron, onSend, onClose,
  onPickSecondary, onOverflowClick,
  // Draft is owned by MissionControl so it survives panel switches — type
  // here, then if the bar transitions to having a primary the same draft
  // appears in the dropdown's spawn composer instead of being lost.
  draft, onDraftChange,
}) {
  const inputRef = React.useRef(null);
  // Auto-focus + auto-grow on open. Restoring height on each open is needed
  // because the textarea remounts when inputOpen toggles.
  React.useEffect(() => {
    if (!inputOpen) return;
    const id = requestAnimationFrame(() => {
      inputRef.current?.focus();
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
        inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
      }
    });
    return () => cancelAnimationFrame(id);
  }, [inputOpen]);

  const isWorking = !!primary && primary.state === 'working';
  const baseBorder = primary ? 'rgba(250,189,47,0.35)' : 'rgba(250,189,47,0.20)';
  const baseBg     = 'rgba(40,36,32,0.65)';
  const inputActive   = inputOpen || focusedOpen;
  const inputBorder   = inputActive  ? 'rgba(250,189,47,0.55)' : baseBorder;
  const inputBg       = inputActive  ? '#1a1614' : baseBg;
  const chevronBorder = chevronOpen ? 'rgba(250,189,47,0.55)' : baseBorder;
  const chevronBg     = chevronOpen ? '#1a1614' : baseBg;
  const chevronW = 58;
  const inputW = width - chevronW;
  // Square the bottom corners whenever a panel attaches below — otherwise
  // the bar's rounded bottom leaves a triangular sliver where the panel's
  // straight top edge meets it.
  const panelBelow = chevronOpen || focusedOpen;

  return (
    <div style={{
      width, minHeight: 30, position: 'relative',
      display: 'flex', alignItems: 'stretch',
      fontFamily: 'var(--font-sans)',
      transition: 'opacity 150ms',
      // Clip the bar so the progress sweep and handoff flash stay scoped
      // to the panel itself.
      overflow: 'hidden',
      borderRadius: panelBelow ? '6px 6px 0 0' : 6,
    }}>
      {/* INPUT ZONE — div, not button: the real textarea lives inside when
          inputOpen, so a button parent would create nested-interactive
          weirdness (focus traps, click bubbling). Click anywhere in the
          zone opens (or refocuses) the input. The zone grows downward as
          the textarea grows so all typed text stays visible. */}
      <div
        onClick={inputOpen ? () => inputRef.current?.focus() : onInput}
        style={{
          width: inputW, minHeight: 30,
          borderRadius: panelBelow ? '6px 0 0 0' : '6px 0 0 6px',
          // Use per-side borders, NOT the `border` shorthand: React's style
          // diffing only re-applies keys whose values changed. Setting the
          // shorthand resets all four sides in the DOM, which clobbers the
          // `borderRight` override the next render leaves stale. The right
          // edge is the divider against the chevron — faint white at rest,
          // amber when EITHER side is active (the chevron has `borderLeft:
          // none`, so this is also what makes its left edge light up).
          borderTop: `1px solid ${inputBorder}`,
          borderLeft: `1px solid ${inputBorder}`,
          // Bottom border doubles as the divider against the panel below.
          // When a panel attaches, light it up amber so the seam is one
          // clean line all the way across (otherwise the input zone's
          // base-color bottom looks blank next to the chevron's amber).
          borderBottom: `1px solid ${
            inputActive ? inputBorder
            : panelBelow ? 'rgba(250,189,47,0.55)'
            : inputBorder
          }`,
          borderRight: `1px solid ${
            inputActive ? inputBorder
            : chevronOpen ? chevronBorder
            : 'rgba(255,255,255,0.06)'
          }`,
          background: inputBg,
          display: 'flex',
          // Single-line: vertically centered like a chip. Multi-line: pinned
          // to the top so growth happens downward and the sparkle stays put
          // beside the first line. Padding tuned so an EMPTY open bar is
          // 30px tall — same as closed — and only grows once content wraps.
          alignItems: inputOpen ? 'flex-start' : 'center',
          padding: inputOpen ? '5px 8px' : '0 8px',
          gap: 8,
          cursor: inputOpen ? 'text' : 'pointer',
          color: 'var(--color-fg-primary)',
          transition: 'border-color 150ms, background 150ms',
          position: 'relative',
          boxSizing: 'border-box',
        }}
      >
        <span style={{
          flex: '0 0 auto', display: 'inline-flex',
          // Nudge the sparkle to align with the first line of the textarea
          // when expanded (textarea has a touch of leading from line-height).
          marginTop: inputOpen ? 3 : 0,
          color: primary || inputActive ? 'var(--color-accent-primary-hi)' : 'rgba(250,189,47,0.55)',
          transition: 'color 180ms',
        }}>
          <MCSparkleGlyph size={12} />
        </span>

        {(() => {
          // Cap pills at 3. Once total exceeds 3, collapse to 2 visible + a
          // "+N" chip absorbing the rest (so a 4th agent reads as 2 + +2).
          // Click a pill → that agent becomes primary + focused panel opens.
          // Click the +N chip → inventory dropdown opens to show everyone.
          const total = secondary.length;
          const cap = total > 3 ? 2 : 3;
          const visiblePills = secondary.slice(0, cap);
          const hiddenCount = total - visiblePills.length;
          if (total === 0 || inputOpen) return null;
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {visiblePills.map((s) => (
                <_MCSecondaryPill
                  key={s.id}
                  session={s}
                  onClick={(e) => { e.stopPropagation(); onPickSecondary?.(s); }}
                />
              ))}
              {hiddenCount > 0 && (
                <span
                  onClick={(e) => { e.stopPropagation(); onOverflowClick?.(); }}
                  style={{
                    padding: '2px 6px', borderRadius: 4,
                    background: 'rgba(250,189,47,0.10)',
                    border: '1px solid rgba(250,189,47,0.20)',
                    fontFamily: 'var(--font-mono)', fontSize: 10.5,
                    color: 'var(--color-fg-muted)', whiteSpace: 'nowrap',
                    cursor: 'pointer',
                  }}
                >+{hiddenCount}</span>
              )}
              <span style={{ flex: '0 0 1px', height: 14, background: 'rgba(255,255,255,0.06)' }} />
            </div>
          );
        })()}

        {inputOpen ? (
          <div style={{
            flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0, gap: 6,
            animation: 'mck-input-in 200ms var(--ease-enter, ease-out) both',
          }}>
            <textarea
              ref={inputRef}
              value={draft}
              rows={1}
              onChange={(e) => {
                onDraftChange?.(e.target.value);
                // Auto-grow: reset then snap to scrollHeight so the bar tracks
                // the typed content line-for-line. No max — the user wants to
                // see ALL their text, so the bar grows freely.
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              onKeyDown={(e) => {
                // Enter sends. Shift+Enter inserts a newline (browser default).
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  const t = draft.trim();
                  if (t) onSend?.(t);
                  else onClose?.();
                } else if (e.key === 'Escape') {
                  // Only Escape clears the draft. Click-outside or successful
                  // launch leave the text in place — see MissionControl.
                  e.preventDefault();
                  onDraftChange?.('');
                  onClose?.();
                }
              }}
              placeholder="describe what you want…"
              className="mck-bar-input"
              style={{
                flex: 1, minWidth: 0,
                background: 'transparent', border: 'none', outline: 'none',
                color: 'var(--color-fg-primary)',
                fontFamily: 'var(--font-sans)', fontSize: 12.5, lineHeight: 1.4,
                padding: 0, margin: 0,
                resize: 'none', overflow: 'hidden',
              }}
            />
            {/* Right-edge hint: ↵ tells the user how to submit, in the same
                spot where the elapsed timer sits when an agent is running. */}
            <MCKbd>↵</MCKbd>
          </div>
        ) : (
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', minWidth: 0, gap: 6,
            animation: 'mck-slot-in 180ms ease-out both',
          }}>
            <_MCPrimarySlot primary={primary} focusedOpen={focusedOpen} />
          </div>
        )}

        {/* indeterminate progress accent at bottom edge of the input zone */}
        {isWorking && (
          <span style={{
            position: 'absolute', left: 0, bottom: 0, height: 2, width: '38%',
            background: 'linear-gradient(90deg, transparent 0%, var(--color-accent-primary) 50%, transparent 100%)',
            animation: 'mck-progress 1.6s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
        )}
      </div>

      {/* CHEVRON ZONE */}
      <button
        type="button"
        onClick={onChevron}
        aria-label="open inventory"
        style={{
          width: chevronW, height: 30, flex: '0 0 auto',
          borderRadius: panelBelow ? '0 6px 0 0' : '0 6px 6px 0',
          // Per-side borders (not the `border` shorthand) — see input zone
          // above for the React-style-diff reasoning. Avoids `borderLeft:
          // none` getting overwritten when chevronBorder changes.
          borderTop: `1px solid ${chevronBorder}`,
          borderRight: `1px solid ${chevronBorder}`,
          borderBottom: `1px solid ${chevronBorder}`,
          borderLeft: 'none',
          background: chevronBg,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          gap: 4, padding: '0 6px',
          color: chevronOpen ? 'var(--color-accent-primary-hi)' : 'var(--color-fg-secondary)',
          cursor: 'pointer', font: 'inherit',
          // Suppress the default browser focus ring — the explicit border
          // already encodes the active/inactive state. Without this, the
          // ring lingers after click and reads as a "double border" along
          // the chevron edge that shares space with the input zone.
          outline: 'none',
          transition: 'border-color 150ms, background 150ms, color 150ms',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 9.5,
          padding: '1px 4px', borderRadius: 3,
          background: chevronOpen ? 'rgba(250,189,47,0.12)' : 'rgba(255,255,255,0.04)',
          border: '1px solid ' + (chevronOpen ? 'rgba(250,189,47,0.30)' : 'rgba(255,255,255,0.08)'),
          color: chevronOpen ? 'var(--color-accent-primary-hi)' : 'var(--color-fg-secondary)',
          letterSpacing: '-0.01em', lineHeight: 1,
        }}>⌘K</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden style={{
          transform: chevronOpen ? 'rotate(180deg)' : 'none',
          transition: 'transform 180ms var(--ease-enter)',
        }}>
          <path d="M2 3.5 L5 6.5 L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" fill="none" />
        </svg>
      </button>
    </div>
  );
}

// ---- internals: inventory dropdown -----------------------------------------
//
// Top section is a real composer for spawning a new agent — only rendered
// when there's already a primary (otherwise the bar above IS the composer,
// and a duplicate here would be confusing). When dormant, the dropdown is
// just rows: active / recent / start-new templates.
//
// Keyboard model: focusedIndex tracks the cursor — `-1` means the composer
// has focus (only valid when hasComposer), `0..N-1` indexes into the
// flattened row list. Arrow keys move it. Escape on the composer drops back
// to the first row; Escape on a row closes the whole panel via `onClose`.
function _MCInventoryPanel({
  active, recent, availableAgents, width,
  hasComposer,
  composerFocused: initialComposerFocused = false,
  // Draft is owned by MissionControl so it survives panel switches (the same
  // text shows up here that was being typed in the dormant bar's composer).
  draft, onDraftChange,
  onPickSession, onStartAgent, onLaunch, onClose,
}) {
  // Build a flat list of rows so keyboard nav can step through them as a
  // single sequence regardless of which section they belong to.
  const rows = React.useMemo(() => [
    ...active.map((s) => ({ key: 'a:' + s.id, onPick: () => onPickSession?.(s) })),
    ...recent.map((s) => ({ key: 'r:' + s.id, onPick: () => onPickSession?.(s) })),
    ...availableAgents.map((a) => ({ key: 'g:' + a.name, onPick: () => onStartAgent?.(a) })),
  ], [active, recent, availableAgents, onPickSession, onStartAgent]);

  const minIndex = hasComposer ? -1 : 0;
  const [focusedIndex, setFocusedIndex] = React.useState(
    hasComposer && initialComposerFocused ? -1 : (rows.length > 0 ? 0 : minIndex),
  );
  const containerRef = React.useRef(null);
  const composerRef = React.useRef(null);

  // Move actual DOM focus to follow focusedIndex — composer gets focus when
  // index is -1 so typing works; otherwise the container gets focus so arrow
  // keys are captured by our keydown handler (rows are non-focusable divs;
  // the visual highlight just follows focusedIndex). Also re-grow the
  // textarea to fit any draft we inherit from a previous panel state.
  React.useEffect(() => {
    if (focusedIndex === -1 && hasComposer) composerRef.current?.focus();
    else containerRef.current?.focus();
  }, [focusedIndex, hasComposer]);
  React.useEffect(() => {
    if (composerRef.current) {
      composerRef.current.style.height = 'auto';
      composerRef.current.style.height = composerRef.current.scrollHeight + 'px';
    }
  }, [hasComposer, draft]);

  // Keep focusedIndex sane if rows shrink, or if hasComposer changes.
  React.useEffect(() => {
    if (focusedIndex >= rows.length) {
      setFocusedIndex(rows.length > 0 ? rows.length - 1 : minIndex);
    } else if (focusedIndex === -1 && !hasComposer) {
      setFocusedIndex(rows.length > 0 ? 0 : 0);
    }
  }, [rows.length, focusedIndex, hasComposer, minIndex]);

  function handleKey(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((i) => Math.min(rows.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((i) => Math.max(minIndex, i - 1));
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault();
      rows[focusedIndex]?.onPick();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      if (focusedIndex === -1) {
        // Escape from composer: clear the draft (the only way to delete it
        // besides manual backspace) AND drop back to the first row.
        onDraftChange?.('');
        setFocusedIndex(rows.length > 0 ? 0 : minIndex);
      } else {
        onClose?.();
      }
    }
  }

  const inComposer = focusedIndex === -1 && hasComposer;
  const focusedKey = focusedIndex >= 0 ? rows[focusedIndex]?.key : null;

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      onKeyDown={handleKey}
      style={{
        width, background: '#1a1614',
        border: '1px solid rgba(250,189,47,0.35)', borderTop: 'none',
        borderRadius: '0 0 6px 6px',
        marginTop: -1,
        boxShadow: '0 18px 38px rgba(0,0,0,0.50)',
        overflow: 'hidden', maxHeight: 540,
        display: 'flex', flexDirection: 'column',
        fontFamily: 'var(--font-sans)',
        outline: 'none',
      }}
    >
      {/* Composer — spawn another agent while one is already in foreground.
          Only rendered when hasComposer; the dormant bar above is its own
          composer in the no-primary case, so we don't duplicate it here. */}
      {hasComposer && (
        <div style={{
          // Vertical padding matches the previous search row's `10px` so the
          // dropdown's first row keeps the same chrome height. Sparkle/kbd
          // marginTops below align each element's CENTER with the textarea's
          // first-line text center. Multi-line growth happens downward
          // (alignItems: flex-start) so they stay anchored to the first line.
          padding: '10px 12px', display: 'flex', alignItems: 'flex-start', gap: 8,
          // Focus indication is the amber background tint + an amber bottom
          // border. NOT an inset box-shadow — that would paint a 1px amber
          // line inside the panel's existing left/right borders, reading as
          // a double border on the sides.
          borderBottom: inComposer
            ? '1px solid rgba(250,189,47,0.45)'
            : '1px solid rgba(255,255,255,0.05)',
          background: inComposer ? 'rgba(250,189,47,0.04)' : 'rgba(255,255,255,0.015)',
        }}>
          <span style={{
            display: 'inline-flex', flex: '0 0 auto',
            // Text center of first line is at y ≈ 9px (lineHeight 17.5/2 + 0
            // padding); sparkle is 12px so top at 3 puts its center at y=9.
            marginTop: 3,
            color: inComposer ? 'var(--color-accent-primary-hi)' : 'rgba(250,189,47,0.55)',
            transition: 'color 180ms',
          }}>
            <MCSparkleGlyph size={12} />
          </span>
          <textarea
            ref={composerRef}
            value={draft}
            rows={1}
            onChange={(e) => {
              onDraftChange?.(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            onFocus={() => setFocusedIndex(-1)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const t = draft.trim();
                // Don't clear on launch — only Escape clears the draft. The
                // text is preserved here in case the user wants to refine.
                if (t) onLaunch?.({ prompt: t });
              }
              // Escape + arrows handled by the panel's bubble-up handler.
            }}
            placeholder="spawn another agent…"
            className="mck-bar-input"
            style={{
              flex: 1, minWidth: 0,
              background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--color-fg-primary)',
              fontFamily: 'var(--font-sans)', fontSize: 12.5, lineHeight: 1.4,
              padding: 0, margin: 0,
              resize: 'none', overflow: 'hidden',
            }}
          />
          {/* Kbd is ~15px tall; top at 1 puts its center at y ≈ 8.5, matching
              the textarea first-line text center. */}
          <span style={{ marginTop: 1, display: 'inline-flex', flex: '0 0 auto' }}>
            <MCKbd>↵</MCKbd>
          </span>
        </div>
      )}

      <div style={{ flex: 1, overflow: 'auto' }}>
        {active.length > 0 && (
          <_MCSection title="active" hint={`${active.length} running`}>
            {active.map((s) => {
              const k = 'a:' + s.id;
              return <_MCSessionRow key={s.id} session={s} kind="active"
                selected={focusedKey === k}
                onClick={() => { setFocusedIndex(rows.findIndex((r) => r.key === k)); onPickSession?.(s); }}
              />;
            })}
          </_MCSection>
        )}
        {recent.length > 0 && (
          <_MCSection title="recent" hint="continue a thread">
            {recent.map((s) => {
              const k = 'r:' + s.id;
              return <_MCSessionRow key={s.id} session={s} kind="recent"
                selected={focusedKey === k}
                onClick={() => { setFocusedIndex(rows.findIndex((r) => r.key === k)); onPickSession?.(s); }}
              />;
            })}
          </_MCSection>
        )}
        {availableAgents.length > 0 && (
          <_MCSection title="start new" hint="agents available">
            {availableAgents.map((a) => {
              const k = 'g:' + a.name;
              return <_MCAgentRow key={a.name} agent={a}
                selected={focusedKey === k}
                onClick={() => { setFocusedIndex(rows.findIndex((r) => r.key === k)); onStartAgent?.(a); }}
              />;
            })}
          </_MCSection>
        )}
        {/* Empty-state: dropdown opened with nothing to show. Avoids a
            confusingly-blank panel — give the user something to read. */}
        {!hasComposer && rows.length === 0 && (
          <div style={{
            padding: '20px 12px', textAlign: 'center',
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--color-fg-muted)', letterSpacing: '-0.005em',
          }}>
            no agents yet — type above to start one.
          </div>
        )}
      </div>
    </div>
  );
}

function _MCSection({ title, hint, children }) {
  return (
    <div>
      <div style={{ padding: '10px 12px 4px', display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: '0.10em', textTransform: 'uppercase',
          color: 'var(--color-fg-muted)',
        }}>{title}</span>
        {hint && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-fg-subtle)' }}>· {hint}</span>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function _MCSessionRow({ session, kind, onClick, selected }) {
  useNowTick();
  const isDone = session.state === 'done';
  const isFailed = session.state === 'failed';
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 12px',
      borderTop: '1px solid rgba(255,255,255,0.025)',
      borderLeft: selected ? '2px solid var(--color-accent-primary)' : '2px solid transparent',
      paddingLeft: selected ? 10 : 12,
      background: selected ? 'rgba(250,189,47,0.06)' : 'transparent',
      cursor: 'pointer',
    }}
      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.background = 'rgba(255,255,255,0.025)' }}
      onMouseLeave={(e) => { if (!selected) e.currentTarget.style.background = 'transparent' }}
    >
      <MCAgentAvatar session={session.id} size={18} state={session.state} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 13, color: 'var(--color-fg-display)' }}>
            {session.blueprint}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-fg-muted)' }}>
            · {session.id} · {session.module}
          </span>
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10.5,
          color: isFailed ? '#fb4934'
              : isDone ? 'var(--color-accent-secondary-hi)'
              : 'var(--color-fg-secondary)',
          marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{session.status}</div>
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-fg-muted)', flex: '0 0 auto', fontVariantNumeric: 'tabular-nums' }}>
        {elapsedFor(session)}
      </span>
      {kind === 'recent' && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-accent-primary-hi)', flex: '0 0 auto', marginLeft: 6 }}>
          continue ›
        </span>
      )}
    </div>
  );
}

function _MCAgentRow({ agent, onClick, selected }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 12px',
      borderTop: '1px solid rgba(255,255,255,0.025)',
      borderLeft: selected ? '2px solid var(--color-accent-primary)' : '2px solid transparent',
      paddingLeft: selected ? 10 : 12,
      background: selected ? 'rgba(250,189,47,0.06)' : 'transparent',
      cursor: 'pointer',
    }}
      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.background = 'rgba(255,255,255,0.025)' }}
      onMouseLeave={(e) => { if (!selected) e.currentTarget.style.background = 'transparent' }}
    >
      <span style={{
        width: 18, height: 18, borderRadius: 4,
        background: 'rgba(250,189,47,0.10)',
        border: '1px solid rgba(250,189,47,0.25)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--color-accent-primary-hi)',
      }}>
        <MCSparkleGlyph size={9} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 13, color: 'var(--color-fg-display)' }}>
          {agent.name}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--color-fg-muted)',
          marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {agent.blurb}
        </div>
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-accent-primary-hi)', flex: '0 0 auto' }}>
        spawn ›
      </span>
    </div>
  );
}

const MC_AVAILABLE_AGENTS = [
  { name: 'flow-builder',     blurb: 'design or refactor a workflow' },
  { name: 'debug-runner',     blurb: 'investigate a failed run' },
  { name: 'refine',           blurb: 'targeted edit to an existing flow' },
  { name: 'inbox-summarizer', blurb: 'compress unread mail into themes' },
];

// ---- internals: focused-agent dropdown -------------------------------------
function _MCFocusedAgentPanel({ session, width, onSend, onClose }) {
  useNowTick();
  // Fully controlled: the message thread and attachments are read off
  // the session itself (`session.messages`, `session.attachments`). The
  // draft (what the user is currently typing) stays local — only the
  // committed history is data. Attachments are context the calling module
  // injected: file refs, log refs, source refs, etc. — rendered as chips
  // in the panel header.
  const messages = session.messages || [];
  const attachments = session.attachments || [];
  const [draft, setDraft] = React.useState('');
  const taRef = React.useRef(null);
  // Reply field is the focal point of this panel — focus it on mount so the
  // user can start typing immediately without having to click into it.
  React.useEffect(() => {
    const id = requestAnimationFrame(() => taRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, []);

  function send() {
    const t = draft.trim();
    if (!t) return;
    setDraft('');
    onSend?.(t);
  }

  return (
    <div style={{
      width, background: '#1a1614',
      border: '1px solid rgba(250,189,47,0.35)', borderTop: 'none',
      borderRadius: '0 0 6px 6px', marginTop: -1,
      boxShadow: '0 18px 38px rgba(0,0,0,0.50)',
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
      maxHeight: 540, fontFamily: 'var(--font-sans)',
    }}>
      <div style={{
        padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <MCAgentAvatar session={session.id} size={28} state={session.state} />
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 15, color: 'var(--color-fg-display)' }}>
              {session.blueprint}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-fg-muted)' }}>
              · session {session.id}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--color-fg-secondary)' }}>{session.module}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-fg-muted)' }}>·</span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10.5,
              color: session.state === 'done' ? 'var(--color-accent-secondary-hi)' : 'var(--color-fg-muted)',
            }}>
              {session.state === 'done' ? 'done' : session.state === 'failed' ? 'failed' : session.status}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-fg-muted)' }}>·</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--color-fg-muted)', fontVariantNumeric: 'tabular-nums' }}>{elapsedFor(session)}</span>
          </div>
        </div>
      </div>

      {attachments.length > 0 && (
        <div style={{
          padding: '8px 12px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-fg-muted)', marginRight: 4 }}>
            context →
          </span>
          {attachments.map((a, i) => <_MCAttachmentChip key={i} {...a} />)}
        </div>
      )}

      <div style={{
        flex: 1, overflow: 'auto', padding: '14px 14px',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        {messages.map((m, i) => <_MCMsg key={i} {...m} session={session} />)}
      </div>

      {/* Real composer — type + Enter to post into the thread. Shift+Enter
          inserts a newline. Auto-grows up to ~5 lines via rows + maxHeight. */}
      <div style={{
        padding: '8px 12px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'flex-end', gap: 8,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 13,
          color: 'var(--color-fg-muted)', paddingBottom: 4,
        }}>›</span>
        <textarea
          ref={taRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              onClose?.();
            }
          }}
          placeholder="reply…"
          rows={1}
          style={{
            flex: 1, minWidth: 0, boxSizing: 'border-box',
            background: 'transparent', border: 'none', outline: 'none',
            color: 'var(--color-fg-primary)',
            fontFamily: 'var(--font-sans)', fontSize: 12.5, lineHeight: 1.5,
            resize: 'none', padding: '4px 0', maxHeight: 100,
          }}
        />
        <MCKbd>↵</MCKbd>
      </div>
    </div>
  );
}

function _MCAttachmentChip({ icon, label, count }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 7px', borderRadius: 3,
      background: 'rgba(250,189,47,0.08)',
      border: '1px solid rgba(250,189,47,0.20)',
      fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--color-fg-secondary)',
      cursor: 'default',
    }}>
      {icon && <span style={{ color: 'var(--color-accent-primary-hi)' }}>{icon}</span>}
      {label}
      {count != null && <span style={{ color: 'var(--color-fg-muted)' }}>· {count}</span>}
    </span>
  );
}

function _MCMsg({ from = 'agent', text, code, session, streaming = false }) {
  const isUser = from === 'user';
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
      <span style={{ flex: '0 0 auto', marginTop: 1 }}>
        {isUser
          ? <span style={{
              display: 'inline-block', width: 14, height: 14, borderRadius: '50%',
              background: 'var(--color-bg-card-hi)', border: '1px solid var(--color-border-default)',
            }} />
          : <MCAgentAvatar session={session.id} size={14} state="idle" />}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {text && (
          <div style={{
            fontFamily: 'var(--font-sans)', fontSize: 12.5, lineHeight: 1.55,
            color: isUser ? 'var(--color-fg-display)' : 'var(--color-fg-primary)',
          }}>
            {text}
            {streaming && <span className="mck-stream-caret" style={{ color: 'var(--color-fg-secondary)' }} />}
          </div>
        )}
        {code && (
          <pre style={{
            margin: '6px 0 0', padding: '8px 10px',
            background: 'rgba(0,0,0,0.30)', borderRadius: 4,
            fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.5,
            color: 'var(--color-fg-secondary)', whiteSpace: 'pre',
            border: '1px solid rgba(255,255,255,0.04)',
          }}>{code}</pre>
        )}
      </div>
    </div>
  );
}

// ---- the one component -----------------------------------------------------

function MissionControl({
  // The whole data model: a list of active agents, plus which one is the
  // primary. Empty list → dormant bar. The first agent is primary by
  // default; pass `initialPrimaryId` to override.
  agents = [],
  initialPrimaryId = null,

  // bar chrome
  width = 520,

  // initial dropdown state (for demos that pin a frozen state)
  initialOpen = null,          // 'input' | 'chevron' | 'focused' | null

  // inventory dropdown data
  recent = [],
  availableAgents = [],
  composerFocused = false,

  // callbacks
  onLaunch,                    // ({ prompt }) → launch a new agent
  onPromote,                   // (id)         → user picked a different primary
  onPickSession,               // (session)    → user clicked a session in inventory
  onStartAgent,                // (agent)      → user picked an agent template to spawn
  onSend,                      // (agentId, text) → reply in focused panel
}) {
  useMcKitStyles();

  // Which agent is currently primary. Defaults to initialPrimaryId, then to
  // the first agent in the list. Clicking a pill promotes that agent.
  const [primaryId, setPrimaryId] = React.useState(initialPrimaryId);
  const effectivePrimaryId = primaryId ?? agents[0]?.id ?? null;
  const primary = agents.find((a) => a.id === effectivePrimaryId) || null;
  const secondary = primary
    ? agents.filter((a) => a.id !== primary.id)
    : agents;

  const [open, setOpen] = React.useState(initialOpen);

  // The composer draft is OWNED here so it survives panel transitions:
  //   • dormant bar's inline composer ↔ inventory dropdown's spawn composer
  //     share the same text — typing in one continues in the other.
  //   • A successful launch leaves the draft in place; only Escape (or
  //     manual delete) clears it.
  const [draft, setDraft] = React.useState('');

  // Wrapper ref for outside-click detection — clicks elsewhere on the page
  // close an open inline composer ONLY when the draft is empty (so users
  // don't accidentally lose work).
  const containerRef = React.useRef(null);
  React.useEffect(() => {
    if (open !== 'input') return;
    const onMouseDown = (e) => {
      if (!containerRef.current?.contains(e.target) && !draft.trim()) {
        setOpen(null);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [open, draft]);

  // Escape handling lives inside each panel (composer textarea, inventory
  // panel, focused-agent textarea) and calls `onClose` below — no global
  // window listener, so Escape behaviour can be context-sensitive (e.g. in
  // the inventory it first hops out of the composer field).

  const toggle = (mode) => setOpen((cur) => (cur === mode ? null : mode));

  // Active agents shown in the inventory's "active" section: literally the
  // current agent list. Single source of truth.
  const activeForInventory = agents;

  // Tab toggles between the two open surfaces while focus is anywhere in the
  // component: the chat/composer (input mode if there's no primary, focused
  // panel if there is) and the inventory dropdown. Default Tab behaviour
  // (move browser focus) is preempted only when a panel is actually open.
  function handleTab(e) {
    if (e.key !== 'Tab' || !open) return;
    e.preventDefault();
    if (open === 'chevron') setOpen(primary ? 'focused' : 'input');
    else setOpen('chevron');
  }

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column' }} onKeyDown={handleTab}>
      <_MCBar
        primary={primary} secondary={secondary} width={width}
        inputOpen={open === 'input'}
        chevronOpen={open === 'chevron'}
        focusedOpen={open === 'focused'}
        draft={draft}
        onDraftChange={setDraft}
        // No primary → click input zone to compose a new prompt (inline
        // textarea). Primary present → click input zone to view/talk to
        // that agent (focused-agent panel below).
        onInput={() => (primary ? toggle('focused') : toggle('input'))}
        onChevron={() => toggle('chevron')}
        // Don't clear the draft on launch — the user wants the text
        // preserved (only Escape clears).
        onSend={(t) => { setOpen(null); onLaunch?.({ prompt: t }); }}
        onClose={() => setOpen(null)}
        // Click a pill → promote that agent to primary, open the focused panel.
        // Click the +N chip → open the inventory dropdown to see them all.
        onPickSecondary={(s) => {
          setPrimaryId(s.id);
          setOpen('focused');
          onPromote?.(s.id);
        }}
        onOverflowClick={() => setOpen('chevron')}
      />
      {open === 'chevron' && (
        <_MCInventoryPanel
          active={activeForInventory} recent={recent} availableAgents={availableAgents}
          width={width}
          // Composer at the top of the dropdown is for spawning ANOTHER
          // agent while one is already in foreground. When dormant, the bar
          // above is the composer — no need to duplicate it here.
          hasComposer={!!primary}
          composerFocused={composerFocused}
          draft={draft}
          onDraftChange={setDraft}
          onLaunch={(args) => { setOpen(null); onLaunch?.(args); }}
          onPickSession={(s) => {
            // Inventory pick also promotes — keeps the model coherent.
            setPrimaryId(s.id);
            setOpen('focused');
            onPickSession?.(s);
            onPromote?.(s.id);
          }}
          onStartAgent={onStartAgent}
          onClose={() => setOpen(null)}
        />
      )}
      {open === 'focused' && primary && (
        <_MCFocusedAgentPanel
          session={primary}
          width={width}
          onSend={(t) => onSend?.(primary.id, t)}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}

// =========================================================================
// END MissionControl — everything below here is kit-page glue.
// =========================================================================

/* ---- The page itself. Every row is the SAME MissionControl component
 * driven by different props. Source of truth for the design — when this
 * looks right, the section above (the component itself) gets copied into
 * mission-control/frontend.jsx and wired to real data. ---- */

function MissionControlPage() {

  // Live status text rotates every 1s; elapsed counts up from `startedAt`
  // (handled live by the bar's internal useNowTick — no manual counter).
  const liveStartRef = React.useRef(Date.now());
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const liveSession = React.useMemo(() => ({
    id: 'live01',
    blueprint: 'flow-builder',
    module: 'flows',
    status: ['composing prompt', 'fetching transcript', 'extracting steps', 'writing draft'][tick % 4],
    startedAt: liveStartRef.current,
    state: 'working',
  }), [tick]);

  // Mock data — trimmed to a handful so the eye-pulse animations on
  // `working` avatars don't saturate the page.
  const recent = [mcFind('q4f'), mcFind('p5c')];

  // Demo agents that ship with their own thread + attachments baked into
  // the session object — `_MCFocusedAgentPanel` reads `session.messages`
  // and `session.attachments` directly. Wrapped in useState so the kit's
  // `onSend` can mutate locally and the thread visibly grows when the
  // user replies.
  const [chatAgents, setChatAgents] = React.useState(() => ({
    k7x: {
      ...mcFind('k7x'),
      attachments: [
        { label: 'youtube · 14:22', count: 7 },
        { label: 'transcript' },
        { label: 'flow-builder skill' },
      ],
      messages: [
        { from: 'user', text: 'pull the steps out of this youtube transcript and turn them into a flow' },
        { from: 'agent', text: 'fetched 14:22 transcript. extracting 7 distinct steps; first 3 done.' },
        { from: 'agent', code: `manifest = {\n  name: 'video → flow',\n  trigger: 'manual',\n  stages: ['intro', 'setup', 'demo'],\n};` },
        { from: 'agent', text: 'next: deciding which step is the trigger.', streaming: true },
      ],
    },
    b2p: {
      ...mcFind('b2p'),
      attachments: [{ label: 'inbox · 23 unread' }, { label: 'rules' }],
      messages: [
        { from: 'user', text: 'group the unread mail by theme' },
        { from: 'agent', text: 'reading 23 threads… clustered into 4 themes so far.' },
      ],
    },
  }));

  // Demo `onSend`: append the user's reply, then a canned echo from the
  // agent so the thread visibly grows. In production, the parent would
  // append the user message AND wire up a real backend reply.
  function appendDemoReply(agentId, text) {
    setChatAgents((cur) => ({
      ...cur,
      [agentId]: {
        ...cur[agentId],
        messages: [...(cur[agentId]?.messages || []), { from: 'user', text }],
      },
    }));
    setTimeout(() => {
      setChatAgents((cur) => ({
        ...cur,
        [agentId]: {
          ...cur[agentId],
          messages: [
            ...(cur[agentId]?.messages || []),
            { from: 'agent', text: `noted — i'll work on: "${text}". (this is a demo reply.)` },
          ],
        },
      }));
    }, 320);
  }

  return (
    <div className="mt-4" data-mc-page>
      <Row label="composer · inline" desc="dormant bar with the input pre-opened. type to compose — the textarea grows downward as you go (no max height); ⏎ sends, esc cancels.">
        <MissionControl
          agents={[]}
          initialOpen="input"
          onLaunch={({ prompt }) => alert(`(demo) would launch claude with prompt:\n\n${prompt}`)}
        />
      </Row>

      {/* ---- primitives — atomic pieces the bar is composed of ---- */}
      <Row label="agent icon" desc="deterministic 8×8 mirrored pixel face. hue picked from a 16-color palette by hash. five lifecycle states with their own animations.">
        {['idle', 'working', 'needs-input', 'done', 'failed'].map((st) => (
          <span key={st} className="inline-flex items-center gap-2 font-mono text-11 text-fg-secondary">
            <MCAgentAvatar session="iris-04" size={20} state={st} />
            {st}
          </span>
        ))}
      </Row>

      <Row label="agent icon · variety" desc="12 generated icons to show palette spread. names are arbitrary; the hash decides hue + grid. all idle so animations don't pile up.">
        <div className="flex flex-wrap items-center gap-2">
          {Array.from({ length: 12 }, (_, i) => `s-${(i + 1).toString(36)}-${(i * 7 + 11).toString(36)}`).map((id) => (
            <span key={id} title={id} className="inline-flex items-center justify-center w-7 h-7 rounded bg-card border border-subtle">
              <MCAgentAvatar session={id} size={18} state="idle" />
            </span>
          ))}
        </div>
      </Row>

      {/* ---- the bar — composed from the primitives above ---- */}
      <Row label="primary slot" desc="four `agents=[…]` shapes whose first entry is the primary: working, done, failed, focused. click any input zone to open that agent's focused panel.">
        <div className="flex flex-col gap-2">
          <MissionControl agents={[chatAgents.b2p]} recent={recent} availableAgents={MC_AVAILABLE_AGENTS} onSend={appendDemoReply} />
          <MissionControl agents={[mcFind('q4f')]} recent={recent} availableAgents={MC_AVAILABLE_AGENTS} />
          <MissionControl agents={[mcFind('h2u')]} recent={recent} availableAgents={MC_AVAILABLE_AGENTS} />
          <MissionControl agents={[mcFind('a3k')]} recent={recent} availableAgents={MC_AVAILABLE_AGENTS} />
        </div>
      </Row>

      <Row label="density" desc="agent count grows from 0 to many. primary is the first entry; the rest become pills. cap is 3 — past that only 2 stay visible and the rest collapse into a +N chip. click a pill to promote, click +N to open the inventory.">
        <div className="flex flex-col gap-2">
          <MissionControl agents={[]} />
          <MissionControl agents={[mcFind('a3k')]} />
          <MissionControl agents={[mcFind('a3k'), mcFind('q4f'), mcFind('w1n'), mcFind('p5c')]} recent={recent} availableAgents={MC_AVAILABLE_AGENTS} />
          <MissionControl agents={[mcFind('a3k'), mcFind('q4f'), mcFind('w1n'), mcFind('p5c'), mcFind('u4d')]} recent={recent} availableAgents={MC_AVAILABLE_AGENTS} />
          <MissionControl agents={MC_SESSIONS.slice(0, 12)} recent={recent} availableAgents={MC_AVAILABLE_AGENTS} />
        </div>
      </Row>

      <Row label="inventory open" desc="bar with the chevron dropdown attached. top is a composer for spawning a new agent (only when there's a primary, otherwise the bar above is the composer). below: active sessions, recent threads, available agent templates. click a row to promote it.">
        <MissionControl
          agents={[mcFind('a3k'), mcFind('b2p'), mcFind('q4f'), mcFind('m9v')]}
          initialOpen="chevron"
          recent={recent}
          availableAgents={MC_AVAILABLE_AGENTS}
          onStartAgent={(a) => alert(`(demo) would spawn agent: ${a.name}`)}
        />
      </Row>

      <Row label="spawn from dropdown" desc="when an agent is in the bar, the top of the dropdown becomes a composer for spawning ANOTHER agent. shown here with the composer pre-focused. ↵ launches; arrow-down moves into the active list.">
        <MissionControl
          agents={[mcFind('a3k'), mcFind('b2p')]}
          initialOpen="chevron"
          composerFocused={true}
          recent={recent.slice(0, 2)}
          availableAgents={MC_AVAILABLE_AGENTS.slice(0, 3)}
          onLaunch={({ prompt }) => alert(`(demo) would launch claude with prompt:\n\n${prompt}`)}
        />
      </Row>

      <Row label="focused agent" desc="bar with the focused-agent panel attached below. header + context capsules + message thread + real composer (type a reply, press ⏎).">
        <MissionControl
          agents={[chatAgents.k7x]}
          initialOpen="focused"
          onSend={appendDemoReply}
        />
      </Row>

      <Row label="end-to-end · live" desc="real-time bar: status text rotates, elapsed ticks, working caret runs. same component as every row above — only the data changes.">
        <MissionControl
          agents={[liveSession, chatAgents.b2p, mcFind('q4f')]}
          recent={recent}
          availableAgents={MC_AVAILABLE_AGENTS}
          onSend={appendDemoReply}
        />
      </Row>

    </div>
  );
}

// Read/write the active page in the URL via ?tab=… so reloads land you back
// where you were. The shell owns the pathname (/kit); we only touch the
// search string, so module-level routing stays intact.
function readTabFromUrl() {
  if (typeof window === 'undefined') return 'kit';
  const t = new URLSearchParams(window.location.search).get('tab');
  return PAGES.some((p) => p.id === t) ? t : 'kit';
}
function writeTabToUrl(id) {
  const url = new URL(window.location.href);
  if (id === 'kit') url.searchParams.delete('tab');
  else url.searchParams.set('tab', id);
  // replaceState (not push) — back button still navigates between modules,
  // not between kit's tabs.
  window.history.replaceState(null, '', url.toString());
}

export default function Module() {
  const [page, setPageState] = useState(readTabFromUrl);
  const setPage = (id) => { writeTabToUrl(id); setPageState(id); };
  // Browser back/forward across modules — re-sync from URL when we return.
  useEffect(() => {
    const onPop = () => setPageState(readTabFromUrl());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const lastIdx = useRef(0);
  const idx = PAGES.findIndex((p) => p.id === page);
  const direction = idx >= lastIdx.current ? 'fwd' : 'bwd';
  useEffect(() => { lastIdx.current = idx; }, [idx]);

  /* When View Transitions are supported, the browser cross-fades the page
   * snapshot for us — we only want the per-section cascade on top, no extra
   * wrapper slide. Without VT support, fall back to the directional slide. */
  const wrapperStyle = SUPPORTS_VT
    ? undefined
    : { animation: `kit-page-in-${direction} var(--duration-slow) var(--ease-enter) both` };

  return (
    <div className="flex-1 min-h-0 overflow-auto px-8 py-4">
      <PageTabs page={page} onPage={setPage} />
      <div key={page} style={wrapperStyle}>
        {page === 'kit'    && <KitPage />}
        {page === 'design' && <DesignPage />}
        {page === 'brand'  && <BrandPage />}
        {page === 'pegboard' && <PegboardPage />}
        {page === 'mission-control' && <MissionControlPage />}
      </div>
    </div>
  );
}
