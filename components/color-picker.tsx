"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { HexColorPicker } from "react-colorful"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GripVertical } from "lucide-react"
import {
  hexToRgb,
  rgbToHex,
  hexToHsl,
  hslToHex,
  hexToOklab,
  oklabToHex,
  calculateContrastRatio,
  getWCAGLevel,
  getBetterContrastColor,
} from "@/lib/color-utils"
import { ColorSuggestions } from "@/components/color-suggestions"
import { Badge } from "@/components/ui/badge"
import type { ColorRole } from "@/types/palette"
import { colorRoleDescriptions } from "@/types/palette"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getRoleBadgeClass, getRoleDisplayName, getGroupBadgeClass } from "@/lib/color-role-styles"

// サジェストボタンの翻訳対応
// const SuggestButton = ({ baseColor, onSelectColor }: { baseColor: string; onSelectColor: (color: string) => void }) => {
//   const { language } = useLanguage()

//   return (
//     <Button
//       variant="ghost"
//       size="sm"
//       className="h-8 px-2 text-xs"
//       onClick={() => onSelectColor(getBetterContrastColor(baseColor))}
//     >
//       <Lightbulb className="h-3.5 w-3.5 mr-1" />
//       {language === "jp" ? "サジェスト" : "Suggest"}
//     </Button>
//   )
// }

// サジェストボタンの代わりにA11yInfoコンポーネントを追加
const getContrastInfo = (bgColor: string, colorRole: ColorRole | undefined, theme: string) => {
  const isBackgroundRole = colorRole === "background"

  // 背景色ロールの場合と通常の場合で処理を分ける
  if (isBackgroundRole) {
    // 背景色ロールの場合は、黒と白のテキストに対するコントラスト比を計算
    const whiteContrast = calculateContrastRatio(bgColor, "#FFFFFF")
    const blackContrast = calculateContrastRatio(bgColor, "#000000")
    const bestContrast = Math.max(whiteContrast, blackContrast)
    const bestContrastColor = getBetterContrastColor(bgColor)
    const wcagLevel = getWCAGLevel(bestContrast)

    return {
      contrast: bestContrast,
      level: wcagLevel.level,
      textColor: bestContrastColor,
      isBackground: true,
    }
  } else {
    // 通常のカラーの場合は、現在のテーマの背景色に対するコントラスト比を計算
    const themeBgColor = theme === "dark" ? "#1e1e1e" : "#ffffff" // テーマに応じた背景色
    const colorOnThemeBgContrast = calculateContrastRatio(themeBgColor, bgColor)
    const wcagLevel = getWCAGLevel(colorOnThemeBgContrast)

    return {
      contrast: colorOnThemeBgContrast,
      level: wcagLevel.level,
      textColor: themeBgColor,
      isBackground: false,
    }
  }
}

// A11yInfo関数を修正
const A11yInfo = ({ color, colorRole }: { color: string; colorRole: ColorRole | undefined }) => {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const isBackgroundRole = colorRole === "background"

  // 背景色としての評価
  const blackOnColorContrast = calculateContrastRatio(color, "#000000")
  const whiteOnColorContrast = calculateContrastRatio(color, "#ffffff")
  const bgTextColor = whiteOnColorContrast > blackOnColorContrast ? "#ffffff" : "#000000"
  const bgContrast = Math.max(blackOnColorContrast, whiteOnColorContrast)
  const bgLevel = getWCAGLevel(bgContrast)

  // テキスト色としての評価（背景色ロールでない場合のみ）
  const themeBgColor = theme === "dark" ? "#1e1e1e" : "#ffffff"
  const colorOnThemeBgContrast = calculateContrastRatio(themeBgColor, color)
  const textLevel = getWCAGLevel(colorOnThemeBgContrast)

  // レベルに応じたバッジの色を設定
  const getBadgeColor = (level: string) => {
    return level === "AAA"
      ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
      : level === "AA"
        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
        : level === "A"
          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
          : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center">
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${getBadgeColor(bgLevel.level)}`}
                style={{ color: bgTextColor, backgroundColor: color }}
              >
                {bgLevel.level}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>
              {language === "jp" ? "背景色として使用: " : "As background: "} {bgContrast.toFixed(1)}:1
            </p>
          </TooltipContent>
        </Tooltip>

        {!isBackgroundRole && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${getBadgeColor(textLevel.level)}`}
                  style={{ color: color, backgroundColor: themeBgColor }}
                >
                  {textLevel.level}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>
                {language === "jp" ? "テキスト色として使用: " : "As text: "} {colorOnThemeBgContrast.toFixed(1)}:1
              </p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  )
}

interface ColorPickerProps {
  index: number
  name: string
  color: string
  darkColor?: string // ダークモード用の色
  isPrimary?: boolean
  onColorChange: (color: string) => void
  onDarkColorChange?: (color: string) => void // ダークモード用の色変更
  onNameChange: (name: string) => void
  onSetAsPrimary?: () => void
  dragHandleProps?: any
  colorRole?: ColorRole
}

