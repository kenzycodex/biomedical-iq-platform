import { createTheme, ThemeOptions } from '@mui/material/styles';

const tailwindColors = {
  current: "currentColor",
  transparent: "transparent",
  white: "#FFFFFF",
  black: "#1C2434",
  red: "#FB5454",
  "black-2": "#010101",
  body: "#64748B",
  bodydark: "#AEB7C0",
  bodydark1: "#DEE4EE",
  bodydark2: "#8A99AF",
  primary: "#3C50E0",
  secondary: "#80CAEE",
  stroke: "#E2E8F0",
  gray: "#EFF4FB",
  graydark: "#333A48",
  "gray-2": "#F7F9FC",
  "gray-3": "#FAFAFA",
  whiten: "#F1F5F9",
  whiter: "#F5F7FD",
  boxdark: "#24303F",
  "boxdark-2": "#1A222C",
  strokedark: "#2E3A47",
  "form-strokedark": "#3d4d60",
  "form-input": "#1d2a39",
  "meta-1": "#DC3545",
  "meta-2": "#EFF2F7",
  "meta-3": "#10B981",
  "meta-4": "#313D4A",
  "meta-5": "#259AE6",
  "meta-6": "#FFBA00",
  "meta-7": "#FF6766",
  "meta-8": "#F0950C",
  "meta-9": "#E5E7EB",
  "meta-10": "#0FADCF",
  success: "#219653",
  danger: "#D34053",
  warning: "#FFA70B",
};

const customTheme: ThemeOptions = {
  palette: {
    primary: {
      main: tailwindColors.primary,
    },
    secondary: {
      main: tailwindColors.secondary,
    },
    error: {
      main: tailwindColors.danger,
    },
    warning: {
      main: tailwindColors.warning,
    },
    success: {
      main: tailwindColors.success,
    },
    text: {
      primary: tailwindColors.body,
      secondary: tailwindColors.bodydark,
    },
    background: {
      default: tailwindColors.whiter,
      paper: tailwindColors.white,
    },
  },
  typography: {
    fontFamily: 'Satoshi, sans-serif',
    h1: {
      fontSize: '2.75rem',
      lineHeight: 1.25,
    },
    h2: {
      fontSize: '2.25rem',
      lineHeight: 1.25,
    },
    h3: {
      fontSize: '1.75rem',
      lineHeight: 1.25,
    },
    h4: {
      fontSize: '1.5rem',
      lineHeight: 1.25,
    },
    h5: {
      fontSize: '1.25rem',
      lineHeight: 1.25,
    },
    h6: {
      fontSize: '1rem',
      lineHeight: 1.25,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.375rem',
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '0.375rem',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12)',
        },
      },
    },
  },
};

export const theme = createTheme(customTheme);