'use client'

import { useEffect, useRef } from 'react'

interface ClientPrintStylesheetProps {
    href: string
}

/**
 * 客户端组件：用于异步加载打印样式表或通过这种技术加载其他CSS
 * 解决 Server Component 中无法使用 onLoad 事件处理器的问题
 */
export function ClientPrintStylesheet({ href }: ClientPrintStylesheetProps) {
    // 使用引用来确保只执行一次（尽管 useEffect 空依赖数组通常足够，但在 Strict Mode 下可能运行两次）
    const loaded = useRef(false)

    return (
        <link
            rel="stylesheet"
            href={href}
            media="print"
            onLoad={(e) => {
                if (loaded.current) return
                e.currentTarget.media = 'all'
                loaded.current = true
            }}
        />
    )
}
