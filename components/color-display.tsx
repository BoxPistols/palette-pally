"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { isLightColor, calculateContrastRatio, getWCAGLevel } from "@/lib/color-utils"
import { AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { findClosestTailwindColor, findClosestMaterialColor } from "@/lib/color-systems"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import type { TextColorSettings, ColorRole } from "@/types/palette"
import type { ColorMode } from "@/lib/color-systems"
import { RoleColorSettings } from "./role-color-settings"
import { getRoleBadgeClass, getRoleDisplayName, getGroupBadgeClass } from "@/lib/color-role-styles"

interface ColorDisplayProps {
  colorKey: string
  variations: Record<string, string>
  darkVariations?: Record<string, string> // ダークモード用バリエーション
  textColorSettings: TextColorSettings
  isPrimary?: boolean
  colorMode: ColorMode
  showTailwindClasses: boolean
  showMaterialNames: boolean
  colorRole?: ColorRole
  group?: string
  customVariations?: Record<string, string>
  customDarkVariations?: Record<string, string> // ダークモード用カスタムバリエーション
  disableVariationGeneration?: boolean
  color?: any // TODO: Define type
  onColorChange?: (updatedColor: any) => void // TODO: Define type
  onNameChange?: (name: string) => void
}

export function ColorDisplay({
  colorKey,
  variations,
  darkVariations,
  textColorSettings,
  isPrimary = false,
  colorMode,
  showTailwindClasses,
  showMaterialNames,
  colorRole,
  group,
  customVariations,
  customDarkVariations,
  disableVariationGeneration = false,
  color,
  onColorChange,
  onNameChange,
}: ColorDisplayProps) {
  const { language } = useLanguage()
  const { theme } = useTheme()

  // カラーロールの表示名を取得
  const getLocalizedRoleDisplayName = (role?: ColorRole): string => {
    return getRoleDisplayName(role)
  }

  // グループの表示名を取得
  const getGroupDisplayName = (groupName?: string): string => {
    if (!groupName) return ""

    // 常に英語名をそのまま返す（日本語変換なし）
    if (groupName.startsWith("figma-")) {
      return "Figma " + groupName.substring(6).charAt(0).toUpperCase() + groupName.substring(6).slice(1)
    }
    return groupName.charAt(0).toUpperCase() + groupName.slice(1)
  }

  // ネストされたパスを表示用に整形
  const formatColorKey = (key: string): string => {
    // スラッシュで区切られたパスの場合
    if (key.includes("/")) {
      return key
    }
    return key
  }

  // getVariationName関数を修正します
  const getVariationName = (name: string): string => {
    // 常に英語名を返す（日本語変換なし）
    return name
  }

  // テーマに応じたバリエーションを選択
  const isDarkMode = theme === "dark"

  // Light mode: カスタムバリエーションがある場合はそれを使用し、なければ通常のバリエーションを使用
  const lightDisplayVariations = customVariations || variations

  // Dark mode: カスタムダークバリエーション > ダークバリエーション > ライトバリエーション（フォールバック）
  const darkDisplayVariations = customDarkVariations || darkVariations || lightDisplayVariations

  // 現在のテーマに基づいてバリエーションを選択
  const displayVariations = isDarkMode ? darkDisplayVariations : lightDisplayVariations

  // バリエーション生成を無効にする場合は、mainのみを表示
  const finalVariations =
    disableVariationGeneration && Object.keys(displayVariations).length > 1
      ? { main: displayVariations.main || Object.values(displayVariations)[0] }
      : displayVariations

  // カスタムバリエーションがある場合は、それに基づいて表示を変更
  const hasCustomVariations = !!customVariations
  const isCompactView =
    (group && !hasCustomVariations) ||
    disableVariationGeneration ||
    !Object.keys(finalVariations).includes("main") ||
    !Object.keys(finalVariations).includes("dark") ||
    !Object.keys(finalVariations).includes("light") ||
    !Object.keys(finalVariations).includes("lighter")

  return (
    <Card className={`overflow-hidden ${isPrimary ? "ring-1 ring-gray-300 dark:ring-gray-700" : ""}`}>
      <CardHeader className="pb-2 px-3 pt-2 flex flex-col">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <RoleColorSettings color={color} onChange={(updatedColor) => onColorChange?.(updatedColor)} />
            </div>
          </div>
          <CardTitle className="text-sm">
            {colorRole ? getRoleDisplayName(colorRole) : formatColorKey(colorKey)}
          </CardTitle>
          <div className="flex flex-wrap gap-1">
            {isPrimary && (
              <Badge variant="outline" className="bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                Primary
              </Badge>
            )}
            {colorRole && colorRole !== "primary" && (
              <Badge variant="outline" className={getRoleBadgeClass(colorRole)}>
                {getRoleDisplayName(colorRole)}
              </Badge>
            )}
            {group && !colorRole && (
              <Badge variant="outline" className={getGroupBadgeClass(group)}>
                {getGroupDisplayName(group)}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isCompactView ? (
          // コンパクトビュー（グループ化されたカラー）
          <div
            className="flex items-center justify-between p-2 border-t first:border-t-0 dark:border-gray-700 min-h-[40px]"
            style={{ backgroundColor: Object.values(finalVariations)[0] }}
          >
            <div className="flex items-center gap-1">
              <div
                style={{ color: isLightColor(Object.values(finalVariations)[0]) ? "#000000" : "#FFFFFF" }}
                className="text-xs font-medium"
              >
                {colorKey}: {Object.values(finalVariations)[0]}
              </div>
            </div>
          </div>
        ) : (
          // 標準ビュー（main, dark, light, lighter, contrastText）
          Object.entries(finalVariations).map(([name, color]) => {
            // 無効なカラー値をスキップ
            if (!color || typeof color !== "string" || !/^#[0-9A-F]{6}$/i.test(color)) {
              return null
            }

            // 通常の自動テキスト色判定
            const isLight = isLightColor(color)

            // テキストカラー設定に基づいてテキスト色を決定
            const textColorMode = textColorSettings[name as keyof TextColorSettings] || "default"
            let textColor: string

            switch (textColorMode) {
              case "white":
                textColor = "#FFFFFF"
                break
              case "black":
                textColor = "#000000"
                break
              default: // "default"
                textColor = isLight ? "#000000" : "#FFFFFF"
                break
            }

            // contrastTextの場合は特別な処理
            if (name === "contrastText") {
              textColor = isLight ? "#000000" : "#FFFFFF"
            }

            // コントラスト比の計算
            const contrast = calculateContrastRatio(color, textColor)
            const wcagLevel = getWCAGLevel(contrast)

            // 警告表示の条件：強制カラーモード（defaultでない）かつAAレベルに達していない場合
            const showWarning = textColorMode !== "default" && wcagLevel.level !== "AAA" && wcagLevel.level !== "AA"

            // レベルに応じたバッジの色を設定
            const levelColor =
              wcagLevel.level === "AAA"
                ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                : wcagLevel.level === "AA"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                  : wcagLevel.level === "A"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"

            // Tailwindの最も近い色を取得
            const closestTailwind = findClosestTailwindColor(color)

            // Material Designの最も近い色を取得
            const closestMaterial = findClosestMaterialColor(color)

            return (
              <div
                key={name}
                className="flex items-center justify-between p-2 border-t first:border-t-0 dark:border-gray-700"
                style={{ backgroundColor: color }}
              >
                <div className="flex items-center gap-1">
                  <div style={{ color: textColor }} className="text-xs font-medium">
                    {getVariationName(name)}: {color}
                    {/* カラーモードに応じた追加情報 */}
                    {colorMode === "tailwind" && showTailwindClasses && (
                      <span className="ml-1 opacity-80">
                        (bg-{closestTailwind.color}-{closestTailwind.shade})
                      </span>
                    )}
                    {colorMode === "material" && showMaterialNames && (
                      <span className="ml-1 opacity-80">
                        ({closestMaterial.color} {closestMaterial.shade})
                      </span>
                    )}
                  </div>
                  {showWarning && (
                    <AlertTriangle
                      size={14}
                      className="text-red-500 dark:text-red-400"
                      title={
                        language === "jp" ? "コントラスト比が低すぎます（AA未満）" : "Contrast ratio too low (below AA)"
                      }
                    />
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${levelColor} opacity-80`}
                    title={`${language === "jp" ? "コントラスト比" : "Contrast ratio"}: ${contrast.toFixed(2)}:1`}
                  >
                    {wcagLevel.level}
                  </span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 opacity-80"
                    title={`${language === "jp" ? "コントラスト比" : "Contrast ratio"}: ${contrast.toFixed(2)}:1`}
                  >
                    {contrast.toFixed(1)}:1
                  </span>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
