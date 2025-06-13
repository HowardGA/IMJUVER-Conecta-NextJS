// src/styles/theme.ts
import { ThemeConfig } from 'antd';
import { AliasToken } from 'antd/es/theme/interface';


const createThemeTokens = (
  primary: string,
  info: string,
  bgBase: string,
  textBase: string,
  border: string,
  fillQuaternary: string,
) => {
  return {
    colorPrimary: primary,
    colorInfo: info,
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',

    // Base Colors (mapped directly from your palette)
    colorBgBase: bgBase, // Overall page background/component background
    colorTextBase: textBase, // Default text color
    colorBorder: border, // Default border color
    colorFillQuaternary: fillQuaternary, // Lighter fill for subtle backgrounds

    // Derived Neutral Colors (explicitly defined now, not magically generated)
    colorBgContainer: bgBase, // Content containers (cards, modals) - often same as bgBase for a flat look
    colorBgElevated: bgBase, // For popovers, dropdowns - often same as bgBase or slightly different
    colorBgLayout: bgBase, // For the main layout background - should match overall page background

    colorText: textBase, // Same as textBase
    colorTextSecondary: textBase, // You might want a slightly lighter/darker shade here. For now, same.
    colorTextTertiary: textBase, // Even lighter
    colorTextQuaternary: textBase, // Very faint

    colorBorderSecondary: border, // For dividers, weaker borders
    colorBorderTertiary: border,

    colorFill: fillQuaternary, // For active states, light fills
    colorFillSecondary: fillQuaternary, // Slightly less prominent fill
    colorFillTertiary: fillQuaternary, // Even less prominent fill

    // Specific component tokens (many more exist - add as needed)
    // Buttons (Example: Primary button colors will derive from primary, but others can be set)
    colorTextLightSolid: bgBase, // Text color on primary solid button (often white or light color)
    // If you want to define specific primary button hover/active colors
    colorPrimaryHover: primary, // Make primary hover the same as primary to avoid new shades
    colorPrimaryActive: primary, // Make primary active the same as primary to avoid new shades
    colorPrimaryText: textBase, // Text color of primary text button
  } as Partial<AliasToken>; 
};

// --- Light Theme Tokens ---
export const lightThemeTokens = createThemeTokens(
  '#961d48', // primary
  '#c8a163', // info
  '#fafafa', // bgBase
  '#333333', // textBase
  '#f2c6ab', // border
  '#f2c6ab', // fillQuaternary
);

// --- Dark Theme Tokens ---
export const darkThemeTokens = createThemeTokens(
  '#B03F6B', // primary
  '#E0B987', // info
  '#141414', // bgBase
  '#E0E0E0', // textBase
  '#404040', // border
  '#2C2C2C', // fillQuaternary
);

// --- Common Theme Configuration (applies to both light and dark) ---
export const commonThemeConfig: ThemeConfig = {
  components: {
    Button: {
      borderRadius: 8,
    },
    Card: {
      headerBg: 'var(--ant-color-fill-quaternary)', // Card header background
      // Other card tokens:
      // colorBgContainer: 'var(--ant-color-bg-container)', // Card body background
      // headerColor: 'var(--ant-color-text-base)', // Card header text color
    },
    Layout: {
      headerBg: 'var(--ant-color-bg-container)', // Header background matches container
      footerBg: 'var(--ant-color-primary)', // Footer background matches container
      // colorBgLayout: 'var(--ant-color-bg-layout)' // This is set by the global token now
    },
    Menu: {
      itemBg: 'transparent',
      subMenuItemBg: 'transparent',
      itemColor: 'var(--ant-color-text-base)',
      itemHoverColor: 'var(--ant-color-primary)', // Hover color from your primary
      itemSelectedColor: 'var(--ant-color-primary)', // Selected text color from your primary
      itemSelectedBg: 'transparent', // No background for selected item
      itemHoverBg: 'var(--ant-color-fill-quaternary)', // Subtle hover background from your fill

      // Dark Theme Menu specifics
      darkItemBg: 'transparent',
      darkSubMenuItemBg: 'transparent',
      darkItemColor: 'var(--ant-color-text-base)', // Uses base text color for dark menu items
      darkItemHoverColor: 'var(--ant-color-primary)',
      darkItemSelectedColor: 'var(--ant-color-primary)',
      darkItemSelectedBg: 'transparent',
      darkItemHoverBg: 'var(--ant-color-fill-quaternary)',
    },
    Typography: {
        // You might want titles to use primary color for example
        // colorPrimary: 'var(--ant-color-primary)', // If you want titles to automatically use primary
        // colorTextHeading: 'var(--ant-color-text-base)', // Default heading color
    },

  },
};