import Image from 'next/image'
import { FlagCheckered } from '@phosphor-icons/react/dist/ssr'

// Prévia do Era Racing enquanto a exportação jogável do projeto Blender ainda está em produção.
export default function FrontierPreview() {
  return (
    <div className="cinematic-game-preview">
      <Image src="/images/era-racing-blender.png" alt="Prévia de Era Racing criada no Blender, com um carro clássico e um Fórmula 1 alinhados em uma pista 3D" fill sizes="(max-width: 900px) 100vw, 1100px" />
      <div className="cinematic-shade" />
      <div className="cinematic-copy">
        <span>NOVO PROJETO · CRIADO NO BLENDER</span>
        <h3>Era Racing</h3>
        <p>Um encontro impossível entre épocas: carros clássicos, esportivos modernos e máquinas de Fórmula 1 disputam a mesma pista em um game 3D.</p>
        <strong className="cinematic-status"><FlagCheckered weight="fill" /> GAME EM DESENVOLVIMENTO</strong>
      </div>
    </div>
  )
}
