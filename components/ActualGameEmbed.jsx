'use client'

export default function ActualGameEmbed({ compact = false }) {
  return (
    <div className={`actual-game-embed ${compact ? 'compact' : ''}`}>
      <iframe
        src={`/games/patrulha-tupa/index.html${compact ? '?mode=preview' : ''}`}
        title="Patrulha Tupã, game voxel 3D criado com inteligência artificial"
        loading={compact ? 'eager' : 'lazy'}
        sandbox="allow-scripts allow-pointer-lock"
        allow="fullscreen"
      />
    </div>
  )
}
