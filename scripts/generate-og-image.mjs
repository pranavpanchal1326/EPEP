import sharp from 'sharp'

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#F8F7F4"/>
  <rect x="60" y="60" width="1080" height="510" rx="32" fill="#FFFFFF" stroke="#E8E4DC" stroke-width="4"/>
  <text x="120" y="240" font-family="Georgia, serif" font-size="64" font-weight="700" fill="#1A1814">EPEP</text>
  <text x="120" y="320" font-family="Arial, sans-serif" font-size="36" font-weight="600" fill="#2D5A3D">Election Process Education Platform</text>
  <text x="120" y="400" font-family="Arial, sans-serif" font-size="26" fill="#6B6560">Maps • EVM Simulator • Education • Quiz • Dashboard • AI Assistant</text>
</svg>
`.trim()

await sharp(Buffer.from(svg)).png().toFile('public/og-image.png')
console.log('Generated public/og-image.png')

