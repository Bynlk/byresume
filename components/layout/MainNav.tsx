"use client"

import Link from "next/link"
import { Button } from "@/components/ui/Button"

export function MainNav() {
    return (
        <header className="border-b">
            <div className="container flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center">
                    <span className="font-bold text-xl text-blue-600">ByResume</span>
                    <span className="font-bold text-2xl px-1">·</span>
                    <span className="font-bold text-xl ">简历编辑器</span>
                </Link>
                
                <nav className="flex items-center space-x-6">
                    
                    <Link 
                        href="/about" 
                        className="text-sm font-medium hover:text-primary transition-colors"
                    >
                        关于我们
                    </Link>
                    <Button size="sm" asChild>
                        <Link href="/editor">
                            开始制作
                        </Link>
                    </Button>
                </nav>
            </div>
        </header>
    )
}
