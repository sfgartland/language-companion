'use client'

import * as React from 'react'
import { NextUIProvider } from '@nextui-org/react'

export function Providers({
  children,
  className
}: {
  children: React.ReactNode
  className: string
}) {
  return <NextUIProvider className={className}>{children}</NextUIProvider>
}
