'use client'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import React from 'react'

interface QuestionInputProps {
  onAskQuestion: () => void
  placeholder?: string
  loading?: boolean
}

const QuestionInput: React.FC<QuestionInputProps> = ({
  onAskQuestion,
  placeholder = 'Let AI ask you a question',
  loading = false,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="inline-flex items-center rounded-md border border-gray-200 shadow-sm hover:bg-gray-50"
            onClick={onAskQuestion}
            disabled={loading}
            variant="ghost"
            size="sm"
          >
            <div className="flex items-center">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-500 mr-1.5">
                😊
              </span>
              <span className="text-gray-600 text-xs">{placeholder}</span>
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Feynman Technique</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default QuestionInput
