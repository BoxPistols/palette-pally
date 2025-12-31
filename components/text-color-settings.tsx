"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Settings2 } from "lucide-react"
import {
  BaseModal,
  BaseModalContent,
  BaseModalHeader,
  BaseModalTitle,
  BaseModalBody,
  BaseModalFooter,
} from "@/components/ui/base-modal"
import { useLanguage } from "@/contexts/language-context"
import type { TextColorMode, TextColorSettings as TextColorSettingsType } from "@/types/palette"

interface TextColorSettingsProps {
  settings: TextColorSettingsType
  onChange: (settings: TextColorSettingsType) => void
}

export function TextColorSettings({ settings, onChange }: TextColorSettingsProps) {
  const { language, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const handleChange = (variant: keyof TextColorSettingsType, value: TextColorMode) => {
    const newSettings = { ...settings, [variant]: value }
    onChange(newSettings)
  }

  const resetToDefault = () => {
    onChange({
      main: "default",
      dark: "default",
      light: "default",
      lighter: "default",
    })
    setIsOpen(false)
  }

  return (
    <>
      <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => setIsOpen(true)}>
        <Settings2 className="h-4 w-4" />
        <span>{t("button.textColorSettings")}</span>
      </Button>

      <BaseModal open={isOpen} onOpenChange={setIsOpen}>
        <BaseModalContent
          normalClassName="sm:max-w-[500px]"
          fullscreenClassName="fixed inset-4 max-w-none translate-x-0 translate-y-0 left-0 top-0 flex flex-col"
          className="flex flex-col"
        >
          <BaseModalHeader>
            <BaseModalTitle>{t("textColor.title")}</BaseModalTitle>
          </BaseModalHeader>

          <BaseModalBody maxHeight="60vh" className="py-4">
            <p className="text-sm text-gray-500 mb-4">{t("textColor.description")}</p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium">{t("textColor.main")}</label>
                <Select value={settings.main} onValueChange={(value) => handleChange("main", value as TextColorMode)}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">{t("textColor.default")}</SelectItem>
                    <SelectItem value="white">{t("textColor.white")}</SelectItem>
                    <SelectItem value="black">{t("textColor.black")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">{t("textColor.dark")}</label>
                <Select value={settings.dark} onValueChange={(value) => handleChange("dark", value as TextColorMode)}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">{t("textColor.default")}</SelectItem>
                    <SelectItem value="white">{t("textColor.white")}</SelectItem>
                    <SelectItem value="black">{t("textColor.black")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">{t("textColor.light")}</label>
                <Select value={settings.light} onValueChange={(value) => handleChange("light", value as TextColorMode)}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">{t("textColor.default")}</SelectItem>
                    <SelectItem value="white">{t("textColor.white")}</SelectItem>
                    <SelectItem value="black">{t("textColor.black")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">{t("textColor.lighter")}</label>
                <Select
                  value={settings.lighter}
                  onValueChange={(value) => handleChange("lighter", value as TextColorMode)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">{t("textColor.default")}</SelectItem>
                    <SelectItem value="white">{t("textColor.white")}</SelectItem>
                    <SelectItem value="black">{t("textColor.black")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </BaseModalBody>

          <BaseModalFooter>
            <Button variant="outline" onClick={resetToDefault}>
              {t("textColor.reset")}
            </Button>
            <Button onClick={() => setIsOpen(false)}>{t("textColor.close")}</Button>
          </BaseModalFooter>
        </BaseModalContent>
      </BaseModal>
    </>
  )
}
