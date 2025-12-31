"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FullscreenModal } from "@/components/fullscreen-modal"
import { useLanguage } from "@/contexts/language-context"
import { Type } from "lucide-react"

interface TextPreviewModalProps {
  color: string
  colorName: string
}

export function TextPreviewModal({ color, colorName }: TextPreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { language } = useLanguage()

  const backgrounds = [
    { name: language === "jp" ? "白" : "White", value: "#ffffff" },
    { name: language === "jp" ? "薄いグレー" : "Light Gray", value: "#f3f4f6" },
    { name: language === "jp" ? "グレー" : "Gray", value: "#9ca3af" },
    { name: language === "jp" ? "ダークグレー" : "Dark Gray", value: "#4b5563" },
    { name: language === "jp" ? "黒" : "Black", value: "#000000" },
  ]

  const fontSizes = [
    { name: language === "jp" ? "小 (12px)" : "Small (12px)", value: "12px" },
    { name: language === "jp" ? "通常 (16px)" : "Normal (16px)", value: "16px" },
    { name: language === "jp" ? "中 (20px)" : "Medium (20px)", value: "20px" },
    { name: language === "jp" ? "大 (24px)" : "Large (24px)", value: "24px" },
    { name: language === "jp" ? "特大 (32px)" : "Extra Large (32px)", value: "32px" },
  ]

  // コントラスト比を計算する関数
  const calculateContrastRatio = (color1: string, color2: string) => {
    // 簡易的なコントラスト比計算（実際にはもっと複雑な計算が必要）
    const getLuminance = (hex: string) => {
      const rgb = Number.parseInt(hex.slice(1), 16)
      const r = (rgb >> 16) & 0xff
      const g = (rgb >> 8) & 0xff
      const b = (rgb >> 0) & 0xff
      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
      return luminance
    }

    const l1 = getLuminance(color1)
    const l2 = getLuminance(color2)
    const ratio = l1 > l2 ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05)
    return ratio.toFixed(2)
  }

  // WCAGレベルを取得する関数
  const getWCAGLevel = (ratio: number) => {
    if (ratio >= 7) return "AAA"
    if (ratio >= 4.5) return "AA"
    if (ratio >= 3) return "A"
    return "Fail"
  }

  // WCAGレベルに応じた色を取得する関数
  const getLevelColor = (level: string) => {
    switch (level) {
      case "AAA":
        return "bg-green-100 text-green-800"
      case "AA":
        return "bg-blue-100 text-blue-800"
      case "A":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-red-100 text-red-800"
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="flex items-center gap-1">
        <Type className="h-4 w-4" />
        {language === "jp" ? "テキストプレビュー" : "Text Preview"}
      </Button>

      <FullscreenModal
        title={language === "jp" ? "テキストプレビュー" : "Text Preview"}
        description={
          language === "jp"
            ? "選択したカラーをテキストとして使用した場合のプレビュー"
            : "Preview of the selected color used as text"
        }
        open={isOpen}
        onOpenChange={setIsOpen}
        showFooter
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {backgrounds.map((bg) => (
              <div key={bg.value} className="p-4 rounded-md" style={{ backgroundColor: bg.value, color: color }}>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium" style={{ color: color }}>
                    {bg.name} {language === "jp" ? "背景" : "Background"}
                  </div>
                  <div className="flex gap-1">
                    {(() => {
                      const ratio = calculateContrastRatio(color, bg.value)
                      const level = getWCAGLevel(Number.parseFloat(ratio))
                      return (
                        <>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full ${getLevelColor(level)}`}
                            title={language === "jp" ? "アクセシビリティレベル" : "Accessibility Level"}
                          >
                            {level}
                          </span>
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-800"
                            title={language === "jp" ? "コントラスト比" : "Contrast Ratio"}
                          >
                            {ratio}:1
                          </span>
                        </>
                      )
                    })()}
                  </div>
                </div>

                {fontSizes.map((size) => (
                  <div key={size.value} className="mb-2" style={{ fontSize: size.value, color: color }}>
                    {language === "jp" ? `${colorName}は美しい色です。` : `${colorName} is a beautiful color.`}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
            <h3 className="text-sm font-medium mb-2">{language === "jp" ? "サンプルテキスト" : "Sample Text"}</h3>
            <div className="space-y-4" style={{ color: color }}>
              <p className="text-lg">
                {language === "jp"
                  ? "これはサンプルテキストです。このテキストは選択した色で表示されています。"
                  : "This is a sample text. This text is displayed in the selected color."}
              </p>
              <p>
                {language === "jp"
                  ? "ウェブデザインにおいて、色の選択は非常に重要です。適切な色を選ぶことで、ユーザーエクスペリエンスを向上させることができます。"
                  : "In web design, color selection is very important. By choosing the right colors, you can improve the user experience."}
              </p>
              <p className="text-sm">
                {language === "jp"
                  ? "小さいテキストでも読みやすさを確保することが重要です。コントラスト比が十分であることを確認してください。"
                  : "It's important to ensure readability even with small text. Make sure the contrast ratio is sufficient."}
              </p>
            </div>
          </div>
        </div>
      </FullscreenModal>
    </>
  )
}
