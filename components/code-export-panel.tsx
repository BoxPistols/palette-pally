"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Code } from "lucide-react"
import {
  BaseModal,
  BaseModalContent,
  BaseModalHeader,
  BaseModalTitle,
  BaseModalDescription,
  BaseModalBody,
  BaseModalFooter,
  useModal,
} from "@/components/ui/base-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { useModalState } from "@/hooks/use-modal-state"
import type { ColorData } from "@/types/palette"
import {
  generateCSSVariables,
  generateSCSSVariables,
  generateTailwindConfig,
  generateMaterialTheme,
  generateStyledComponents,
  generateChakraTheme,
  generateCSSModule,
} from "@/lib/code-generators"

// コードプレビューコンポーネント（フルスクリーン対応）
function CodePreview({ code, onCopy, copyLabel }: { code: string; onCopy: () => void; copyLabel: string }) {
  const { isFullscreen } = useModal()

  return (
    <div className={`relative ${isFullscreen ? "h-full" : ""}`}>
      <pre className={`p-4 bg-gray-50 dark:bg-gray-800 rounded-md overflow-auto text-sm ${isFullscreen ? "h-full" : "max-h-[400px]"}`}>
        <code>{code}</code>
      </pre>
      <Button size="sm" className="absolute top-2 right-2" onClick={onCopy}>
        {copyLabel}
      </Button>
    </div>
  )
}

interface CodeExportPanelProps {
  colors: ColorData[]
  variations: Record<string, Record<string, string>>
  primaryColorIndex: number
}

export function CodeExportPanel({ colors, variations, primaryColorIndex }: CodeExportPanelProps) {
  const { language } = useLanguage()
  const { isOpen, open, close } = useModalState(false)
  const [activeTab, setActiveTab] = useState("css")

  // 翻訳テキスト
  const texts = {
    jp: {
      button: "コードエクスポート",
      title: "コードエクスポート",
      description: "カラーパレットをさまざまな形式でエクスポートします",
      css: "CSS変数",
      scss: "SCSS変数",
      tailwind: "Tailwind CSS",
      material: "Material UI",
      styled: "styled-components",
      chakra: "Chakra UI",
      cssModule: "CSS Modules",
      copy: "コピー",
      close: "閉じる",
      copySuccess: "コピーしました",
      copyError: "コピーに失敗しました",
    },
    en: {
      button: "Code Export",
      title: "Code Export",
      description: "Export your color palette in various formats",
      css: "CSS Variables",
      scss: "SCSS Variables",
      tailwind: "Tailwind CSS",
      material: "Material UI",
      styled: "styled-components",
      chakra: "Chakra UI",
      cssModule: "CSS Modules",
      copy: "Copy",
      close: "Close",
      copySuccess: "Copied to clipboard",
      copyError: "Failed to copy",
    },
  }

  const t = texts[language]

  // コードをクリップボードにコピー
  const copyToClipboard = (code: string) => {
    try {
      navigator.clipboard.writeText(code)
      toast({
        title: t.copySuccess,
        description: "",
      })
    } catch (error) {
      console.error("Copy error:", error)
      toast({
        title: t.copyError,
        description: "",
        variant: "destructive",
      })
    }
  }

  // 各形式のコードを生成
  const cssCode = generateCSSVariables(colors, variations, primaryColorIndex)
  const scssCode = generateSCSSVariables(colors, variations, primaryColorIndex)
  const tailwindCode = generateTailwindConfig(colors, variations, primaryColorIndex)
  const materialCode = generateMaterialTheme(colors, variations, primaryColorIndex)
  const styledCode = generateStyledComponents(colors, variations, primaryColorIndex)
  const chakraCode = generateChakraTheme(colors, variations, primaryColorIndex)
  const cssModuleCode = generateCSSModule(colors, variations, primaryColorIndex)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={open}
        title={t.button}
      >
        <Code className="h-4 w-4" />
        <span>{t.button}</span>
      </Button>

      <BaseModal open={isOpen} onOpenChange={close}>
        <BaseModalContent
          normalClassName="max-w-[800px] w-[90vw]"
          fullscreenClassName="fixed inset-4 max-w-none translate-x-0 translate-y-0 left-0 top-0 flex flex-col"
          className="flex flex-col"
        >
          <BaseModalHeader className="pb-4 border-b">
            <BaseModalTitle>{t.title}</BaseModalTitle>
            <BaseModalDescription>{t.description}</BaseModalDescription>
          </BaseModalHeader>

          <BaseModalBody maxHeight="60vh" className="flex-1 py-4 min-h-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col min-h-0">
              <TabsList className="flex w-full h-auto flex-wrap gap-1 mb-4">
                <TabsTrigger value="css" className="whitespace-nowrap">{t.css}</TabsTrigger>
                <TabsTrigger value="scss" className="whitespace-nowrap">{t.scss}</TabsTrigger>
                <TabsTrigger value="tailwind" className="whitespace-nowrap">{t.tailwind}</TabsTrigger>
                <TabsTrigger value="material" className="whitespace-nowrap">{t.material}</TabsTrigger>
                <TabsTrigger value="styled" className="whitespace-nowrap">{t.styled}</TabsTrigger>
                <TabsTrigger value="chakra" className="whitespace-nowrap">{t.chakra}</TabsTrigger>
                <TabsTrigger value="cssModule" className="whitespace-nowrap">{t.cssModule}</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-auto min-h-0">
                <TabsContent value="css" className="mt-0 p-0 h-full">
                  <CodePreview code={cssCode} onCopy={() => copyToClipboard(cssCode)} copyLabel={t.copy} />
                </TabsContent>

                <TabsContent value="scss" className="mt-0 p-0 h-full">
                  <CodePreview code={scssCode} onCopy={() => copyToClipboard(scssCode)} copyLabel={t.copy} />
                </TabsContent>

                <TabsContent value="tailwind" className="mt-0 p-0 h-full">
                  <CodePreview code={tailwindCode} onCopy={() => copyToClipboard(tailwindCode)} copyLabel={t.copy} />
                </TabsContent>

                <TabsContent value="material" className="mt-0 p-0 h-full">
                  <CodePreview code={materialCode} onCopy={() => copyToClipboard(materialCode)} copyLabel={t.copy} />
                </TabsContent>

                <TabsContent value="styled" className="mt-0 p-0 h-full">
                  <CodePreview code={styledCode} onCopy={() => copyToClipboard(styledCode)} copyLabel={t.copy} />
                </TabsContent>

                <TabsContent value="chakra" className="mt-0 p-0 h-full">
                  <CodePreview code={chakraCode} onCopy={() => copyToClipboard(chakraCode)} copyLabel={t.copy} />
                </TabsContent>

                <TabsContent value="cssModule" className="mt-0 p-0 h-full">
                  <CodePreview code={cssModuleCode} onCopy={() => copyToClipboard(cssModuleCode)} copyLabel={t.copy} />
                </TabsContent>
              </div>
            </Tabs>
          </BaseModalBody>

          <BaseModalFooter className="pt-4 border-t">
            <Button onClick={close}>{t.close}</Button>
          </BaseModalFooter>
        </BaseModalContent>
      </BaseModal>
    </>
  )
}
