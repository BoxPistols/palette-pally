export interface ColorData {
  name: string
  value: string // Light theme value (default)
  darkValue?: string // Dark theme value (if different from light)
  role?: ColorRole
  group?: string
  variations?: Record<string, string> // Light theme variations
  darkVariations?: Record<string, string> // Dark theme variations
}

export interface PaletteType {
  colors: ColorData[]
  variations?: Record<string, Record<string, string>>
  textColorSettings?: TextColorSettings
}

export type TextColorMode = "default" | "white" | "black"

export interface TextColorSettings {
  main: "default" | "white" | "black"
  dark: "default" | "white" | "black"
  light: "default" | "white" | "black"
  lighter: "default" | "white" | "black"
}

export const defaultTextColorSettings: TextColorSettings = {
  main: "default",
  dark: "default",
  light: "default",
  lighter: "default",
}

export type ColorRole =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "text"
  | "background"
  | "border"
  | "accent"
  | "neutral"
  | "custom"

export const colorRoleDescriptions: Record<ColorRole, string> = {
  primary: "メインカラー、ブランドを表す主要な色",
  secondary: "セカンダリカラー、アクセントとして使用",
  success: "成功状態を表す色（緑系）",
  danger: "エラーや危険を表す色（赤系）",
  warning: "警告を表す色（黄色系）",
  info: "情報を表す色（青系）",
  text: "テキストに使用する色",
  background: "背景に使用する色",
  border: "境界線に使用する色",
  accent: "アクセントとして使用する色",
  neutral: "中立的な色（グレー系）",
  custom: "カスタム用途の色",
}

export interface ColorPalette {
  primary: { main: string; light: string; dark: string; contrastText: string }
  secondary: { main: string; light: string; dark: string; contrastText: string }
  error: { main: string; light: string; dark: string; contrastText: string }
  warning: { main: string; light: string; dark: string; contrastText: string }
  info: { main: string; light: string; dark: string; contrastText: string }
  success: { main: string; light: string; dark: string; contrastText: string }
  grey: {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
  }
  text: {
    primary: string
    secondary: string
    disabled: string
  }
  background: {
    default: string
    paper: string
  }
  common: {
    black: string
    white: string
  }
}

export interface TypographyValue {
  fontFamily: string
  fontSize: string
  fontWeight: number
  letterSpacing: string
  lineHeight: string
  textTransform: string
  textDecoration: string
}

export interface TypographyToken {
  $type: string
  $value: TypographyValue
  $description?: string
}

export interface Typography {
  h1: TypographyValue
  h2: TypographyValue
  h3: TypographyValue
  h4: TypographyValue
  h5: TypographyValue
  h6: TypographyValue
  body1: TypographyValue
  body2: TypographyValue
  button: TypographyValue
  caption: TypographyValue
  overline: TypographyValue
}

export type Language = "jp" | "en"

export interface PaletteColor extends ColorData {
  contrastText?: string
  variations?: {
    main?: { value: string; contrastText: string }
    light?: { value: string; contrastText: string }
    lighter?: { value: string; contrastText: string }
    dark?: { value: string; contrastText: string }
  }
}
