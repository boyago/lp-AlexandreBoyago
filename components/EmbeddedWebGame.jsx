'use client'

export default function EmbeddedWebGame({ src, title }) {
  return (
    <div className="actual-game-embed embedded-web-game">
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow="fullscreen; gamepad"
        sandbox="allow-scripts allow-same-origin allow-pointer-lock"
      />
    </div>
  )
}
