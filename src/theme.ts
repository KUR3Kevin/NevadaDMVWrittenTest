export const theme = {
  colors: {
    bg: '#09090B',
    surface: '#18181B',
    surfaceHi: '#27272A',
    border: '#3F3F46',
    text: '#FAFAFA',
    textDim: '#A1A1AA',
    textMute: '#9A9AA3',
    accent: '#FF453A',
    success: '#30D158',
  },
  radius: { sm: 8, md: 14, lg: 20 },
  space: { xs: 4, sm: 8, md: 12, lg: 20, xl: 32 },
  font: { h1: 32, h2: 22, body: 17, small: 15 },
  tap: 52,
} as const;

export type Theme = typeof theme;
