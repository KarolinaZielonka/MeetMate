"use client"

import { Loader2 } from "lucide-react"
import type { FormEvent, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface InputDialogProps {
  open: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  description: string
  inputLabel: string
  inputPlaceholder: string
  inputValue: string
  onInputChange: (value: string) => void
  onSubmit: (e: FormEvent) => void | Promise<void>
  submitText: string
  loadingText?: string
  isLoading?: boolean
  inputType?: "text" | "password" | "email"
  icon?: ReactNode
  closable?: boolean
}

/**
 * Reusable input dialog HOC for forms with a single input field
 *
 * @example
 * ```tsx
 * <InputDialog
 *   open={showDialog}
 *   onOpenChange={setShowDialog}
 *   title="Password Required"
 *   description="Enter your password to continue"
 *   inputLabel="Password"
 *   inputPlaceholder="Enter password"
 *   inputValue={password}
 *   onInputChange={setPassword}
 *   onSubmit={handleSubmit}
 *   submitText="Unlock"
 *   loadingText="Verifying..."
 *   isLoading={isVerifying}
 *   inputType="password"
 *   icon={<Lock className="w-8 h-8" />}
 *   closable={false}
 * />
 * ```
 */
export function InputDialog({
  open,
  onOpenChange,
  title,
  description,
  inputLabel,
  inputPlaceholder,
  inputValue,
  onInputChange,
  onSubmit,
  submitText,
  loadingText,
  isLoading = false,
  inputType = "text",
  icon,
  closable = true,
}: InputDialogProps) {
  const handleOpenChange = (newOpen: boolean) => {
    if (closable || !newOpen) {
      onOpenChange?.(newOpen)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-md w-[calc(100vw-2rem)] max-h-[90vh] p-6"
        onInteractOutside={(e) => !closable && e.preventDefault()}
      >
        {icon && (
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4 shadow-lg">
            {icon}
          </div>
        )}

        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl text-center">{title}</DialogTitle>
          <DialogDescription className="text-base text-center">{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="input-field" className="text-base font-semibold">
              {inputLabel}
            </Label>
            <Input
              id="input-field"
              type={inputType}
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder={inputPlaceholder}
              disabled={isLoading}
              autoFocus
              className="h-12 text-base"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-12 text-base bg-gradient-primary hover:opacity-90 shadow-md"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin h-5 w-5" />
                {loadingText || submitText}
              </span>
            ) : (
              submitText
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
