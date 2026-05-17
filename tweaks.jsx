/* hone — tweaks panel
   exposes the five accent presets (one per featured bean) and a
   couple of feel-of-the-cafe knobs. each preset re-tints the whole
   site by mutating CSS custom properties on :root. */

const HONE_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "featured": "konga",
  "grain": true,
  "darkClasses": true
}/*EDITMODE-END*/;

const BEAN_PRESETS = {
  konga:       { label: "ethiopia konga",      country: "ethiopia, yirgacheffe",        accent: "#b06a3b", ink: "#7e4a25", swatch: "#b06a3b" }, // copper
  inmaculada:  { label: "colombia inmaculada", country: "colombia, huila",              accent: "#2f5a44", ink: "#1f4031", swatch: "#2f5a44" }, // deep green
  gichathaini: { label: "kenya gichathaini",   country: "kenya, nyeri",                 accent: "#8b2e3a", ink: "#5e1f27", swatch: "#8b2e3a" }, // wine
  injerto:     { label: "guatemala el injerto",country: "guatemala, huehuetenango",     accent: "#a87332", ink: "#74501f", swatch: "#a87332" }, // honey
  frinsa:      { label: "indonesia frinsa",    country: "indonesia, west java",         accent: "#3d4a7a", ink: "#272f52", swatch: "#3d4a7a" }, // indigo
};

function HoneTweaks(){
  const [t, setTweak] = useTweaks(HONE_TWEAK_DEFAULTS);

  // apply accent to :root
  React.useEffect(() => {
    const preset = BEAN_PRESETS[t.featured] || BEAN_PRESETS.konga;
    const root = document.documentElement;
    root.style.setProperty('--accent', preset.accent);
    root.style.setProperty('--accent-ink', preset.ink);

    // also swap the "now pouring" hero eyebrow + ticker copy + the
    // big now-pouring section so the preview tells the full story.
    const live = document.querySelector('.bean.live');
    if (live){
      // move the live indicator to the matching bean row
      document.querySelectorAll('.bean').forEach(b => b.classList.remove('live'));
      const target = document.querySelector(`.bean[data-bean="${t.featured}"]`);
      if (target) target.classList.add('live');
    }
    // hero eyebrow + strip text
    document.querySelectorAll('[data-bind="featured-label"]').forEach(el => {
      el.textContent = preset.label;
    });
  }, [t.featured]);

  // grain on/off
  React.useEffect(() => {
    document.body.style.backgroundImage = t.grain ? '' : 'none';
  }, [t.grain]);

  // dark classes section on/off
  React.useEffect(() => {
    const sec = document.querySelector('section.classes');
    if (!sec) return;
    if (t.darkClasses){
      sec.style.background = '';
      sec.style.color = '';
    } else {
      sec.style.background = 'var(--bg-deep)';
      sec.style.color = 'var(--ink)';
    }
  }, [t.darkClasses]);

  // bean preset cards — show as a vertical stack of full-width rows
  // with a colour bar on the left so it feels like a paint chip.
  const beanOptions = Object.entries(BEAN_PRESETS).map(([key, p]) => ({
    key, ...p
  }));

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="This week's bean" subtitle="resets the accent across the whole site">
        <div style={{display:'flex', flexDirection:'column', gap:6}}>
          {beanOptions.map(p => {
            const selected = t.featured === p.key;
            return (
              <button
                key={p.key}
                onClick={() => setTweak('featured', p.key)}
                style={{
                  display:'grid',
                  gridTemplateColumns:'8px 1fr auto',
                  alignItems:'center',
                  gap:14,
                  padding:'12px 12px 12px 0',
                  background: selected ? 'rgba(0,0,0,0.04)' : 'transparent',
                  border:'1px solid ' + (selected ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.08)'),
                  borderRadius:8,
                  cursor:'pointer',
                  textAlign:'left',
                  font:'inherit',
                  transition:'background .2s ease, border-color .2s ease',
                }}
              >
                <span style={{
                  alignSelf:'stretch',
                  background: p.swatch,
                  borderTopLeftRadius:7, borderBottomLeftRadius:7,
                }} />
                <span style={{display:'flex', flexDirection:'column', gap:2}}>
                  <span style={{fontSize:13, fontWeight:500, letterSpacing:'.01em'}}>{p.label}</span>
                  <span style={{fontSize:11, color:'rgba(0,0,0,0.55)', fontFamily:'monospace', letterSpacing:'.08em', textTransform:'uppercase'}}>{p.country}</span>
                </span>
                <span style={{
                  width:18, height:18, borderRadius:'50%',
                  border: selected ? '5px solid ' + p.swatch : '1px solid rgba(0,0,0,0.18)',
                  transition:'all .2s ease',
                }} />
              </button>
            );
          })}
        </div>
      </TweakSection>

      <TweakSection title="Feel">
        <TweakToggle label="Paper grain on background" value={t.grain} onChange={v => setTweak('grain', v)} />
        <TweakToggle label="Dark classes section" value={t.darkClasses} onChange={v => setTweak('darkClasses', v)} />
      </TweakSection>
    </TweaksPanel>
  );
}

const honeMount = document.createElement('div');
document.body.appendChild(honeMount);
ReactDOM.createRoot(honeMount).render(<HoneTweaks />);
