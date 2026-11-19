export const colors = {
  bg: '#ECE9E3',
  ink: '#141414',
  card: '#FEFEFE',
  muted: '#6B6862',
  fashion: '#FE693C',
  market: '#C7B5F4',
  info: '#BED2C0',
};

export const fonts = {
  regular: 'Montserrat_500Medium',
  semibold: 'Montserrat_600SemiBold',
  bold: 'Montserrat_700Bold',
  extra: 'Montserrat_800ExtraBold',
  black: 'Montserrat_900Black',
};

export type SectionKey = 'fashion' | 'market' | 'info';

export const sections: Record<
  SectionKey,
  { n: string; title: string; subtitle: string; href: '/fashion-week' | '/market' | '/info'; color: string }
> = {
  info: { n: '03', title: 'INFO', subtitle: 'CONTACTS · PARTNERS', href: '/info', color: colors.info },
  market: { n: '02', title: 'SALES', subtitle: 'SHOWROOMS · BRANDS', href: '/market', color: colors.market },
  fashion: {
    n: '01',
    title: 'FASHION WEEK',
    subtitle: 'FASHION WEEKS · RUNWAY · PRESENTATIONS · EVENTS · TRADE SHOWS',
    href: '/fashion-week',
    color: colors.fashion,
  },
};
