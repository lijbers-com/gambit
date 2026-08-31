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
  // No scrim: the drawer sits beside the page rather than dimming it, so the
  // content it refers to stays readable. The overlay is kept (transparent) so
  // clicking outside still closes the drawer.
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-transparent", className)}
    {...props}
  />
))
RightDrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

/** Resizable between a readable minimum and the viewport, remembered across
 *  drawers — a width chosen once is a preference, not a per-message choice. */
const DRAWER_WIDTH_KEY = "right-drawer-width"
const MIN_DRAWER_WIDTH = 380

const clampDrawerWidth = (w: number) =>
  Math.min(Math.max(w, MIN_DRAWER_WIDTH), Math.max(MIN_DRAWER_WIDTH, window.innerWidth - 96))

const RightDrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, style, ...props }, ref) => {
  const [width, setWidth] = React.useState<number | null>(null)

  // Stored width is applied after mount — the drawer only ever opens client
  // side, but reading localStorage during render would still be a hydration
  // hazard for any drawer that starts open.
  React.useEffect(() => {
    try {
      const stored = Number(window.localStorage.getItem(DRAWER_WIDTH_KEY))
      if (stored > 0) setWidth(clampDrawerWidth(stored))
    } catch { /* storage unavailable (e.g. sandboxed iframe) */ }
  }, [])

  const startResize = (e: React.PointerEvent) => {
    // Keep the drag ours: vaul reads pointer drags on the content as
    // swipe-to-dismiss, which would close the drawer instead of resizing it.
    e.preventDefault()
    e.stopPropagation()
    document.body.style.userSelect = "none"
    document.body.style.cursor = "ew-resize"
    const onMove = (ev: PointerEvent) => setWidth(clampDrawerWidth(window.innerWidth - ev.clientX))
    const onUp = (ev: PointerEvent) => {
      try { window.localStorage.setItem(DRAWER_WIDTH_KEY, String(clampDrawerWidth(window.innerWidth - ev.clientX))) } catch { /* storage unavailable */ }
      document.body.style.userSelect = ""
      document.body.style.cursor = ""
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
  }

  return (
    <RightDrawerPortal>
      <RightDrawerOverlay />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          "group/drawer fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col border-l bg-background shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-2xl",
          className
        )}
        // A dragged width wins over the class cap; until then the cap rules.
        style={width !== null ? { width, maxWidth: "none", ...style } : style}
        {...props}
      >
        {/* Resize handle on the drawer's leading edge — a wide hit area with a
            grip that appears on hover, like a window splitter. */}
        <div
          onPointerDown={startResize}
          title="Drag to resize"
          aria-hidden
          className="absolute inset-y-0 left-0 z-10 hidden w-2.5 cursor-ew-resize sm:block"
        >
          <div className="absolute left-1 top-1/2 h-16 w-1 -translate-y-1/2 rounded-full bg-muted-foreground/30 opacity-0 transition-opacity duration-150 group-hover/drawer:opacity-100" />
        </div>
        {children}
      </DrawerPrimitive.Content>
    </RightDrawerPortal>
  )
})
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