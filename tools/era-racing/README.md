# Era Racing web

Versão independente em `public/games/era-racing/`. Publique essa pasta em um servidor HTTP estático ou na pasta pública da LP. Não abra o HTML com `file://`: módulos JavaScript e modelos GLB precisam de HTTP.

## Conteúdo

- Pista e quatro carros exportados da cena `D:\projetos\Games\fusca_race\Duelo_1x1.blend`.
- Modelos em glTF binário, aproximadamente 45 mil triângulos por carro, imagens de até 1024 px. Materiais procedurais do cenário são aproximados pelas cores originais, sem reproduzir todos os efeitos do render Blender.
- Lógica da corrida adaptada de `duel_core.py`: uma corrida contra IA, seleção dos dois carros, voltas, dificuldade, colisões, freio, pausa e seis câmeras.
- Bibliotecas Three.js 0.180.0 locais, com licença em `vendor/LICENSE.txt`. Sem dependência de CDN durante o jogo.
- Carregamento inicial da pista, Fusca e McLaren; Porsche e GAZ carregam apenas ao serem selecionados.
- Som de motor sintetizado no navegador. Não é gravação real dos veículos.

## Reexportar

No PowerShell, a partir da raiz da LP:

```powershell
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' --background --python tools/era-racing/export_blender.py -- 'D:\projetos\Games\fusca_race\Duelo_1x1.blend' 'C:\Users\Alexandre\Documents\ChatGPT\LandingPage Alexandre\public\games\era-racing\assets'
node --test tools/era-racing/race-core.test.mjs
```

O exportador nunca salva alterações no `.blend` original. O relatório de peso e geometria fica em `assets/export-report.json`.

## Integração na LP

`FrontierPreview.jsx` mantém a imagem de capa e só cria o iframe depois de clicar em Jogar. O botão Fechar jogo descarrega o iframe; sair da área visível ou mudar de aba pausa a corrida e o som. Nenhuma camada de hover ou de desbloqueio impede toques.

O game é uma versão beta. Testado no navegador desktop e em viewport de celular; o desempenho de GPU ainda deve ser conferido em aparelhos físicos.
