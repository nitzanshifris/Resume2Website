"use client"

import React from 'react'
import { EditableText } from './editable-text'
import { TruncatedText } from './truncated-text'
import { useEditMode } from '@/contexts/edit-mode-context'

interface EditableTruncatedTextProps {
  initialValue: string
  onSave: (value: string) => void
  className?: string
  maxLines?: number
  modalTitle?: string
}

export function EditableTruncatedText({
  initialValue,
  onSave,
  className,
  maxLines = 3,
  modalTitle
}: EditableTruncatedTextProps) {
  const { isEditMode } = useEditMode()

  if (isEditMode) {
    return (
      <EditableText
        textarea
        as="p"
        initialValue={initialValue}
        onSave={onSave}
        className={className}
      />
    )
  }

  return (
    <TruncatedText
      text={initialValue}
      maxLines={maxLines}
      className={className}
      modalTitle={modalTitle}
    />
  )
}