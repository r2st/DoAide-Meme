# DoAide Meme — Free Meme Generator

Create, customize, and share memes instantly. No login required.

**Live at:** [meme.doaide.com](https://meme.doaide.com)

## Features

- 50+ meme templates with categories
- Drag-and-drop text boxes with full customization
- Font, size, color, outline, shadow, opacity controls
- Image upload for custom backgrounds
- Image filters (brightness, contrast, grayscale, sepia, blur)
- Emoji sticker overlays
- Download as PNG or JPG
- Share to WhatsApp, Twitter, or via native share
- Recent memes saved in localStorage
- Mobile responsive

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Konva / react-konva (canvas rendering)
- react-router-dom

## Development

```bash
npm install
npm run dev
```

Dev server runs at `http://172.18.0.1:3052`

## Build

```bash
npm run build
```

Output in `dist/`

## Deployment

```bash
# Build
npm run build

# Copy to server
rsync -avz dist/ deploy@89.167.8.178:/opt/doaide-meme/dist/

# Install service
sudo cp doaide-meme-web.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now doaide-meme-web
```

Served at `172.18.0.1:3052`, proxied via Caddy to `meme.doaide.com`.

## Port

| Service | Port |
|---------|------|
| Web     | 3052 |