// HexColorPickerコンポーネントをラップして、マウスイベントの伝播を停止させる部分を追加
const handlePickerMouseDown = (e: React.MouseEvent) => {
  // カラーピッカー操作中はドラッグイベントが親に伝播しないようにする
  e.stopPropagation()
}

export function ColorPicker({
  index,
  name,
  color,
  darkColor,
  isPrimary = false,
  onColorChange,
  onDarkColorChange,
  onNameChange,
  onSetAsPrimary,
  dragHandleProps,
  colorRole,
}: ColorPickerProps) {
  const { language } = useLanguage()
  const { theme } = useTheme()

  // 現在のテーマに応じた表示色を決定
  const isDarkMode = theme === "dark"
  const displayColor = isDarkMode ? (darkColor || color) : color
  const handleCurrentColorChange = isDarkMode ? (onDarkColorChange || onColorChange) : onColorChange

  const [inputValue, setInputValue] = useState(displayColor)
  const [nameValue, setNameValue] = useState(name)
  const [rgbValues, setRgbValues] = useState({ r: 0, g: 0, b: 0 })
  const [hslValues, setHslValues] = useState({ h: 0, s: 0, l: 0 })
  const [oklabValues, setOklabValues] = useState({ l: 0, a: 0, b: 0 })

  useEffect(() => {
    setInputValue(displayColor)
    updateColorValues(displayColor)
  }, [displayColor])

  useEffect(() => {
    setNameValue(name)
  }, [name])

  const updateColorValues = (hexColor: string) => {
    const rgb = hexToRgb(hexColor)
    if (rgb) {
      setRgbValues(rgb)
    }

    const hsl = hexToHsl(hexColor)
    if (hsl) {
      setHslValues(hsl)
    }

    const oklab = hexToOklab(hexColor)
    if (oklab) {
      setOklabValues(oklab)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    // Validate hex color
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      handleCurrentColorChange(value)
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNameValue(value)
    onNameChange(value)
  }

  const handlePickerChange = (newColor: string) => {
    setInputValue(newColor)
    handleCurrentColorChange(newColor)
  }

  const handleRgbChange = (channel: "r" | "g" | "b", value: string) => {
    const numValue = Number.parseInt(value)
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 255) {
      const newRgb = { ...rgbValues, [channel]: numValue }
      const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b)
      setRgbValues(newRgb)
      setInputValue(newHex)
      handleCurrentColorChange(newHex)
    }
  }

  const handleHslChange = (channel: "h" | "s" | "l", value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue)) {
      // Apply appropriate limits based on the channel
      let validValue = numValue
      if (channel === "h") {
        validValue = Math.max(0, Math.min(360, numValue))
      } else {
        validValue = Math.max(0, Math.min(100, numValue))
      }

      const newHsl = { ...hslValues, [channel]: validValue }
      const newHex = hslToHex(newHsl.h, newHsl.s, newHsl.l)
      setHslValues(newHsl)
      setInputValue(newHex)
      handleCurrentColorChange(newHex)
    }
  }

  const handleOklabChange = (channel: "l" | "a" | "b", value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue)) {
      // Apply appropriate limits based on the channel
      let validValue = numValue
      if (channel === "l") {
        // Lightness in Oklab is typically between 0 and 1
        validValue = Math.max(0, Math.min(1, numValue))
      } else if (channel === "a" || channel === "b") {
        // a and b channels can be negative or positive, typically between -0.4 and 0.4
        validValue = Math.max(-0.4, Math.min(0.4, numValue))
      }

      const newOklab = { ...oklabValues, [channel]: validValue }
      try {
        const newHex = oklabToHex(newOklab.l, newOklab.a, newOklab.b)
        setOklabValues(newOklab)
        setInputValue(newHex)
        handleCurrentColorChange(newHex)
      } catch (error) {
        console.error("Error converting Oklab to hex:", error)
      }
    }
  }

  const handleBlur = () => {
    // Ensure color is valid on blur
    if (!/^#[0-9A-F]{6}$/i.test(inputValue)) {
      setInputValue(displayColor)
    }
  }

  return (
    <Card
      className={`overflow-hidden flex-shrink-0 w-[300px] ${isPrimary ? "ring-1 ring-gray-300 dark:ring-gray-700" : ""}`}
    >
      <CardHeader className="pb-2 px-3 pt-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="cursor-move" {...dragHandleProps}>
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            value={nameValue}
            onChange={handleNameChange}
            className="font-medium text-sm h-8"
            placeholder={`color${index + 1}`}
            autoComplete="off"
            data-lpignore="true"
            data-1p-ignore="true"
          />
        </div>
        <div className="flex gap-1">
          {isPrimary && (
            <Badge variant="outline" className="ml-2 bg-gray-50 text-gray-500">
              Primary
            </Badge>
          )}
          {colorRole && colorRole !== "primary" && (
            <Badge
              variant="outline"
              className={`ml-2 ${getRoleBadgeClass(colorRole)}`}
              title={colorRoleDescriptions[colorRole]}
            >
              {getRoleDisplayName(colorRole)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-3 space-y-2">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="text-sm h-8"
            placeholder="カラーコード"
            autoComplete="off"
            data-lpignore="true"
            data-1p-ignore="true"
          />
        </div>

        <div onMouseDown={handlePickerMouseDown}>
          <HexColorPicker color={displayColor} onChange={handlePickerChange} className="w-full" />
        </div>

        {/* テーマ表示インジケーター */}
        <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 py-1">
          {isDarkMode ? "🌙 ダークモード編集中" : "☀️ ライトモード編集中"}
        </div>

        <div className="flex justify-between items-center mt-1 mb-1">
          <ColorSuggestions baseColor={displayColor} onSelectColor={handleCurrentColorChange} />
          {(() => {
            const { contrast, level } = getContrastInfo(displayColor, colorRole, theme)

            // レベルに応じたバッジの色を設定
            const levelColor =
              level === "AAA"
                ? "bg-green-100 text-green-800"
                : level === "AA"
                  ? "bg-blue-100 text-blue-800"
                  : level === "A"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"

            return (
              <>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${levelColor}`}
                  title={
                    language === "jp"
                      ? `${colorRole === "background" ? "背景色" : "テキスト色"}としてのアクセシビリティレベル`
                      : `Accessibility level as ${colorRole === "background" ? "background" : "text"} color`
                  }
                >
                  {level}
                </span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                  title={language === "jp" ? "コントラスト比" : "Contrast ratio"}
                >
                  {contrast.toFixed(1)}:1
                </span>
                <A11yInfo color={displayColor} colorRole={colorRole} />
              </>
            )
          })()}
        </div>

        <Tabs defaultValue="rgb" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="rgb">RGB</TabsTrigger>
            <TabsTrigger value="hsl">HSL</TabsTrigger>
            <TabsTrigger value="oklab">Oklab</TabsTrigger>
          </TabsList>

          <TabsContent value="rgb" className="mt-2">
            <div className="grid grid-cols-3 gap-1">
              <div>
                <label className="text-xs text-gray-500 block">R</label>
                <Input
                  type="number"
                  min="0"
                  max="255"
                  value={rgbValues.r}
                  onChange={(e) => handleRgbChange("r", e.target.value)}
                  className="text-xs h-7"
                  autoComplete="off"
                  data-lpignore="true"
                  data-1p-ignore="true"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block">G</label>
                <Input
                  type="number"
                  min="0"
                  max="255"
                  value={rgbValues.g}
                  onChange={(e) => handleRgbChange("g", e.target.value)}
                  className="text-xs h-7"
                  autoComplete="off"
                  data-lpignore="true"
                  data-1p-ignore="true"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block">B</label>
                <Input
                  type="number"
                  min="0"
                  max="255"
                  value={rgbValues.b}
                  onChange={(e) => handleRgbChange("b", e.target.value)}
                  className="text-xs h-7"
                  autoComplete="off"
                  data-lpignore="true"
                  data-1p-ignore="true"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hsl" className="mt-2">
            <div className="grid grid-cols-3 gap-1">
              <div>
                <label className="text-xs text-gray-500 block">H</label>
                <Input
                  type="number"
                  min="0"
                  max="360"
                  value={Math.round(hslValues.h)}
                  onChange={(e) => handleHslChange("h", e.target.value)}
                  className="text-xs h-7"
                  autoComplete="off"
                  data-lpignore="true"
                  data-1p-ignore="true"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block">S (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={Math.round(hslValues.s)}
                  onChange={(e) => handleHslChange("s", e.target.value)}
                  className="text-xs h-7"
                  autoComplete="off"
                  data-lpignore="true"
                  data-1p-ignore="true"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block">L (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={Math.round(hslValues.l)}
                  onChange={(e) => handleHslChange("l", e.target.value)}
                  className="text-xs h-7"
                  autoComplete="off"
                  data-lpignore="true"
                  data-1p-ignore="true"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="oklab" className="mt-2">
            <div className="grid grid-cols-3 gap-1">
              <div>
                <label className="text-xs text-gray-500 block">L</label>
                <Input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={oklabValues.l.toFixed(2)}
                  onChange={(e) => handleOklabChange("l", e.target.value)}
                  className="text-xs h-7"
                  autoComplete="off"
                  data-lpignore="true"
                  data-1p-ignore="true"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block">a</label>
                <Input
                  type="number"
                  min="-0.4"
                  max="0.4"
                  step="0.01"
                  value={oklabValues.a.toFixed(2)}
                  onChange={(e) => handleOklabChange("a", e.target.value)}
                  className="text-xs h-7"
                  autoComplete="off"
                  data-lpignore="true"
                  data-1p-ignore="true"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block">b</label>
                <Input
                  type="number"
                  min="-0.4"
                  max="0.4"
                  step="0.01"
                  value={oklabValues.b.toFixed(2)}
                  onChange={(e) => handleOklabChange("b", e.target.value)}
                  className="text-xs h-7"
                  autoComplete="off"
                  data-lpignore="true"
                  data-1p-ignore="true"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
