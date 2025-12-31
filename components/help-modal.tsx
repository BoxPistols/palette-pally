"use client"

import {
  BaseModal,
  BaseModalContent,
  BaseModalHeader,
  BaseModalTitle,
  BaseModalDescription,
  BaseModalBody,
  BaseModalFooter,
} from "@/components/ui/base-modal"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  HelpCircle,
  Palette,
  Sliders,
  Save,
  FileJson,
  Contrast,
  Type,
  Lightbulb,
  Wand2,
  Tag,
  Eye,
  Code,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useModalState } from "@/hooks/use-modal-state"

// 2. 言語に応じたテキストを選択する処理を追加
// const { language } = useLanguage() // Moved inside component

// 3. 英語と日本語のテキストを定義
const texts = {
  jp: {
    title: "Palette Pally の使い方",
    description: "カラーパレットの作成・管理・アクセシビリティチェックを簡単に行えるツールです",
    tabs: {
      basic: "基本機能",
      accessibility: "アクセシビリティ",
      advanced: "高度な機能",
      colorTheory: "色彩理論",
      faq: "よくある質問",
    },
    basic: {
      title: "基本機能",
      colorPicker: {
        title: "Color Picker",
        description:
          "左側のパネルでカラーを選択・編集できます。カラー名を変更したり、HEX、RGB、HSL、Oklabの値を直接入力することも可能です。",
      },
      colorRoles: {
        title: "Color Roles",
        description:
          "各カラーに役割（プライマリ、セカンダリ、成功、警告など）を割り当てることができます。これにより、デザインシステムの一貫性が向上します。",
      },
      colorCount: {
        title: "カラー数の調整",
        description: "画面上部の「カラー数」入力欄で、パレットに含めるカラーの数を1〜24の間で調整できます。",
      },
      saveReset: {
        title: "保存とリセット",
        description:
          "「保存」ボタンでパレットをブラウザのLocalStorageに保存できます。「リセット」ボタンでデフォルトのカラーに戻せます。",
      },
      colorPalette: {
        title: "Color Palette",
        description:
          "右側のパネルには、各カラーの4つのバリエーション（main、dark、light、lighter）が表示されます。これらは自動的に生成され、コントラスト比とアクセシビリティレベルも確認できます。",
      },
    },
    accessibility: {
      title: "アクセシビリティ",
      contrastRatio: {
        title: "Contrast Ratio と WCAG レベル",
        description:
          "各カラーのコントラスト比とWCAGアクセシビリティレベル（AAA、AA、A、Fail）が表示されます。\n• AAA（7.0:1以上）: 最高レベルのアクセシビリティ\n• AA（4.5:1以上）: 標準的なアクセシビリティ要件\n• A（3.0:1以上）: 最低限のアクセシビリティ要件\n• Fail（3.0:1未満）: アクセシビリティ要件を満たさない",
      },
      textColor: {
        title: "Text Color Settings",
        description:
          "各カラーバリエーション（main、dark、light、lighter）ごとにテキストカラーを設定できます。\n• Default: 背景色に応じて自動的にテキスト色を調整\n• White: 強制的に白色のテキストを使用\n• Black: 強制的に黒色のテキストを使用\n\nコントラスト比がAA未満の場合は警告アイコンが表示されます。",
      },
      colorBlindness: {
        title: "Color Blindness Simulator",
        description:
          "色覚異常（色覚多様性）のある方にとって、あなたのカラーパレットがどのように見えるかをシミュレーションできます。\n• 第一色覚異常（赤色弱）: 赤色の感度が低下\n• 第二色覚異常（緑色弱）: 緑色の感度が低下\n• 第三色覚異常（青色弱）: 青色の感度が低下\n• 完全色覚異常（色盲）: 色を全く認識できない",
      },
      textPreview: {
        title: "Text Preview",
        description:
          "選択したカラーをテキストとして使用した場合のプレビューを確認できます。様々な背景色や文字サイズでのコントラスト比とアクセシビリティレベルを確認できます。",
      },
    },
    advanced: {
      title: "高度な機能",
      importExport: {
        title: "Import/Export",
        description:
          "「Export JSON」ボタンでパレットをJSONファイルとしてエクスポートできます。 「Import JSON」ボタンで以前保存したパレットをインポートできます。",
      },
      codeExport: {
        title: "Code Export",
        description:
          "作成したカラーパレットを様々な形式のコードとして出力できます：\n• CSS変数: CSSのカスタムプロパティとして出力\n• SCSS変数: Sassの変数として出力\n• Tailwind設定: tailwind.config.jsの形式で出力\n• Material UI: Material UIのテーマ設定として出力\n• クラスマッピング: 最も近いTailwindのカラークラスとのマッピング",
      },
      paletteOptimizer: {
        title: "Palette Optimizer",
        description:
          "カラーパレットを自動的に最適化する機能です：\n• アクセシビリティ修正: コントラスト比が基準を満たすよう自動調整\n• プライマリカラーとの調和: プライマリカラーに基づいて他の色の明度と彩度を調整\n• テキストカラーの最適化: 各バリエーションに最適なテキストカラーを設定",
      },
      colorMode: {
        title: "Color Mode Settings",
        description:
          "カラーシステムと表示形式を選択できます：\n• 標準モード: 独自のカラーパレットを作成\n• Material Design: Material Designのカラーシステムに基づいたパレット\n• Tailwind CSS: Tailwind CSSのカラーシステムに基づいたパレット",
      },
    },
    colorTheory: {
      title: "色彩理論",
      oklab: {
        title: "Oklab Color Space",
        description:
          "Oklabは知覚的に均一なカラースペースで、人間の視覚に合わせて設計されています。従来のRGBやHSLと異なり、色の明るさや彩度の変化が人間の知覚に合わせて均一になるため、より直感的なカラーデザインが可能です。\n• L: 明度（Lightness）- 色の明るさを表します\n• a: 緑-赤の軸 - 負の値が緑、正の値が赤を表します\n• b: 青-黄の軸 - 負の値が青、正の値が黄を表します",
      },
      harmony: {
        title: "Color Harmony",
        description:
          "効果的なカラーパレットを作成するためのガイドライン：\n• 60-30-10ルール：主要色60%、補助色30%、アクセント色10%の割合で使用\n• コントラスト：テキストと背景のコントラスト比は最低4.5:1を目指す\n• 色相の一貫性：同じ色相内でバリエーションを作成すると統一感が生まれる\n• 彩度の調整：重要な要素ほど彩度を高く、背景などは彩度を低く設定",
      },
      roles: {
        title: "Color Roles in Design Systems",
        description:
          "デザインシステムにおける色の役割：\n• Primary：ブランドを表す主要な色、最も頻繁に使用される\n• Secondary：プライマリカラーを補完し、アクセントとして使用\n• Success：成功や完了を示す（通常は緑系）\n• Danger：エラーや危険を示す（通常は赤系）\n• Warning：注意や警告を示す（通常は黄色やオレンジ系）\n• Info：情報提供を示す（通常は青系）\n• Background：背景に使用される色\n• Text：テキストに使用される色",
      },
    },
    faq: {
      title: "よくある質問",
      saveQuestion: {
        title: "カラーパレットを保存するにはどうすればいいですか？",
        answer:
          "画面上部の「保存」ボタンをクリックすると、ブラウザのLocalStorageにパレットが保存されます。ブラウザを閉じても次回アクセス時に復元されます。長期保存や共有には「Export JSON」機能を使用してJSONファイルとして保存してください。",
      },
      accessibilityQuestion: {
        title: "アクセシビリティの基準はどのように判断されていますか？",
        answer:
          "WCAG（Web Content Accessibility Guidelines）2.1の基準に基づいています。テキストと背景のコントラスト比が3.0:1以上でA、4.5:1以上でAA、7.0:1以上でAAAとなります。一般的にはAAレベル（4.5:1以上）が推奨されています。",
      },
      variationsQuestion: {
        title: "カラーバリエーションはどのように生成されていますか？",
        answer:
          "各カラーに対して、main（元の色）、dark（暗い色）、light（明るい色）、lighter（さらに明るい色）の4つのバリエーションが自動生成されます。これらは明度を調整して生成され、アクセシビリティを考慮しています。",
      },
      modeQuestion: {
        title: "Material DesignとTailwind CSSのモードの違いは何ですか？",
        answer:
          "Material Designモードでは、Material UIのカラーシステムに基づいたパレットが生成されます。Tailwind CSSモードでは、Tailwindのカラーシステムに基づいたパレットが生成されます。それぞれのフレームワークに合わせた色名やシェード番号が表示されます。",
      },
    },
    close: "閉じる",
  },
  en: {
    title: "How to use Palette Pally",
    description: "A tool for creating, managing, and checking accessibility of color palettes",
    tabs: {
      basic: "Basic",
      accessibility: "Accessibility",
      advanced: "Advanced",
      colorTheory: "Color Theory",
      faq: "FAQ",
    },
    basic: {
      title: "Basic Features",
      colorPicker: {
        title: "Color Picker",
        description:
          "You can select and edit colors in the left panel. You can also change the color name or directly input HEX, RGB, HSL, and Oklab values.",
      },
      colorRoles: {
        title: "Color Roles",
        description:
          "You can assign roles (primary, secondary, success, warning, etc.) to each color. This improves the consistency of your design system.",
      },
      colorCount: {
        title: "Color Count",
        description:
          "You can adjust the number of colors in your palette from 1 to 24 using the 'Color Count' input at the top of the screen.",
      },
      saveReset: {
        title: "Save and Reset",
        description:
          "The 'Save' button saves your palette to the browser's LocalStorage. The 'Reset' button restores the default colors.",
      },
      colorPalette: {
        title: "Color Palette",
        description:
          "The right panel displays four variations (main, dark, light, lighter) for each color. These are automatically generated, and you can check the contrast ratio and accessibility level.",
      },
    },
    accessibility: {
      title: "Accessibility",
      contrastRatio: {
        title: "Contrast Ratio and WCAG Levels",
        description:
          "The contrast ratio and WCAG accessibility level (AAA, AA, A, Fail) are displayed for each color.\n• AAA (7.0:1 or higher): Highest level of accessibility\n• AA (4.5:1 or higher): Standard accessibility requirement\n• A (3.0:1 or higher): Minimum accessibility requirement\n• Fail (less than 3.0:1): Does not meet accessibility requirements",
      },
      textColor: {
        title: "Text Color Settings",
        description:
          "You can set the text color for each color variation (main, dark, light, lighter).\n• Default: Automatically adjusts text color based on background color\n• White: Forces white text\n• Black: Forces black text\n\nA warning icon appears if the contrast ratio is less than AA.",
      },
      colorBlindness: {
        title: "Color Blindness Simulator",
        description:
          "You can simulate how your color palette appears to people with color vision deficiencies.\n• Protanopia: Reduced sensitivity to red\n• Deuteranopia: Reduced sensitivity to green\n• Tritanopia: Reduced sensitivity to blue\n• Achromatopsia: Complete color blindness",
      },
      textPreview: {
        title: "Text Preview",
        description:
          "You can preview how your selected colors look as text. You can check the contrast ratio and accessibility level with various background colors and font sizes.",
      },
    },
    advanced: {
      title: "Advanced Features",
      importExport: {
        title: "Import/Export",
        description:
          "The 'Export JSON' button exports your palette as a JSON file. The 'Import JSON' button imports a previously saved palette.",
      },
      codeExport: {
        title: "Code Export",
        description:
          "You can export your color palette as code in various formats:\n• CSS variables: Output as CSS custom properties\n• SCSS variables: Output as Sass variables\n• Tailwind config: Output in tailwind.config.js format\n• Material UI: Output as Material UI theme settings\n• Class mapping: Mapping to the closest Tailwind color classes",
      },
      paletteOptimizer: {
        title: "Palette Optimizer",
        description:
          "A feature that automatically optimizes your color palette:\n• Accessibility fixes: Automatically adjusts to meet contrast ratio standards\n• Harmony with primary color: Adjusts brightness and saturation of other colors based on the primary color\n• Text color optimization: Sets the optimal text color for each variation",
      },
      colorMode: {
        title: "Color Mode Settings",
        description:
          "You can select the color system and display format:\n• Standard mode: Create your own color palette\n• Material Design: Palette based on Material Design color system\n• Tailwind CSS: Palette based on Tailwind CSS color system",
      },
    },
    colorTheory: {
      title: "Color Theory",
      oklab: {
        title: "Oklab Color Space",
        description:
          "Oklab is a perceptually uniform color space designed to match human vision. Unlike traditional RGB or HSL, changes in brightness or saturation are uniform to human perception, allowing for more intuitive color design.\n• L: Lightness - represents the brightness of the color\n• a: Green-red axis - negative values are green, positive values are red\n• b: Blue-yellow axis - negative values are blue, positive values are yellow",
      },
      harmony: {
        title: "Color Harmony",
        description:
          "Guidelines for creating effective color palettes:\n• 60-30-10 rule: Use 60% primary color, 30% secondary color, and 10% accent color\n• Contrast: Aim for a minimum contrast ratio of 4.5:1 between text and background\n• Hue consistency: Creating variations within the same hue creates unity\n• Saturation adjustment: Higher saturation for important elements, lower saturation for backgrounds",
      },
      roles: {
        title: "Color Roles in Design Systems",
        description:
          "Roles of colors in design systems:\n• Primary: Main brand color, used most frequently\n• Secondary: Complements the primary color, used as an accent\n• Success: Indicates success or completion (usually green)\n• Danger: Indicates error or danger (usually red)\n• Warning: Indicates caution or warning (usually yellow or orange)\n• Info: Indicates information (usually blue)\n• Background: Used for backgrounds\n• Text: Used for text",
      },
    },
    faq: {
      title: "FAQ",
      saveQuestion: {
        title: "How do I save my color palette?",
        answer:
          "Click the 'Save' button at the top of the screen to save your palette to the browser's LocalStorage. It will be restored the next time you access the site. For long-term storage or sharing, use the 'Export JSON' feature to save as a JSON file.",
      },
      accessibilityQuestion: {
        title: "How are accessibility standards determined?",
        answer:
          "Based on WCAG (Web Content Accessibility Guidelines) 2.1. The contrast ratio between text and background must be at least 3.0:1 for level A, 4.5:1 for level AA, and 7.0:1 for level AAA. Level AA (4.5:1 or higher) is generally recommended.",
      },
      variationsQuestion: {
        title: "How are color variations generated?",
        answer:
          "Four variations are automatically generated for each color: main (original color), dark (darker color), light (lighter color), and lighter (even lighter color). These are generated by adjusting the lightness and considering accessibility.",
      },
      modeQuestion: {
        title: "What's the difference between Material Design and Tailwind CSS modes?",
        answer:
          "Material Design mode generates a palette based on Material UI's color system. Tailwind CSS mode generates a palette based on Tailwind's color system. Each displays color names and shade numbers specific to the framework.",
      },
    },
    close: "Close",
  },
}

