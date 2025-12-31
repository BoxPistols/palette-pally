"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GripVertical } from "lucide-react"
import type { ColorRole } from "@/types/palette"
import { colorRoleDescriptions } from "@/types/palette"
import { getRoleBadgeClass, getRoleDisplayName, getGroupBadgeClass } from "@/lib/color-role-styles"
import { useTheme } from "@/contexts/theme-context"

interface SimpleColorPickerProps {
  index: number
  name: string
  color: string
  darkColor?: string // ダークモード用の色
  isPrimary?: boolean
  onColorChange: (color: string) => void
  onDarkColorChange?: (color: string) => void // ダークモード用の色変更
  onNameChange: (name: string) => void
  dragHandleProps?: any
  colorRole?: ColorRole
  group?: string
}

export function SimpleColorPicker({
  index,
  name,
  color = "#ffffff", // デフォルト値を設定
  darkColor,
  isPrimary = false,
  onColorChange,
  onDarkColorChange,
  onNameChange,
  dragHandleProps,
  colorRole,
  group,
}: SimpleColorPickerProps) {
  const { theme } = useTheme()

  // 現在のテーマに応じた表示色を決定
  const isDarkMode = theme === "dark"
  const displayColor = isDarkMode ? (darkColor || color) : color
  const handleCurrentColorChange = isDarkMode ? (onDarkColorChange || onColorChange) : onColorChange

  // ローカルの状態を追加して、propsの変更を追跡
  const [localColor, setLocalColor] = useState(displayColor || "#ffffff")
  const [localName, setLocalName] = useState(name || `color${index + 1}`)

  // propsが変更されたらローカルの状態を更新
  useEffect(() => {
    if (displayColor) {
      setLocalColor(displayColor)
    }
    if (name) {
      setLocalName(name)
    }
  }, [displayColor, name, index])

  // 名前変更ハンドラ
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setLocalName(newName)
    onNameChange(newName)
  }

  // 色変更ハンドラ（テーマに応じて適切なハンドラーを呼び出す）
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setLocalColor(newColor)
    handleCurrentColorChange(newColor)
  }

  // グループの表示名を取得
  const getGroupDisplayName = (groupName?: string): string => {
    if (!groupName) return ""
    return groupName.charAt(0).toUpperCase() + groupName.slice(1)
  }

  return (
    <Card className={`overflow-hidden flex-shrink-0 ${isPrimary ? "ring-1 ring-gray-300 dark:ring-gray-700" : ""}`}>
      <CardHeader className="pb-2 px-3 pt-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="cursor-move" {...dragHandleProps}>
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            value={localName}
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
          {group && !colorRole && (
            <Badge variant="outline" className={`ml-2 ${getGroupBadgeClass(group)}`}>
              {getGroupDisplayName(group)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-3 space-y-2">
        <div className="flex gap-2 items-center">
          <div className="w-8 h-8 rounded-md" style={{ backgroundColor: localColor }}></div>
          <NonIntrusiveInput
            value={localColor}
            onChange={handleColorChange}
            className="text-sm h-8"
            placeholder="カラーコード"
          />
          <NonIntrusiveInput
            type="color"
            value={localColor}
            onChange={handleColorChange}
            className="w-8 h-8 p-0 border-0"
          />
        </div>
        {/* テーマ表示インジケーター */}
        <div className="flex items-center justify-center text-[10px] text-gray-400 dark:text-gray-500">
          {isDarkMode ? "🌙 Dark" : "☀️ Light"}
        </div>
      </CardContent>
    </Card>
  )
}
