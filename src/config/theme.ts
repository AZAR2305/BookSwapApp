import { MD3LightTheme, MD3DarkTheme, type MD3Theme } from 'react-native-paper';
import type { Theme as NavigationTheme } from '@react-navigation/native';

const palette = {
  white: '#FFFFFF',
  paper: '#F7F7F5',
  cement100: '#ECECEA',
  cement200: '#DADAD6',
  stone: '#85857E',
  charcoal: '#222222',
  ink: '#121212',
  success: '#1A7F37',
  danger: '#B42318',
};

export const appColors = palette;

export const paperLightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: palette.charcoal,
    onPrimary: palette.white,
    background: palette.white,
    surface: palette.paper,
    onSurface: palette.ink,
    outline: palette.cement200,
    error: palette.danger,
  },
};

export const paperDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#F0F0EC',
    onPrimary: '#151513',
    background: '#111111',
    surface: '#1A1A18',
    surfaceVariant: '#20201D',
    onSurface: '#F3F3F2',
    onSurfaceVariant: '#C0C0BA',
    outline: '#42423E',
    outlineVariant: '#2E2E2B',
    secondaryContainer: '#252521',
    onSecondaryContainer: '#F4F4F1',
  },
};

export const navigationLightTheme: NavigationTheme = {
  dark: false,
  colors: {
    primary: palette.charcoal,
    background: palette.white,
    card: palette.white,
    text: palette.ink,
    border: palette.cement200,
    notification: palette.charcoal,
  },
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700',
    },
    heavy: {
      fontFamily: 'System',
      fontWeight: '800',
    },
  },
};

export const navigationDarkTheme: NavigationTheme = {
  ...navigationLightTheme,
  dark: true,
  colors: {
    ...navigationLightTheme.colors,
    background: '#111111',
    card: '#181818',
    text: '#F3F3F2',
    border: '#32322E',
    notification: '#F3F3F2',
  },
};

export const getScreenColors = (isDarkMode: boolean) =>
  isDarkMode
    ? {
        background: '#111111',
        surface: '#1A1A18',
        card: '#1B1B19',
        border: '#33332F',
        text: '#F4F4F1',
        muted: '#B4B4AD',
        soft: '#252521',
        button: '#F0F0EC',
        buttonText: '#151513',
        input: '#1A1A18',
        inputBorder: '#3A3A36',
      }
    : {
        background: palette.white,
        surface: palette.paper,
        card: palette.white,
        border: palette.cement200,
        text: palette.ink,
        muted: palette.stone,
        soft: palette.cement100,
        button: palette.charcoal,
        buttonText: palette.white,
        input: palette.white,
        inputBorder: palette.cement200,
      };
