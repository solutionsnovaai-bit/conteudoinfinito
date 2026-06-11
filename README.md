# C.I.A — Conteúdo Infinito com IA

Landing page de alta conversão para o curso **C.I.A — Conteúdo Infinito com IA**.  
Ensina donos de negócio a criar posts, reels e stories profissionais com IA gratuita, direto do celular.

---

## 🗂 Estrutura do projeto

```
cia-landing/
├── index.html          # Página principal (toda a landing)
├── main.js             # Animações GSAP, ScrollTrigger, Lenis, partículas
├── styles.css          # Todos os estilos (tokens, seções, responsivo)
├── .gitignore
├── README.md
└── assets/
    ├── hero-wide.jpg           # Imagem de fundo do hero (1920×1080)
    ├── demo-poster.png         # Thumbnail vertical do vídeo demo (380×675)
    ├── mockup-membros.png      # Tablet com painel C.I.A (Dobra 6)
    ├── mockup-feed.png         # Dois phones Amador vs Profissional (Dobra 3)
    ├── mockup-chat.png         # Phone com ChatGPT gerando carrossel (Dobra 4)
    ├── dep-1.jpg               # Foto do depoimento 1 (48×48)
    ├── dep-2.jpg               # Foto do depoimento 2 (48×48)
    ├── cia_001.webp            # Fallback do frame-scrub (qualquer frame)
    └── frames/                 # ⚠️ Frames da animação scrub (opcional)
        ├── cia_001.webp        # Frame 1 de 48
        ├── cia_002.webp
        └── …cia_048.webp
```

---

## 🚀 Como rodar

Não precisa de build, servidor Node ou instalação — é HTML/CSS/JS puro.

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/cia-landing.git
cd cia-landing

# Abra no browser (qualquer método funciona)
open index.html

# Ou com live-server (recomendado para dev)
npx live-server
```

> **Obs.:** A fonte (Google Fonts) e as bibliotecas (GSAP, Lenis) são carregadas via CDN.  
> Requer conexão com a internet para renderizar corretamente.

---

## 📦 Dependências externas (CDN — sem instalação)

| Biblioteca | Versão | CDN |
|---|---|---|
| GSAP | 3.12.5 | cdnjs |
| ScrollTrigger | 3.12.5 | cdnjs |
| Lenis | 1.0.42 | jsdelivr |
| Anton (fonte) | — | Google Fonts |
| Inter (fonte) | — | Google Fonts |

---

## 🖼 Assets obrigatórios

Todos os assets abaixo devem estar em `assets/` antes de subir:

| Arquivo | Descrição | Dimensões recomendadas |
|---|---|---|
| `hero-wide.jpg` | Fundo do hero | 1920 × 1080 px |
| `demo-poster.png` | Thumbnail do vídeo demo | 380 × 675 px (9:16) |
| `mockup-membros.png` | Mockup tablet C.I.A | 1536 × 1024 px |
| `mockup-feed.png` | Comparação de perfis | 1536 × 1024 px |
| `mockup-chat.png` | ChatGPT gerando carrossel | 1024 × 1536 px |
| `dep-1.jpg` | Foto depoimento 1 | 48 × 48 px |
| `dep-2.jpg` | Foto depoimento 2 | 48 × 48 px |
| `cia_001.webp` | Fallback do scrub | qualquer |

---

## 🎬 Animação frame-scrub (opcional)

A seção "O Método" pode exibir uma animação scrub de 48 frames.  
Se os frames não forem fornecidos, é exibido o fallback (`cia_001.webp`).

Para ativar: adicione `assets/frames/cia_001.webp` até `cia_048.webp`.

---

## 🛒 Link de compra

O CTA principal aponta para:  
`https://pay.kiwify.com.br/lRRpH6F`

Para alterar, busque por `KIWIFY_URL` em `main.js` ou por `kiwify` em `index.html`.

---

## 📱 Suporte

| Recurso | Desktop | Mobile |
|---|---|---|
| Animações GSAP | ✅ Completo | ✅ Simplificado |
| Parallax de mouse | ✅ | ❌ Desligado |
| Botões magnéticos | ✅ | ❌ Desligado |
| Nichos horizontal scroll | ✅ | ❌ Vira fluxo vertical |
| Partículas | ✅ 80pts | ✅ 24pts |
| Backdrop-filter | ✅ | ❌ Desligado (perf) |

---

© 2026 C.I.A — Conteúdo Infinito com IA
