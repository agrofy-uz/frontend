import { createTheme } from '@mantine/core';

const theme = createTheme({
  primaryShade: 6,
  primaryColor: 'green',
  fontFamily: 'Inter, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  activeClassName: 'active',
  headings: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  radius: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    xxl: '24px',
    xxxl: '50%',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
  },
  breakpoints: {
    xs: '375px',
    sm: '480px',
    md: '768px',
    lg: '1200px',
    xl: '1440px',
  },
  colors: {
    // Asosiy rang - Green Light
    green: [
      '#fafef5', // 25 - 0
      '#f3fee7', // 50 - 1
      '#e3fbcc', // 100 - 2
      '#d0f8ab', // 200 - 3
      '#a6ef67', // 300 - 4
      '#85e13a', // 400 - 5
      '#66c61c', // 500 - 6
      '#4ca30d', // 600 - 7
      '#3b7c0f', // 700 - 8
      '#326212', // 800 - 9
      '#2b5314', // 900 - 10
    ],
    // Gray Modern
    gray: [
      '#fcfcfd', // 25 - 0
      '#f8fafc', // 50 - 1
      '#eef2f6', // 100 - 2
      '#e3e8ef', // 200 - 3
      '#cdd5df', // 300 - 4
      '#9aa4b2', // 400 - 5
      '#697586', // 500 - 6
      '#4b5565', // 600 - 7
      '#364152', // 700 - 8
      '#202939', // 800 - 9
      '#121926', // 900 - 10
    ],
    // Error ranglari
    red: [
      '#fffbfa', // 25 - 0
      '#fef3f2', // 50 - 1
      '#fee4e2', // 100 - 2
      '#fecdca', // 200 - 3
      '#fda29b', // 300 - 4
      '#f97066', // 400 - 5
      '#f04438', // 500 - 6
      '#d92d20', // 600 - 7
      '#b42318', // 700 - 8
      '#912018', // 800 - 9
      '#7a271a', // 900 - 10
    ],
    // Warning ranglari
    yellow: [
      '#fffcf5', // 25 - 0
      '#fffaeb', // 50 - 1
      '#fef0c7', // 100 - 2
      '#fedf89', // 200 - 3
      '#fec84b', // 300 - 4
      '#fac515', // 400 - 5
      '#f79009', // 500 - 6
      '#dc6803', // 600 - 7
      '#b54708', // 700 - 8
      '#93370d', // 800 - 9
      '#7a2e0e', // 900 - 10
    ],
    // Success ranglari
    teal: [
      '#f6fef9', // 25 - 0
      '#ecfdf3', // 50 - 1
      '#d1fadf', // 100 - 2
      '#a6f4c5', // 200 - 3
      '#6ce9a6', // 300 - 4
      '#32d583', // 400 - 5
      '#12b76a', // 500 - 6
      '#039855', // 600 - 7
      '#027a48', // 700 - 8
      '#05603a', // 800 - 9
      '#054f31', // 900 - 10
    ],
    // Blue ranglari
    blue: [
      '#f5faff', // 25 - 0
      '#eff8ff', // 50 - 1
      '#d1e9ff', // 100 - 2
      '#b2ddff', // 200 - 3
      '#84caff', // 300 - 4
      '#53b1fd', // 400 - 5
      '#2e90fa', // 500 - 6
      '#1570ef', // 600 - 7
      '#175cd3', // 700 - 8
      '#1849a9', // 800 - 9
      '#194185', // 900 - 10
    ],
    // Indigo ranglari
    indigo: [
      '#f5f8ff', // 25 - 0
      '#eef4ff', // 50 - 1
      '#e0eaff', // 100 - 2
      '#c7d7fe', // 200 - 3
      '#a4bcfd', // 300 - 4
      '#8098f9', // 400 - 5
      '#6172f3', // 500 - 6
      '#444ce7', // 600 - 7
      '#3538cd', // 700 - 8
      '#2d31a6', // 800 - 9
      '#2d3282', // 900 - 10
    ],
    // Purple ranglari
    violet: [
      '#fafaff', // 25 - 0
      '#f4f3ff', // 50 - 1
      '#ebe9fe', // 100 - 2
      '#d9d6fe', // 200 - 3
      '#bdb4fe', // 300 - 4
      '#9b8afb', // 400 - 5
      '#7a5af8', // 500 - 6
      '#6938ef', // 600 - 7
      '#5925dc', // 700 - 8
      '#4a1fb8', // 800 - 9
      '#3e1c96', // 900 - 10
    ],
    // Pink ranglari
    pink: [
      '#fef6fb', // 25 - 0
      '#fdf2fa', // 50 - 1
      '#fce7f6', // 100 - 2
      '#fcceee', // 200 - 3
      '#faa7e0', // 300 - 4
      '#f670c7', // 400 - 5
      '#ee46bc', // 500 - 6
      '#dd2590', // 600 - 7
      '#c11574', // 700 - 8
      '#9e165f', // 800 - 9
      '#851651', // 900 - 10
    ],
    // Rose ranglari
    rose: [
      '#fff5f6', // 25 - 0
      '#fff1f3', // 50 - 1
      '#ffe4e8', // 100 - 2
      '#fecdd6', // 200 - 3
      '#fea3b4', // 300 - 4
      '#fd6f8e', // 400 - 5
      '#f63d68', // 500 - 6
      '#e31b54', // 600 - 7
      '#c01048', // 700 - 8
      '#a11043', // 800 - 9
      '#89123e', // 900 - 10
    ],
    // Orange ranglari
    orange: [
      '#fefaf5', // 25 - 0
      '#fef6ee', // 50 - 1
      '#fdead7', // 100 - 2
      '#f9dbaf', // 200 - 3
      '#f7b27a', // 300 - 4
      '#f38744', // 400 - 5
      '#ef6820', // 500 - 6
      '#e04f16', // 600 - 7
      '#b93815', // 700 - 8
      '#932f19', // 800 - 9
      '#772917', // 900 - 10
    ],
    // Dark mode uchun ranglar
    dark: [
      '#C1C2C5', // 0 - eng yorug'
      '#A6A7AB', // 1
      '#909296', // 2
      '#5c5f66', // 3
      '#373A40', // 4
      '#2C2E33', // 5
      '#25262b', // 6
      '#1A1B1E', // 7 - asosiy dark
      '#141517', // 8
      '#101113', // 9 - eng qora
      '#000000', // 10
    ],
  },
  other: {
    containerMaxWidth: 1172,
    // Qo'shimcha ranglar
    mainDark: '#1c1c1c',
    mainLightGreen: '#3ada05',
    mainRed: '#f30',
    mainWhite: '#fff',
    mainDarkGreen: '#2ca703',
    grey1: '#8f8f8f',
    grey2: '#a3a3a3',
    grey3: '#D0D5DD',
    grey4: '#f2f2f2',
    grey5: '#f7f7f7',
    gray6: '#475467',
    gray7: '#344054',
    gray8: '#1F2A37',
    gray9: '#101828',
    archaBayramYellow: '#facf61',
    archaBayramGreen: '#15d66e',
    archaBayramBlue: '#4daaf8',
    // Dark mode uchun qo'shimcha ranglar
    darkBg: '#1A1B1E',
    darkSurface: '#25262b',
    darkText: '#C1C2C5',
    darkTextSecondary: '#909296',
  },
  components: {
    Container: {
      defaultProps: {
        size: 'xl',
        maw: 1172,
      },
    },
    Button: {
      defaultProps: {
        fz: 14,
        fw: 500,
        bdrs: 'lg',
        h: 44,
      },
    },
  },
});

export default theme;
