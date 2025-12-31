"use client"

import { useState, useRef, useEffect } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Figma, X, Upload, Maximize, Minimize, Copy } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/hooks/use-language"
import { useTheme } from "@/contexts/theme-context"
import type { ColorData } from "@/types/palette"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  extractColorsFromFigmaTokens,
  extractTypographyFromFigmaTokens,
  flattenTypographyData,
  convertColorsToFigmaTokens,
} from "@/lib/figma-token-parser"
import { TypographyPreview } from "@/components/typography-preview"
import {
  BaseModal,
  BaseModalContent,
  BaseModalHeader,
  BaseModalTitle,
  BaseModalDescription,
  BaseModalBody,
  BaseModalFooter,
} from "@/components/ui/base-modal"

interface FigmaTokensPanelProps {
  colors: ColorData[]
  variations?: Record<string, Record<string, string>>
  onImport: (colors: ColorData[]) => void
  onTypographyImport?: (typography: Record<string, any>) => void
}

export type ColorRole = "primary" | "secondary" | "success" | "danger" | "warning" | "info"

export function FigmaTokensPanel({ colors, variations, onImport, onTypographyImport }: FigmaTokensPanelProps) {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [jsonPreview, setJsonPreview] = useState<string>("")
  const [importJson, setImportJson] = useState<string>("")
  const [activeTab, setActiveTab] = useState("import")
  const [activeContentTab, setActiveContentTab] = useState("colors")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [colorGroups, setColorGroups] = useState<ColorData[]>([])
  const [typographyTokens, setTypographyTokens] = useState<Record<string, any>>({})
  const [schemaMode, setSchemaMode] = useState<"light" | "dark">(theme === "dark" ? "dark" : "light")
  const [parsedData, setParsedData] = useState<any>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [showTypographyPreview, setShowTypographyPreview] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [exportData, setExportData] = useState<any>({})
  const [isTypographyOnly, setIsTypographyOnly] = useState(false)
  const [showImportOptions, setShowImportOptions] = useState(false)

  // テーマが変更されたときにスキーマモードも更新
  useEffect(() => {
    setSchemaMode(theme === "dark" ? "dark" : "light")
  }, [theme])

  // 翻訳テキスト
  const texts = {
    jp: {
      button: "Figmaトークン",
      title: "Figmaデザイントークン",
      description: "Figmaのデザイントークン（カラー・タイポグラフィ）をエクスポート/インポートできます",
      exportTab: "エクスポート",
      importTab: "インポート",
      exportDescription: "以下のJSONをFigmaのデザイントークンマネージャーにインポートできます",
      importDescription: "Figmaからエクスポートしたデザイントークンを貼り付けてください",
      importPlaceholder: "JSONをここに貼り付け...",
      copyButton: "コピー",
      importButton: "インポート",
      closeButton: "閉じる",
      copySuccess: "JSONをクリップボードにコピーしました",
      copyError: "コピーに失敗しました",
      importSuccess: "デザイントークンをインポートしました",
      importError: "インポートに失敗しました。JSONの形式を確認してください",
      invalidJson: "無効なJSONです。形式を確認してください",
      emptyJson: "JSONが空です。有効なJSONを入力してください",
      downloadJson: "JSONをダウンロード",
      uploadJson: "JSONをアップロード",
      dropJsonHere: "JSONファイルをここにドロップ",
      orClickToUpload: "またはクリックしてアップロード",
      colorsTab: "カラー",
      typographyTab: "タイポグラフィ",
      lightMode: "ライトモード",
      darkMode: "ダークモード",
      noTypography: "タイポグラフィトークンがありません",
      fontFamily: "フォントファミリー",
      fontSize: "フォントサイズ",
      fontWeight: "フォントウェイト",
      lineHeight: "行の高さ",
      letterSpacing: "文字間隔",
      preview: "プレビュー",
      noColorTokens: "カラートークンがありません",
      fullscreen: "全画面表示",
      exitFullscreen: "全画面表示を終了",
      typographyOnly: "タイポグラフィデータのみが含まれています。デフォルトのカラーパレットを使用します。",
      importTypography: "タイポグラフィをインポート",
      importColors: "カラーをインポート",
      importBoth: "両方をインポート",
      previewTypography: "タイポグラフィをプレビュー",
      typographyImported: "タイポグラフィをインポートしました",
      jsonPreview: "JSONプレビュー",
      export: "エクスポート",
      close: "閉じる",
      exportingJson: "エクスポートされるJSONデータのプレビュー",
      importOptions: "インポートオプション",
      importOptionsDescription: "インポートするデータを選択してください",
    },
    en: {
      button: "Figma Tokens",
      title: "Figma Design Tokens",
      description: "Export and import design tokens (colors & typography) for Figma",
      exportTab: "Export",
      importTab: "Import",
      exportDescription: "You can import the following JSON into Figma Design Tokens Manager",
      importDescription: "Paste design tokens exported from Figma",
      importPlaceholder: "Paste JSON here...",
      copyButton: "Copy",
      importButton: "Import",
      closeButton: "Close",
      copySuccess: "JSON copied to clipboard",
      copyError: "Failed to copy",
      importSuccess: "Design tokens imported",
      importError: "Import failed. Please check the JSON format",
      invalidJson: "Invalid JSON. Please check the format",
      emptyJson: "JSON is empty. Please enter valid JSON",
      downloadJson: "Download JSON",
      uploadJson: "Upload JSON",
      dropJsonHere: "Drop JSON file here",
      orClickToUpload: "or click to upload",
      colorsTab: "Colors",
      typographyTab: "Typography",
      lightMode: "Light Mode",
      darkMode: "Dark Mode",
      noTypography: "No typography tokens available",
      fontFamily: "Font Family",
      fontSize: "Font Size",
      fontWeight: "Font Weight",
      lineHeight: "Line Height",
      letterSpacing: "Letter Spacing",
      preview: "Preview",
      noColorTokens: "No color tokens available",
      fullscreen: "Fullscreen",
      exitFullscreen: "Exit Fullscreen",
      typographyOnly: "Only typography data is included. Default color palette will be used.",
      importTypography: "Import Typography",
      importColors: "Import Colors",
      importBoth: "Import Both",
      previewTypography: "Preview Typography",
      typographyImported: "Typography imported",
      jsonPreview: "JSON Preview",
      export: "Export",
      close: "Close",
      exportingJson: "Preview of the JSON data to be exported",
      importOptions: "Import Options",
      importOptionsDescription: "Select what data to import",
    },
  }

  const t = texts[language]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        setImportJson(content)
        processJsonData(content)
      } catch (error) {
        console.error("Error reading file:", error)
        setImportError(language === "jp" ? "ファイルの読み込みに失敗しました" : "Failed to read file")
      }
    }

    reader.onerror = () => {
      setImportError(language === "jp" ? "ファイルの読み込みに失敗しました" : "Failed to read file")
    }

    reader.readAsText(file)
  }

  // JSONデータを処理する関数
  const processJsonData = (jsonString: string) => {
    try {
      // JSONの解析
      const data = JSON.parse(jsonString)
      setParsedData(data)
      setExportData(data)

      // タイポグラフィトークンの抽出
      const typography = extractTypographyFromFigmaTokens(data)
      const flatTypography = flattenTypographyData(typography)
      setTypographyTokens(flatTypography)

      // カラートークンの抽出
      const extractedColors = extractColorsFromFigmaTokens(data)
      setColorGroups(extractedColors)

      // タイポグラフィデータのみの場合は警告を表示
      if (extractedColors.length === 0 && Object.keys(flatTypography).length > 0) {
        setIsTypographyOnly(true)
        setActiveContentTab("typography")
        toast({
          title: t.typographyOnly,
          description: "",
        })
      } else if (extractedColors.length > 0 && Object.keys(flatTypography).length > 0) {
        // 両方のデータがある場合はインポートオプションを表示
        setShowImportOptions(true)
      } else {
        setIsTypographyOnly(false)
        setShowImportOptions(false)
      }

      setImportError(null)
    } catch (error) {
      console.error("Error processing JSON data:", error)
      setImportError(language === "jp" ? "JSONの処理に失敗しました" : "Failed to process JSON data")
    }
  }

  // ドラッグ&ドロップ処理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const files = e.dataTransfer.files
    if (!files || files.length === 0) return

    const file = files[0]

    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      setImportError(language === "jp" ? "JSONファイルのみ対応しています" : "Only JSON files are supported")
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        setImportJson(content)
        processJsonData(content)
      } catch (error) {
        console.error("Error reading file:", error)
        setImportError(language === "jp" ? "ファイルの読み込みに失敗しました" : "Failed to read file")
      }
    }

    reader.onerror = () => {
      setImportError(language === "jp" ? "ファイルの読み込みに失敗しました" : "Failed to read file")
    }

    reader.readAsText(file)
  }

  const handleImportJson = (importType?: "typography" | "colors" | "both") => {
    setImportError(null)

    // 入力が空かどうかチェック
    if (!importJson.trim()) {
      setImportError(t.emptyJson)
      return
    }

    try {
      if (!parsedData) {
        const data = JSON.parse(importJson)
        setParsedData(data)
      }

      // カラーデータの抽出
      const extractedColors = extractColorsFromFigmaTokens(parsedData || JSON.parse(importJson))

      // タイポグラフィデータの抽出
      const typography = extractTypographyFromFigmaTokens(parsedData || JSON.parse(importJson))
      const flatTypography = flattenTypographyData(typography)

      // インポートタイプに基づいて処理
      const importTypographyData =
        importType === "typography" || importType === "both" || (!importType && Object.keys(flatTypography).length > 0)
      const importColorData =
        importType === "colors" || importType === "both" || (!importType && extractedColors.length > 0)

      // タイポグラフィデータをコールバックで渡す
      if (importTypographyData && Object.keys(flatTypography).length > 0 && onTypographyImport) {
        onTypographyImport(flatTypography)
        toast({
          title: t.typographyImported,
          description: "",
        })
      }

      // カラーデータをコールバックで渡す
      if (importColorData && extractedColors.length > 0) {
        onImport(extractedColors)
        toast({
          title: t.importSuccess,
          description:
            language === "jp"
              ? `${extractedColors.length}色のパレットをインポートしました`
              : `Imported palette with ${extractedColors.length} colors`,
        })
      }

      // タイポグラフィデータのみの場合
      if (!importColorData && importTypographyData && Object.keys(flatTypography).length > 0) {
        // デフォルトのカラーパレットを使用
        if (colors.length === 0) {
          const defaultColors = [
            { name: "primary", value: "#3b82f6", role: "primary" },
            { name: "secondary", value: "#8b5cf6", role: "secondary" },
            { name: "success", value: "#22c55e", role: "success" },
            { name: "danger", value: "#ef4444", role: "danger" },
            { name: "warning", value: "#f59e0b", role: "warning" },
            { name: "info", value: "#06b6d4", role: "info" },
          ]
          onImport(defaultColors)
        }
      }

      setIsOpen(false)
      setShowImportOptions(false)
    } catch (error) {
      console.error("JSON parsing error:", error)
      setImportError(t.invalidJson)
    }
  }

  // カラーデータにバリエーションをマージする関数
  const getColorsWithVariations = () => {
    return colors.map((color) => {
      const colorVariations = variations?.[color.name]
      if (colorVariations) {
        return {
          ...color,
          variations: colorVariations,
        }
      }
      return color
    })
  }

  // JSONプレビューをクリップボードにコピー
  const handleCopyJson = async () => {
    try {
      const colorsWithVariations = getColorsWithVariations()
      const figmaTokens = convertColorsToFigmaTokens(colorsWithVariations)
      const jsonString = JSON.stringify(figmaTokens, null, 2)

      await navigator.clipboard.writeText(jsonString)

      toast({
        title: language === "jp" ? "コピー完了" : "Copied",
        description: language === "jp" ? "JSONをクリップボードにコピーしました" : "JSON copied to clipboard",
      })
    } catch (error) {
      console.error("Failed to copy JSON:", error)
      toast({
        title: language === "jp" ? "コピー失敗" : "Copy failed",
        description: language === "jp" ? "JSONのコピーに失敗しました" : "Failed to copy JSON",
        variant: "destructive",
      })
    }
  }

  const handleExport = () => {
    // カラーデータにバリエーションをマージ
    const colorsWithVariations = getColorsWithVariations()

    // 現在のカラーデータをFigmaトークン形式に変換
    const figmaTokens = convertColorsToFigmaTokens(colorsWithVariations)

    // タイムスタンプの生成
    const now = new Date()
    const timestamp = now.toISOString().slice(0, 10)

    // ファイル名の生成
    const filename = `figma-tokens-export-${timestamp}.json`

    const jsonString = JSON.stringify(figmaTokens, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // エクスポート成功メッセージ
    toast({
      title: language === "jp" ? "エクスポート完了" : "Export completed",
      description: language === "jp" ? `${filename}をダウンロードしました` : `Downloaded ${filename}`,
    })
  }

  const renderModalContent = () => {
    if (showImportOptions) {
      return (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{t.importOptions}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t.importOptionsDescription}</p>

          <div className="flex flex-col gap-3">
            <Button onClick={() => handleImportJson("both")} className="w-full">
              {t.importBoth}
            </Button>
            <Button onClick={() => handleImportJson("colors")} variant="outline" className="w-full">
              {t.importColors}
            </Button>
            <Button onClick={() => handleImportJson("typography")} variant="outline" className="w-full">
              {t.importTypography}
            </Button>
          </div>
        </div>
      )
    }

    return (
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="import">{t.importTab}</TabsTrigger>
            <TabsTrigger value="export">{t.exportTab}</TabsTrigger>
          </TabsList>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? t.exitFullscreen : t.fullscreen}
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>

        <TabsContent value="export">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t.exportDescription}</p>
          <div className="flex justify-end gap-2 mb-4">
            <Button variant="outline" onClick={() => setShowPreview(true)} className="mr-2">
              {language === "jp" ? "プレビュー" : "Preview"}
            </Button>
            <Button onClick={handleExport}>{t.copyButton}</Button>
          </div>
          <Tabs value={activeContentTab} onValueChange={setActiveContentTab}>
            <TabsList>
              <TabsTrigger value="colors">{t.colorsTab}</TabsTrigger>
              <TabsTrigger value="typography">{t.typographyTab}</TabsTrigger>
            </TabsList>
            <TabsContent value="colors">
              {colors.length === 0 ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">{t.noColorTokens}</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {colors.map((color) => (
                    <Card key={color.name}>
                      <CardHeader>
                        <CardTitle>{color.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full shadow-md" style={{ backgroundColor: color.value }} />
                          <span className="text-sm font-mono">{color.value}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="typography">
              {Object.keys(typographyTokens).length === 0 ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">{t.noTypography}</div>
              ) : (
                <>
                  <div className="flex justify-end mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTypographyPreview(true)}
                      className="flex items-center gap-1"
                    >
                      {t.previewTypography}
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Object.entries(typographyTokens).map(([name, token]) => (
                      <Card key={name}>
                        <CardHeader>
                          <CardTitle className="text-sm">{name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{t.fontFamily}:</span>
                              <p className="text-sm">
                                {token.$value?.fontFamily || token.fontFamily || "Not specified"}
                              </p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{t.fontSize}:</span>
                              <p className="text-sm">{token.$value?.fontSize || token.fontSize || "Not specified"}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{t.fontWeight}:</span>
                              <p className="text-sm">
                                {token.$value?.fontWeight || token.fontWeight || "Not specified"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="import">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t.importDescription}</p>

          <div
            className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md text-center mb-4"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input type="file" ref={fileInputRef} accept=".json" onChange={handleFileUpload} className="hidden" />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1">
              <Upload className="h-4 w-4" />
              {t.uploadJson}
            </Button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {t.dropJsonHere} {t.orClickToUpload}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <textarea
              placeholder={t.importPlaceholder}
              className="w-full h-48 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 p-3 resize-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
              value={importJson}
              onChange={(e) => {
                setImportJson(e.target.value)
                try {
                  if (e.target.value.trim()) {
                    processJsonData(e.target.value)
                  }
                } catch (error) {
                  console.error("Error processing JSON:", error)
                }
              }}
            />

            {importError && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>{importError}</AlertDescription>
              </Alert>
            )}

            <Button onClick={() => handleImportJson()}>{t.importButton}</Button>
          </div>
        </TabsContent>
      </Tabs>
    )
  }

  const processColorTokens = (tokens: any, prefix = ""): ColorData[] => {
    const colors: ColorData[] = []

    const processToken = (token: any, tokenName: string, parentPath = "", group = "") => {
      if (token.$type === "color" && token.$value) {
        // カラートークンの場合
        const colorName = prefix ? `${prefix}-${tokenName}` : tokenName
        const fullPath = parentPath ? `${parentPath}.${tokenName}` : tokenName

        // グループ名を決定（親パスの最初の部分を使用）
        const groupName = group || parentPath.split(".")[0] || ""

        // 特殊なパスの処理（text.primary, background.defaultなど）
        const isSpecialPath =
          parentPath.includes("text") || parentPath.includes("background") || parentPath.includes("common")

        colors.push({
          name: fullPath,
          value: token.$value,
          group: groupName,
          // text/background/commonの場合はロールを設定
          role:
            isSpecialPath && tokenName === "primary"
              ? "text"
              : isSpecialPath && tokenName === "default"
                ? "background"
                : undefined,
        })
      } else if (typeof token === "object" && !token.$type) {
        // ネストされたオブジェクトの場合は再帰的に処理
        const newParentPath = parentPath ? `${parentPath}.${tokenName}` : tokenName

        // main/dark/light/lighterの構造を持つかチェック
        const hasStandardStructure =
          token.main &&
          token.main.$type === "color" &&
          token.dark &&
          token.dark.$type === "color" &&
          token.light &&
          token.light.$type === "color" &&
          token.lighter &&
          token.lighter.$type === "color"

        if (hasStandardStructure) {
          // 標準構造を持つ場合はバリエーションとして処理
          const variations: Record<string, string> = {}
          Object.entries(token).forEach(([varName, varToken]: [string, any]) => {
            if (varToken.$type === "color" && varToken.$value) {
              variations[varName] = varToken.$value
            }
          })

          // ロールを決定
          let role: ColorRole | undefined = undefined
          if (tokenName === "primary") role = "primary"
          else if (tokenName === "secondary") role = "secondary"
          else if (tokenName === "success") role = "success"
          else if (tokenName === "error" || tokenName === "danger") role = "danger"
          else if (tokenName === "warning") role = "warning"
          else if (tokenName === "info") role = "info"

          colors.push({
            name: newParentPath,
            value: token.main.$value,
            variations,
            role,
            group: group || parentPath.split(".")[0] || "",
          })
        } else {
          // 標準構造を持たない場合は個別のカラーとして処理
          Object.entries(token).forEach(([subTokenName, subToken]: [string, any]) => {
            processToken(subToken, subTokenName, newParentPath, group || parentPath.split(".")[0] || "")
          })
        }
      }
    }

    // トークンを処理
    Object.entries(tokens).forEach(([tokenName, token]: [string, any]) => {
      processToken(token, tokenName)
    })

    return colors
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={() => setIsOpen(true)}
        title={t.button}
      >
        <Figma className="h-4 w-4" />
        <span>{t.button}</span>
      </Button>

      {isOpen && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isFullscreen ? "" : "bg-black/50"}`}>
          <div
            className={`bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden flex flex-col ${
              isFullscreen ? "fixed inset-0" : "w-[90vw] max-w-4xl max-h-[90vh]"
            }`}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">{t.title}</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 overflow-auto flex-1">{renderModalContent()}</div>
            <div className="p-4 border-t flex justify-end">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                {t.closeButton}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showTypographyPreview && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden flex flex-col w-[95vw] max-w-6xl max-h-[95vh]">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">{t.previewTypography}</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowTypographyPreview(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 overflow-auto flex-1">
              <TypographyPreview tokens={typographyTokens} />
            </div>
            <div className="p-4 border-t flex justify-end">
              <Button variant="outline" onClick={() => setShowTypographyPreview(false)}>
                {t.closeButton}
              </Button>
            </div>
          </div>
        </div>
      )}

      <BaseModal open={showPreview} onOpenChange={setShowPreview}>
        <BaseModalContent
          normalClassName="max-w-[800px] w-[90vw]"
          fullscreenClassName="fixed inset-4 max-w-none translate-x-0 translate-y-0 left-0 top-0 h-[calc(100vh-2rem)]"
          className="flex flex-col"
        >
          <BaseModalHeader className="pb-4 border-b">
            <BaseModalTitle>{language === "jp" ? "JSONプレビュー" : "JSON Preview"}</BaseModalTitle>
            <BaseModalDescription>
              {language === "jp"
                ? "エクスポートされるJSONデータのプレビュー"
                : "Preview of the JSON data to be exported"}
            </BaseModalDescription>
          </BaseModalHeader>

          <div className="flex justify-end items-center py-2">
            <Button variant="outline" size="sm" onClick={handleCopyJson} className="flex items-center gap-1">
              <Copy className="h-4 w-4" />
              {language === "jp" ? "コピー" : "Copy"}
            </Button>
          </div>

          <BaseModalBody maxHeight="60vh" className="flex-1 min-h-0">
            <pre className="text-xs font-mono whitespace-pre p-4 bg-gray-50 dark:bg-gray-800 rounded-md h-full overflow-auto">
              {JSON.stringify(convertColorsToFigmaTokens(getColorsWithVariations()), null, 2)}
            </pre>
          </BaseModalBody>

          <BaseModalFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              {language === "jp" ? "閉じる" : "Close"}
            </Button>
            <Button onClick={handleExport}>{language === "jp" ? "エクスポート" : "Export"}</Button>
          </BaseModalFooter>
        </BaseModalContent>
      </BaseModal>
    </>
  )
}
