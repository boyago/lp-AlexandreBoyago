// ClaudeMascot — pixel-art fiel ao mascote oficial do Claude Code.
// Quadrado laranja #D97757, 2 olhos pretos quadrados, 2 braços laterais,
// 4 perninhas embaixo. Desenho em grid de "pixels" usando divs.

function ClaudeMascot() {
  return (
    <div style={mStyles.root}>
      <style>{mKeyframes}</style>

      {/* Code trail scrolling on the ground */}
      <div style={mStyles.ground}>
        <div style={mStyles.codeTrail}>
          {Array.from({length: 2}).map((_, r) => (
            <React.Fragment key={r}>
              <span style={mStyles.trailItem}>{'> claude code --build'}</span>
              <span style={mStyles.trailItem}>{'{ while(true) learn(); }'}</span>
              <span style={mStyles.trailItem}>{'<App />'}</span>
              <span style={mStyles.trailItem}>{'deploy.sh → ok ✓'}</span>
              <span style={mStyles.trailItem}>{'git commit -m "future"'}</span>
              <span style={mStyles.trailItem}>{'npm run build ✓'}</span>
              <span style={mStyles.trailItem}>{'$ ship it'}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Walking Claudius */}
      <div style={mStyles.walker}>
        <div style={mStyles.bobber}>
          <PixelClaudius size={3} walking />
        </div>
        <div style={mStyles.shadow}></div>
      </div>

      {/* Working Claudius at monitor */}
      <div style={mStyles.desk}>
        <div style={mStyles.monitor}>
          <div style={mStyles.monitorBar}>
            <span style={{...mStyles.miniDot, background: '#ff5f56'}}></span>
            <span style={{...mStyles.miniDot, background: '#ffbd2e'}}></span>
            <span style={{...mStyles.miniDot, background: '#27c93f'}}></span>
          </div>
          <div style={mStyles.monitorScreen}>
            <div><span style={mStyles.kw}>const</span> <span style={mStyles.var}>app</span> = <span style={mStyles.fn}>build</span>()</div>
            <div><span style={mStyles.kw}>await</span> <span style={mStyles.var}>app</span>.<span style={mStyles.fn}>deploy</span>()</div>
            <div><span style={mStyles.cm}>// shipped ✓</span><span style={mStyles.cur}>▊</span></div>
          </div>
        </div>
        <div style={mStyles.typer}>
          <PixelClaudius size={2} />
        </div>
      </div>

      {/* Jumping celebrating Claudius */}
      <div style={mStyles.cheer}>
        <div style={mStyles.jumper}>
          <PixelClaudius size={2.3} />
          <span style={{...mStyles.spark, top: -6, left: -8, animationDelay: '0s'}}>✦</span>
          <span style={{...mStyles.spark, top: 0, right: -10, animationDelay: '0.3s'}}>✦</span>
          <span style={{...mStyles.spark, bottom: 8, left: -12, animationDelay: '0.6s'}}>✦</span>
        </div>
      </div>
    </div>
  );
}

// Pixel-art Claudius: 14×13 grid. Each cell = `size` pixels.
function PixelClaudius({ size = 3, walking = false }) {
  // 1 = body orange, 2 = eye black, 0 = transparent
  const grid = [
    [0,0,0,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,1,1,2,2,1,2,2,1,0,0,0],
    [0,0,0,1,1,2,2,1,2,2,1,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,0,0,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,0,0,0],
    [0,1,0,1,1,0,1,1,0,1,1,0,1,0],
    [0,1,0,1,1,0,1,1,0,1,1,0,1,0],
  ];

  const px = (n) => `${n * size}px`;
  const w = grid[0].length * size;
  const h = grid.length * size;

  return (
    <div style={{
      position: 'relative',
      width: w, height: h,
      imageRendering: 'pixelated',
    }}>
      {grid.flatMap((row, y) =>
        row.map((cell, x) => {
          if (cell === 0) return null;
          // Animate legs (last 2 rows) alternating if walking
          let animation;
          if (walking && y >= 10) {
            // Split legs into pairs: cols 1, 3-4, 6-7, 9-10, 12
            const legGroup = x < 5 ? 0 : x < 8 ? 1 : x < 11 ? 2 : 3;
            animation = legGroup % 2 === 0 ? 'legStep1 0.4s ease-in-out infinite' : 'legStep2 0.4s ease-in-out infinite';
          }
          return (
            <div key={`${x}-${y}`} style={{
              position: 'absolute',
              left: px(x), top: px(y),
              width: px(1), height: px(1),
              background: cell === 1 ? '#D97757' : '#1A1A1A',
              animation,
            }} />
          );
        })
      )}
    </div>
  );
}

const mKeyframes = `
  @keyframes walk {
    0% { transform: translateX(0) scaleX(1); }
    48% { transform: translateX(calc(60vw - 60px)) scaleX(1); }
    50% { transform: translateX(calc(60vw - 60px)) scaleX(-1); }
    98% { transform: translateX(0) scaleX(-1); }
    100% { transform: translateX(0) scaleX(1); }
  }
  @keyframes bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
  }
  @keyframes legStep1 {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-2px); }
  }
  @keyframes legStep2 {
    0%, 100% { transform: translateY(-2px); }
    50% { transform: translateY(0); }
  }
  @keyframes trailScroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes type {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-2px); }
  }
  @keyframes jump {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes sparkle {
    0%, 100% { transform: scale(0.6); opacity: 0.3; }
    50% { transform: scale(1.2); opacity: 1; }
  }
  @keyframes cursorBlink { 50% { opacity: 0; } }
`;

const mStyles = {
  root: {
    position: 'relative',
    height: 120,
    marginTop: 12,
    marginBottom: 8,
    background: 'transparent',
    borderTop: '1px dashed #1a1a1a',
    borderBottom: '1px dashed #1a1a1a',
    overflow: 'hidden',
  },
  ground: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 16, overflow: 'hidden',
    borderTop: '1px solid #151515',
    background: '#050505',
  },
  codeTrail: {
    display: 'flex', gap: 36, height: '100%', alignItems: 'center',
    whiteSpace: 'nowrap',
    animation: 'trailScroll 40s linear infinite',
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 10, color: '#333',
    paddingLeft: 36, width: 'max-content',
  },
  trailItem: { flexShrink: 0 },

  walker: {
    position: 'absolute', bottom: 20, left: 8,
    animation: 'walk 14s ease-in-out infinite',
  },
  bobber: { animation: 'bob 0.4s ease-in-out infinite' },
  shadow: {
    position: 'absolute', bottom: -4, left: 4,
    width: 36, height: 5,
    background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)',
    filter: 'blur(2px)',
  },

  desk: {
    position: 'absolute', bottom: 22, right: '22%',
    display: 'flex', alignItems: 'flex-end', gap: 4,
  },
  monitor: {
    width: 128, height: 78,
    background: '#0f0f0f',
    border: '1px solid #2a2a2a', borderRadius: 3,
    overflow: 'hidden',
    boxShadow: '0 0 20px rgba(0,255,136,0.1)',
  },
  monitorBar: {
    height: 12, background: '#1a1a1a',
    display: 'flex', gap: 4, alignItems: 'center',
    padding: '0 6px', borderBottom: '1px solid #222',
  },
  miniDot: { width: 5, height: 5, borderRadius: '50%' },
  monitorScreen: {
    padding: '6px 8px',
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 8.5, lineHeight: 1.7,
    color: '#e0e0e0',
  },
  kw: { color: '#c770ff' },
  var: { color: '#4a9eff' },
  fn: { color: '#00ff88' },
  cm: { color: '#555' },
  cur: { color: '#00ff88', animation: 'cursorBlink 0.8s step-end infinite' },
  typer: { animation: 'type 0.25s ease-in-out infinite' },

  cheer: { position: 'absolute', bottom: 22, right: '8%' },
  jumper: { position: 'relative', animation: 'jump 1.2s ease-in-out infinite' },
  spark: {
    position: 'absolute', color: '#00ff88', fontSize: 14,
    animation: 'sparkle 1.2s ease-in-out infinite',
  },
};

Object.assign(window, { ClaudeMascot });
