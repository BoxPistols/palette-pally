"use client"

import { type ReactNode } from "react"
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
import { useLanguage } from "@/contexts/language-context"

interface FullscreenModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  className?: string
  defaultFullscreen?: boolean
  showFooter?: boolean
  footerContent?: ReactNode
}

export function FullscreenModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  defaultFullscreen = false,
  showFooter = false,
  footerContent,
}: FullscreenModalProps) {
  const { language } = useLanguage()

  return (
    <BaseModal open={open} onOpenChange={onOpenChange} defaultFullscreen={defaultFullscreen}>
      <BaseModalContent
        normalClassName="max-w-[600px] w-[90vw]"
        fullscreenClassName="fixed inset-4 max-w-none translate-x-0 translate-y-0 left-0 top-0 flex flex-col"
        className={`flex flex-col ${className || ""}`}
      >
        <BaseModalHeader>
          <BaseModalTitle>{title}</BaseModalTitle>
          {description && <BaseModalDescription>{description}</BaseModalDescription>}
        </BaseModalHeader>

        <BaseModalBody maxHeight="60vh" className="flex-1 py-4">
          {children}
        </BaseModalBody>

        {(showFooter || footerContent) && (
          <BaseModalFooter>
            {footerContent || (
              <Button onClick={() => onOpenChange(false)}>
                {language === "jp" ? "閉じる" : "Close"}
              </Button>
            )}
          </BaseModalFooter>
        )}
      </BaseModalContent>
    </BaseModal>
  )
}
