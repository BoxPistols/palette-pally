"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BaseModal,
  BaseModalContent,
  BaseModalHeader,
  BaseModalTitle,
  BaseModalDescription,
  BaseModalBody,
  BaseModalFooter,
} from "@/components/ui/base-modal"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"
import type { PaletteType } from "@/types/palette"

// Define the missing types
type ColorMode = "light" | "dark" | "system" // Example ColorMode type
type ColorData = {
  name: string
  value: string
  role?: string
}

interface ExportImportPanelProps {
  data: PaletteType & { primaryColorIndex?: number }
  onImport: (
    importedData: PaletteType & {
      primaryColorIndex?: number
      colorMode?: ColorMode
      showTailwindClasses?: boolean
      showMaterialNames?: boolean
    },
  ) => void
}

export function ExportImportPanel({ data, onImport }: ExportImportPanelProps) {
  const { language } = useLanguage()
  const [error, setError] = useState<string | null>(null)
  const [jsonPreview, setJsonPreview] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 翻訳テキスト - 言語コンテキストが機能するまでの一時的な対応
  const texts = {
    jp: {
      exportButton: "JSONエクスポート",
      importButton: "JSONインポート",
      exportTitle: "JSONエクスポート",
      exportDescription: "以下のJSONデータをエクスポートします。",
      downloadButton: "ダウンロード",
      exportSuccess: "エクスポート完了",
      exportSuccessDesc: "JSONファイルのダウンロードを開始しました",
      importError: "インポートエラー",
      parseError: "JSONファイルの解析に失敗しました。正しいフォーマットか確認してください。",
      readError: "ファイルの読み込みに失敗しました。",
    },
    en: {
      exportButton: "Export JSON",
      importButton: "Import JSON",
      exportTitle: "Export JSON",
      exportDescription: "Export the following JSON data.",
      downloadButton: "Download",
      exportSuccess: "Export Complete",
      exportSuccessDesc: "JSON file download started",
      importError: "Import Error",
      parseError: "Failed to parse JSON file. Please check the format.",
      readError: "Failed to read file.",
    },
  }

  const t = texts[language || "jp"]

  const prepareExport = () => {
    try {
      const jsonString = JSON.stringify(data, null, 2)
      setJsonPreview(jsonString)
      setError(null)
      setIsDialogOpen(true)
    } catch (err) {
      setError(language === "jp" ? "エクスポート準備中にエラーが発生しました。" : "Error preparing export.")
      console.error("Export preparation error:", err)
    }
  }

  const handleExport = () => {
    try {
      // 現在の日本時間を取得（ローカル時間を使用）
      const now = new Date()
      const year = now.getFullYear().toString().slice(-2) // 年の下2桁
      const month = String(now.getMonth() + 1).padStart(2, "0")
      const day = String(now.getDate()).padStart(2, "0")
      const hours = String(now.getHours()).padStart(2, "0")
      const minutes = String(now.getMinutes()).padStart(2, "0")

      const timestamp = `${year}${month}${day}-${hours}${minutes}`
      const filename = `palette-pally-${timestamp}.json`

      const blob = new Blob([jsonPreview], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setError(null)
      setIsDialogOpen(false)

      toast({
        title: t.exportSuccess,
        description: t.exportSuccessDesc,
      })
    } catch (err) {
      setError(language === "jp" ? "エクスポート中にエラーが発生しました。" : "Error during export.")
      console.error("Export error:", err)
    }
  }

  const exportJSON = () => {
    handleExport()
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        if (typeof event.target?.result !== "string") {
          throw new Error(language === "jp" ? "ファイルの読み込みに失敗しました" : "Failed to read file")
        }

        const json = JSON.parse(event.target.result) as PaletteType & { primaryColorIndex?: number }
        handleImport(json)
        setError(null)

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } catch (err) {
        setError(t.parseError)
        console.error("Error parsing JSON:", err)

        toast({
          title: t.importError,
          description: t.parseError,
          variant: "destructive",
        })
      }
    }
    reader.onerror = () => {
      setError(t.readError)
      toast({
        title: t.importError,
        description: t.readError,
        variant: "destructive",
      })
    }
    reader.readAsText(file)
  }

  const handleImport = (
    importedData: PaletteType & {
      primaryColorIndex?: number
      colorMode?: ColorMode
      showTailwindClasses?: boolean
      showMaterialNames?: boolean
    },
  ) => {
    try {
      // Figmaトークン形式かどうかをチェック
      if (importedData.global && importedData.global.colors) {
        // Figmaトークン形式からカラーデータに変換
        const figmaColors = importedData.global.colors
        const extractedColors: ColorData[] = []

        Object.entries(figmaColors).forEach(([category, tokens]) => {
          if (category === "common") return // common.white/blackはスキップ

          // カテゴリ内の基本色のみを抽出（バリエーションはスキップ）
          Object.entries(tokens).forEach(([tokenName, token]: [string, any]) => {
            // バリエーション（例：primary-light）はスキップ
            if (tokenName.includes("-")) return

            if (token.$type === "color" && token.$value) {
              extractedColors.push({
                name: tokenName,
                value: token.$value,
                role: tokenName === "primary" ? "primary" : undefined,
              })
            }
          })
        })

        if (extractedColors.length > 0) {
          onImport({
            colors: extractedColors,
          })
          return
        }
      }

      // 通常のパレットデータ形式の処理
      if (importedData.colors && Array.isArray(importedData.colors)) {
        // Validate each color entry
        const validColors = importedData.colors.filter(
          (color) =>
            color &&
            typeof color === "object" &&
            "name" in color &&
            "value" in color &&
            typeof color.name === "string" &&
            typeof color.value === "string" &&
            /^#[0-9A-F]{6}$/i.test(color.value),
        )

        if (validColors.length > 0) {
          onImport({ colors: validColors })

          toast({
            title: t.importComplete,
            description:
              language === "jp"
                ? `${validColors.length}色のパレットをインポートしました`
                : `Imported palette with ${validColors.length} colors`,
          })
        } else {
          throw new Error(language === "jp" ? "有効なカラーデータが見つかりませんでした" : "No valid color data found")
        }
      } else {
        throw new Error(language === "jp" ? "カラーデータが見つかりませんでした" : "No color data found")
      }
    } catch (error) {
      console.error("Import error:", error)
      toast({
        title: t.importError,
        description:
          error instanceof Error
            ? error.message
            : language === "jp"
              ? "不明なエラーが発生しました"
              : "Unknown error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 justify-center">
        <Button onClick={prepareExport} variant="default" size="sm">
          {t.exportButton}
        </Button>

        <BaseModal open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <BaseModalContent
            normalClassName="sm:max-w-md"
            fullscreenClassName="fixed inset-4 max-w-none translate-x-0 translate-y-0 left-0 top-0 flex flex-col"
            className="flex flex-col"
          >
            <BaseModalHeader>
              <BaseModalTitle>{t.exportTitle}</BaseModalTitle>
              <BaseModalDescription>{t.exportDescription}</BaseModalDescription>
            </BaseModalHeader>
            <BaseModalBody maxHeight="300px" className="py-4">
              <div className="overflow-auto bg-gray-50 dark:bg-gray-800 p-2 rounded text-xs font-mono h-full">
                <pre>{jsonPreview}</pre>
              </div>
            </BaseModalBody>
            <BaseModalFooter>
              <Button onClick={exportJSON} type="submit">
                {t.downloadButton}
              </Button>
            </BaseModalFooter>
          </BaseModalContent>
        </BaseModal>

        <div className="relative">
          <Button variant="outline" size="sm" className="relative">
            {t.importButton}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
