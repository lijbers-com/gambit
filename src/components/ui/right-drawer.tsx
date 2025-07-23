"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const RightDrawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root> & {
  shouldScaleBackground?: boolean
}) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    direction="right"
    {...props}
  />
)
RightDrawer.displayName = "RightDrawer"

const RightDrawerTrigger = DrawerPrimitive.Trigger

const RightDrawerPortal = DrawerPrimitive.Portal

const RightDrawerClose = DrawerPrimitive.Close

const RightDrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/80", className)}
    {...props}
  />
))
RightDrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const RightDrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <RightDrawerPortal>
    <RightDrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col border-l bg-background shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-2xl",
        className
      )}
      {...props}
    >
      {children}
    </DrawerPrimitive.Content>
  </RightDrawerPortal>
))
RightDrawerContent.displayName = "RightDrawerContent"

const RightDrawerHeader = ({
  className,
  children,
  showCloseButton = true,
  onClose,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  showCloseButton?: boolean
  onClose?: () => void
}) => (
  <div
    className={cn("flex items-start justify-between p-6 pb-4", className)}
    {...props}
  >
    <div className="flex-1">{children}</div>
    {showCloseButton && (
      <RightDrawerClose asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </RightDrawerClose>
    )}
  </div>
)
RightDrawerHeader.displayName = "RightDrawerHeader"

const RightDrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-row gap-3 p-6 pt-4 justify-start flex-wrap", className)}
    {...props}
  />
)
RightDrawerFooter.displayName = "RightDrawerFooter"

const RightDrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
RightDrawerTitle.displayName = DrawerPrimitive.Title.displayName

const RightDrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground mt-2", className)}
    {...props}
  />
))
RightDrawerDescription.displayName = DrawerPrimitive.Description.displayName

const RightDrawerBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex-1 overflow-y-auto px-6 pb-6", className)}
    {...props}
  />
)
RightDrawerBody.displayName = "RightDrawerBody"

export {
  RightDrawer,
  RightDrawerPortal,
  RightDrawerOverlay,
  RightDrawerTrigger,
  RightDrawerClose,
  RightDrawerContent,
  RightDrawerHeader,
  RightDrawerFooter,
  RightDrawerTitle,
  RightDrawerDescription,
  RightDrawerBody,
}