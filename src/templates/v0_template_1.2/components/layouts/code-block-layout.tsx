"use client"
import { motion } from "framer-motion"
import { CodeBlock } from "@/components/ui/code-block"

export interface CodeItem {
  code: string
  language: string
  filename?: string
  highlightLines?: number[]
  _key: string | number
}

interface CodeBlockLayoutProps {
  items: CodeItem[]
}

export function CodeBlockLayout({ items }: CodeBlockLayoutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      {items.map((item, i) => (
        <motion.div
          key={item._key}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        >
          <CodeBlock
            language={item.language}
            code={item.code}
            filename={item.filename}
            highlightLines={item.highlightLines}
          />
        </motion.div>
      ))}
    </div>
  )
}
