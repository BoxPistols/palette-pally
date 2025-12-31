"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tag, ArrowRight, GripVertical, ChevronUp, ChevronDown } from "lucide-react"
import {
  BaseModal,
  BaseModalContent,
  BaseModalHeader,
  BaseModalTitle,
  BaseModalDescription,
  BaseModalBody,
  BaseModalFooter,
} from "@/components/ui/base-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { useLanguage } from "@/contexts/language-context"
import type { ColorData, ColorRole } from "@/types/palette"
import { colorRoleDescriptions } from "@/types/palette"

interface ColorRoleSettingsProps {
  colors: ColorData[]
  onUpdateColors: (colors: ColorData[]) => void
}

export function ColorRoleSettings({ colors, onUpdateColors }: ColorRoleSettingsProps) {
  const { language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [colorRoles, setColorRoles] = useState<Record<string, ColorRole>>({})
  const [orderedColors, setOrderedColors] = useState<ColorData[]>([])

  // 翻訳テキスト
  const texts = {
    jp: {
      button: "カラーロール",
      title: "カラーロール設定",
      description: "各カラーに役割を割り当て、順序を変更できます。これによりデザインシステムの一貫性が向上します。",
      hint: "ヒント: カラーをドラッグするか矢印ボタンで順序を変更できます。役割を割り当てることで一貫したデザインシステムを作成できます。プライマリカラーはブランドを表し、成功、危険、警告などの他の色は特定のアクションに使用されます。",
      cancel: "キャンセル",
      apply: "適用",
      roleUpdated: "カラーロール設定を更新しました",
      roleUpdatedDesc: "カラーの役割と順序が更新されました",
    },
    en: {
      button: "Color Roles",
      title: "Color Role Settings",
      description: "Assign roles to each color and change their order to improve design system consistency.",
      hint: "Tip: Drag colors or use arrow buttons to change order. Assigning roles creates a consistent design system. Primary color represents your brand, while success, danger, warning, etc. are used for specific actions.",
      cancel: "Cancel",
      apply: "Apply",
      roleUpdated: "Color role settings updated",
      roleUpdatedDesc: "Color roles and order have been updated",
    },
  }

  const t = texts[language]

  // 日本語のロール名を取得
  const getRoleDisplayName = (role: ColorRole): string => {
    if (language === "jp") {
      switch (role) {
        case "primary":
          return "プライマリ"
        case "secondary":
          return "セカンダリ"
        case "success":
          return "成功"
        case "danger":
          return "危険"
        case "warning":
          return "警告"
        case "info":
          return "情報"
        case "text":
          return "テキスト"
        case "background":
          return "背景"
        case "border":
          return "境界線"
        case "accent":
          return "アクセント"
        case "neutral":
          return "ニュートラル"
        case "custom":
          return "カスタム"
        default:
          return role
      }
    }
    // 英語の場合はそのまま返す（先頭を大文字に）
    return role.charAt(0).toUpperCase() + role.slice(1)
  }

  // 日本語のロール説明を取得
  const getRoleDescription = (role: ColorRole): string => {
    if (language === "jp") {
      return colorRoleDescriptions[role]
    }

    // 英語の場合
    const englishDescriptions: Record<ColorRole, string> = {
      primary: "Main color, represents the brand",
      secondary: "Secondary color, used as an accent",
      success: "Indicates success state (green)",
      danger: "Indicates error or danger (red)",
      warning: "Indicates warning (yellow)",
      info: "Indicates information (blue)",
      text: "Used for text",
      background: "Used for backgrounds",
      border: "Used for borders",
      accent: "Used as an accent color",
      neutral: "Neutral color (gray)",
      custom: "Custom purpose color",
    }

    return englishDescriptions[role]
  }

  // Initialize state when dialog opens
  useEffect(() => {
    if (isOpen) {
      const roles: Record<string, ColorRole> = {}
      colors.forEach((color) => {
        roles[color.name] = color.role || "custom"
      })
      setColorRoles(roles)
      setOrderedColors([...colors])
    }
  }, [isOpen, colors])

  const handleRoleChange = (colorName: string, role: ColorRole) => {
    setColorRoles((prev) => ({
      ...prev,
      [colorName]: role,
    }))
  }

  const handleApply = () => {
    // Apply roles to the ordered colors
    const updatedColors = orderedColors.map((color) => ({
      ...color,
      role: colorRoles[color.name] || "custom",
    }))

    onUpdateColors(updatedColors)
    setIsOpen(false)

    toast({
      title: t.roleUpdated,
      description: t.roleUpdatedDesc,
    })
  }

  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    if (result.destination.index === result.source.index) return

    const items = Array.from(orderedColors)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setOrderedColors(items)
  }

  // 上下矢印ボタンでの並べ替え
  const moveItem = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === orderedColors.length - 1)) {
      return // 端の場合は何もしない
    }

    const newIndex = direction === "up" ? index - 1 : index + 1
    const newItems = [...orderedColors]
    const [removed] = newItems.splice(index, 1)
    newItems.splice(newIndex, 0, removed)
    setOrderedColors(newItems)
  }

  // 使用可能なロールのリスト
  const availableRoles: ColorRole[] = [
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
    "text",
    "background",
    "border",
    "accent",
    "neutral",
    "custom",
  ]

  // Get role badge class
  const getRoleBadgeClass = (role: ColorRole): string => {
    switch (role) {
      case "primary":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "secondary":
        return "bg-purple-100 text-purple-800 border-purple-300"
      case "success":
        return "bg-green-100 text-green-800 border-green-300"
      case "danger":
        return "bg-red-100 text-red-800 border-red-300"
      case "warning":
        return "bg-amber-100 text-amber-800 border-amber-300"
      case "info":
        return "bg-sky-100 text-sky-800 border-sky-300"
      case "text":
        return "bg-gray-100 text-gray-800 border-gray-300"
      case "background":
        return "bg-slate-100 text-slate-800 border-slate-300"
      case "border":
        return "bg-zinc-100 text-zinc-800 border-zinc-300"
      case "accent":
        return "bg-pink-100 text-pink-800 border-pink-300"
      case "neutral":
        return "bg-stone-100 text-stone-800 border-stone-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1 whitespace-nowrap"
        onClick={() => setIsOpen(true)}
        title={t.button}
      >
        <Tag className="h-4 w-4" />
        <span>{t.button}</span>
      </Button>

      <BaseModal open={isOpen} onOpenChange={setIsOpen}>
        <BaseModalContent
          normalClassName="max-w-[700px] w-[90vw]"
          fullscreenClassName="fixed inset-4 max-w-none translate-x-0 translate-y-0 left-0 top-0 flex flex-col"
          className="flex flex-col"
        >
          <BaseModalHeader className="pb-4 border-b">
            <BaseModalTitle>{t.title}</BaseModalTitle>
            <BaseModalDescription>{t.description}</BaseModalDescription>
          </BaseModalHeader>

          <BaseModalBody maxHeight="60vh" className="flex-1 py-4 space-y-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>{language === "jp" ? "ヒント:" : "Tip:"}</strong> {t.hint}
              </p>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="color-roles">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                    {orderedColors.map((color, index) => (
                      <Draggable key={color.name} draggableId={color.name} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center gap-3 p-3 border rounded-md bg-white hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-1">
                              <div {...provided.dragHandleProps} className="cursor-move">
                                <GripVertical className="h-5 w-5 text-gray-400" />
                              </div>
                              <div className="flex flex-col">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-1"
                                  onClick={() => moveItem(index, "up")}
                                  disabled={index === 0}
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-1"
                                  onClick={() => moveItem(index, "down")}
                                  disabled={index === orderedColors.length - 1}
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div
                              className="w-10 h-10 rounded-md border border-gray-200 flex-shrink-0"
                              style={{ backgroundColor: color.value }}
                            />

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{color.name}</p>
                              <p className="text-xs text-gray-500 truncate">{color.value}</p>
                            </div>

                            <ArrowRight className="h-5 w-5 text-gray-400 mx-2" />

                            <div className="w-[220px]">
                              <Select
                                value={colorRoles[color.name] || "custom"}
                                onValueChange={(value) => handleRoleChange(color.name, value as ColorRole)}
                              >
                                <SelectTrigger
                                  className={`w-full ${getRoleBadgeClass(colorRoles[color.name] || "custom")}`}
                                >
                                  <SelectValue placeholder={language === "jp" ? "役割を選択" : "Select role"} />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableRoles.map((role) => (
                                    <SelectItem key={role} value={role}>
                                      <div className="flex flex-col">
                                        <span className="capitalize">{getRoleDisplayName(role)}</span>
                                        <span className="text-xs text-gray-500 truncate">
                                          {getRoleDescription(role)}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </BaseModalBody>

          <BaseModalFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              {t.cancel}
            </Button>
            <Button onClick={handleApply}>{t.apply}</Button>
          </BaseModalFooter>
        </BaseModalContent>
      </BaseModal>
    </>
  )
}
