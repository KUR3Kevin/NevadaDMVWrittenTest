export const theme = {
  colors: {
    bg: '#09090B',
    surface: '#18181B',
    surfaceHi: '#27272A',
    border: '#3F3F46',
    text: '#FAFAFA',
    textDim: '#A1A1AA',
    textMute: '#52525B',
    accent: '#FF453A',
    success: '#30D158',
  },
  radius: { sm: 8, md: 14, lg: 20 },
  space: { xs: 4, sm: 8, md: 12, lg: 20, xl: 32 },
  font: { h1: 32, h2: 20, body: 14, small: 13 },
} as const;

export type Theme = typeof theme;
