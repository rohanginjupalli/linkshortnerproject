'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { Slot } from 'radix-ui'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

type DialogContextValue = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextValue | null>(null)

function useDialogContext(): DialogContextValue {
  const context = React.useContext(DialogContext)

  if (!context) {
    throw new Error('Dialog components must be used within Dialog')
  }

  return context
}

function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}): React.JSX.Element {
  return <DialogContext.Provider value={{ open, onOpenChange }}>{children}</DialogContext.Provider>
}

function DialogTrigger({
  asChild = false,
  onClick,
  type = 'button',
  ...props
}: React.ComponentProps<'button'> & { asChild?: boolean }): React.JSX.Element {
  const context = useDialogContext()
  const Comp = asChild ? Slot.Root : 'button'

  function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
    onClick?.(event)

    if (!event.defaultPrevented) {
      context.onOpenChange(true)
    }
  }

  return <Comp {...props} type={asChild ? undefined : type} onClick={handleClick} />
}

function DialogClose({
  asChild = false,
  onClick,
  type = 'button',
  ...props
}: React.ComponentProps<'button'> & { asChild?: boolean }): React.JSX.Element {
  const context = useDialogContext()
  const Comp = asChild ? Slot.Root : 'button'

  function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
    onClick?.(event)

    if (!event.defaultPrevented) {
      context.onOpenChange(false)
    }
  }

  return <Comp {...props} type={asChild ? undefined : type} onClick={handleClick} />
}

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>): React.JSX.Element | null {
  const context = useDialogContext()

  React.useEffect(() => {
    if (!context.open) {
      return
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        context.onOpenChange(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [context])

  if (!context.open || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => context.onOpenChange(false)}
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          data-slot="dialog-content"
          className={cn(
            'relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl shadow-black/30',
            className
          )}
          onClick={(event) => event.stopPropagation()}
          {...props}
        >
          <DialogClose
            className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close dialog"
          >
            <X className="size-4" />
          </DialogClose>
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}

function DialogHeader({
  className,
  ...props
}: React.ComponentProps<'div'>): React.JSX.Element {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex flex-col gap-2 text-left', className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  ...props
}: React.ComponentProps<'div'>): React.JSX.Element {
  return (
    <div
      data-slot="dialog-footer"
      className={cn('mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<'h2'>): React.JSX.Element {
  return (
    <h2
      data-slot="dialog-title"
      className={cn('text-lg font-semibold tracking-tight text-foreground', className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<'p'>): React.JSX.Element {
  return (
    <p
      data-slot="dialog-description"
      className={cn('text-sm leading-6 text-muted-foreground', className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
}