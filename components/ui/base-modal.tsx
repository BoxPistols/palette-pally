"use client"

import * as React from "react"
import { useState, useCallback } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X, Maximize2, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Context for modal state
interface ModalContextValue {
  isFullscreen: boolean
  toggleFullscreen: () => void
}

const ModalContext = React.createContext<ModalContextValue | undefined>(undefined)

export function useModal() {
  const context = React.useContext(ModalContext)
  if (!context) {
    throw new Error("useModal must be used within a BaseModal")
  }
  return context
}

// BaseModal Root
interface BaseModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultFullscreen?: boolean
  children: React.ReactNode
}

export function BaseModal({
  open,
  onOpenChange,
  defaultFullscreen = false,
  children
}: BaseModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(defaultFullscreen)

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev)
  }, [])

  // Reset fullscreen when modal closes
  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setIsFullscreen(defaultFullscreen)
    }
    onOpenChange?.(open)
  }, [defaultFullscreen, onOpenChange])

  return (
    <ModalContext.Provider value={{ isFullscreen, toggleFullscreen }}>
      <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
        {children}
      </DialogPrimitive.Root>
    </ModalContext.Provider>
  )
}

// BaseModalTrigger
export const BaseModalTrigger = DialogPrimitive.Trigger

// BaseModalPortal
export const BaseModalPortal = DialogPrimitive.Portal

// BaseModalClose
export const BaseModalClose = DialogPrimitive.Close

// BaseModalOverlay
const BaseModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
BaseModalOverlay.displayName = "BaseModalOverlay"

// BaseModalContent
interface BaseModalContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  showFullscreenToggle?: boolean
  fullscreenClassName?: string
  normalClassName?: string
}

const BaseModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  BaseModalContentProps
>(({
  className,
  children,
  showFullscreenToggle = true,
  fullscreenClassName = "fixed inset-4 max-w-none translate-x-0 translate-y-0 left-0 top-0",
  normalClassName = "max-w-lg",
  ...props
}, ref) => {
  const { isFullscreen, toggleFullscreen } = useModal()

  return (
    <BaseModalPortal>
      <BaseModalOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 grid gap-4 border bg-background p-6 shadow-lg duration-200",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          isFullscreen
            ? fullscreenClassName
            : cn(
                "left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]",
                "w-full sm:rounded-lg",
                "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
                "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
                normalClassName
              ),
          isFullscreen && "sm:rounded-lg",
          className
        )}
        {...props}
      >
        {children}
        <div className="absolute right-4 top-4 flex items-center gap-1 z-50">
          {showFullscreenToggle && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-sm opacity-70 hover:opacity-100"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle fullscreen</span>
            </Button>
          )}
          <DialogPrimitive.Close className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </div>
      </DialogPrimitive.Content>
    </BaseModalPortal>
  )
})
BaseModalContent.displayName = "BaseModalContent"

// BaseModalHeader
const BaseModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left pr-16", className)}
    {...props}
  />
))
BaseModalHeader.displayName = "BaseModalHeader"

// BaseModalFooter
const BaseModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
))
BaseModalFooter.displayName = "BaseModalFooter"

// BaseModalTitle
const BaseModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
BaseModalTitle.displayName = "BaseModalTitle"

// BaseModalDescription
const BaseModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
BaseModalDescription.displayName = "BaseModalDescription"

// BaseModalBody - scrollable content area
const BaseModalBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { maxHeight?: string }
>(({ className, maxHeight = "60vh", ...props }, ref) => {
  const { isFullscreen } = useModal()

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-auto",
        isFullscreen ? "flex-1" : "",
        className
      )}
      style={!isFullscreen ? { maxHeight } : undefined}
      {...props}
    />
  )
})
BaseModalBody.displayName = "BaseModalBody"

export {
  BaseModalOverlay,
  BaseModalContent,
  BaseModalHeader,
  BaseModalFooter,
  BaseModalTitle,
  BaseModalDescription,
  BaseModalBody,
}