export function HelpModal() {
  const { isOpen, open, close } = useModalState(false)
  const { language } = useLanguage()

  // 4. 言語に応じたテキストを使用
  const t = language === "jp" ? texts.jp : texts.en

  return (
    <>
      {/* 5. ボタンのテキストを言語に応じて変更 */}
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1 rounded-full border-blue-200 bg-blue-50 hover:bg-blue-100"
        title={language === "jp" ? "ヘルプ" : "Help"}
        onClick={open}
      >
        <HelpCircle className="h-4 w-4 text-blue-500" />
        <span className="text-blue-600">{language === "jp" ? "ヘルプ" : "Help"}</span>
      </Button>

      <BaseModal open={isOpen} onOpenChange={close}>
        <BaseModalContent
          normalClassName="sm:max-w-[700px]"
          fullscreenClassName="fixed inset-4 max-w-none translate-x-0 translate-y-0 left-0 top-0 flex flex-col"
          className="flex flex-col"
        >
          <BaseModalHeader>
            <BaseModalTitle>{t.title}</BaseModalTitle>
            <BaseModalDescription>{t.description}</BaseModalDescription>
          </BaseModalHeader>

          <BaseModalBody maxHeight="60vh" className="py-4">
            <Tabs defaultValue="basic">
              {/* 6. タブのテキストを言語に応じて変更 */}
              <TabsList className="flex w-full h-auto flex-wrap gap-1 mb-4">
                <TabsTrigger value="basic" className="whitespace-nowrap">{t.tabs.basic}</TabsTrigger>
                <TabsTrigger value="accessibility" className="whitespace-nowrap">{t.tabs.accessibility}</TabsTrigger>
                <TabsTrigger value="advanced" className="whitespace-nowrap">{t.tabs.advanced}</TabsTrigger>
                <TabsTrigger value="color-theory" className="whitespace-nowrap">{t.tabs.colorTheory}</TabsTrigger>
                <TabsTrigger value="faq" className="whitespace-nowrap">{t.tabs.faq}</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Palette className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                    <div>
                      <h3 className="text-sm font-semibold">{t.basic.colorPicker.title}</h3>
                      <p className="text-sm text-gray-500">{t.basic.colorPicker.description}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Tag className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                    <div>
                      <h3 className="text-sm font-semibold">{t.basic.colorRoles.title}</h3>
                      <p className="text-sm text-gray-500">{t.basic.colorRoles.description}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Sliders className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                    <div>
                      <h3 className="text-sm font-semibold">{t.basic.colorCount.title}</h3>
                      <p className="text-sm text-gray-500">{t.basic.colorCount.description}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Save className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                    <div>
                      <h3 className="text-sm font-semibold">{t.basic.saveReset.title}</h3>
                      <p className="text-sm text-gray-500">{t.basic.saveReset.description}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Palette className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                    <div>
                      <h3 className="text-sm font-semibold">{t.basic.colorPalette.title}</h3>
                      <p className="text-sm text-gray-500">{t.basic.colorPalette.description}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="accessibility" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Contrast className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                    <div>
                      <h3 className="text-sm font-semibold">{t.accessibility.contrastRatio.title}</h3>
                      <p className="text-sm text-gray-500 whitespace-pre-line">
                        {t.accessibility.contrastRatio.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Type className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                    <div>
                      <h3 className="text-sm font-semibold">{t.accessibility.textColor.title}</h3>
                      <p className="text-sm text-gray-500 whitespace-pre-line">{t.accessibility.textColor.description}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Eye className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                    <div>
                      <h3 className="text-sm font-semibold">{t.accessibility.colorBlindness.title}</h3>
                      <p className="text-sm text-gray-500 whitespace-pre-line">
                        {t.accessibility.colorBlindness.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Type className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                    <div>
                      <h3 className="text-sm font-semibold">{t.accessibility.textPreview.title}</h3>
                      <p className="text-sm text-gray-500">{t.accessibility.textPreview.description}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <FileJson className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                    <div>
                      <h3 className="text-sm font-semibold">{t.advanced.importExport.title}</h3>
                      <p className="text-sm text-gray-500">{t.advanced.importExport.description}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Code className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                    <div>
                      <h3 className="text-sm font-semibold">{t.advanced.codeExport.title}</h3>
                      <p className="text-sm text-gray-500 whitespace-pre-line">{t.advanced.codeExport.description}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Wand2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                    <div>
                      <h3 className="text-sm font-semibold">{t.advanced.paletteOptimizer.title}</h3>
                      <p className="text-sm text-gray-500 whitespace-pre-line">{t.advanced.paletteOptimizer.description}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Palette className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                    <div>
                      <h3 className="text-sm font-semibold">{t.advanced.colorMode.title}</h3>
                      <p className="text-sm text-gray-500 whitespace-pre-line">{t.advanced.colorMode.description}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="color-theory" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Palette className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                    <div>
                      <h3 className="text-sm font-semibold">{t.colorTheory.oklab.title}</h3>
                      <p className="text-sm text-gray-500 whitespace-pre-line">{t.colorTheory.oklab.description}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                    <div>
                      <h3 className="text-sm font-semibold">{t.colorTheory.harmony.title}</h3>
                      <p className="text-sm text-gray-500 whitespace-pre-line">{t.colorTheory.harmony.description}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Wand2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                    <div>
                      <h3 className="text-sm font-semibold">{t.colorTheory.roles.title}</h3>
                      <p className="text-sm text-gray-500 whitespace-pre-line">{t.colorTheory.roles.description}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="faq" className="space-y-4">
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <h3 className="text-sm font-semibold">{t.faq.saveQuestion.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{t.faq.saveQuestion.answer}</p>
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <h3 className="text-sm font-semibold">{t.faq.accessibilityQuestion.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{t.faq.accessibilityQuestion.answer}</p>
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <h3 className="text-sm font-semibold">{t.faq.variationsQuestion.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{t.faq.variationsQuestion.answer}</p>
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <h3 className="text-sm font-semibold">{t.faq.modeQuestion.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{t.faq.modeQuestion.answer}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </BaseModalBody>

          <BaseModalFooter>
            {/* 7. 閉じるボタンのテキストを言語に応じて変更 */}
            <Button onClick={close}>{t.close}</Button>
          </BaseModalFooter>
        </BaseModalContent>
      </BaseModal>
    </>
  )
}
