'use client'

import { Sender } from '@ant-design/x'
import { App } from 'antd'
import React from 'react'

interface ChatSenderProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  loading?: boolean
  placeholder?: string
  disabled?: boolean
}

export const ChatSender: React.FC<ChatSenderProps> = ({
  value,
  onChange,
  onSubmit,
  loading = false,
  placeholder = 'Ask your question...',
  disabled = false,
}) => {
  const { message } = App.useApp()

  const handleSubmit = () => {
    if (!value.trim()) {
      message.info('Please enter a message')
      return
    }
    onSubmit()
  }

  return (
    <Sender
      loading={loading}
      value={value}
      onChange={onChange}
      onSubmit={handleSubmit}
      placeholder={placeholder}
      disabled={disabled}
      onCancel={() => {
        // 可选的取消操作
      }}
    />
  )
}
