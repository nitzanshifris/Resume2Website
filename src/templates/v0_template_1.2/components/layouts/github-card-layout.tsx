"use client"
import { motion } from "framer-motion"
import { Github, Star, GitFork } from "lucide-react"
import { EditableText } from "@/components/ui/editable-text"

export interface GitHubItem {
  title: string
  url: string
  _key: string | number
}

interface GitHubCardLayoutProps {
  items: GitHubItem[]
  onSave: (key: string | number, field: "title" | "url", value: string) => void
}

function getRepoName(url: string) {
  try {
    const path = new URL(url).pathname
    return path.substring(1)
  } catch {
    return url
  }
}

export function GitHubCardLayout({ items, onSave }: GitHubCardLayoutProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {items.map((item, i) => (
        <motion.a
          key={item._key}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="block bg-card rounded-xl border-2 border-border/50 shadow-lg p-6 transition-all hover:shadow-xl hover:border-accent group"
        >
          <div className="flex items-center gap-4 mb-4">
            <Github className="h-8 w-8 text-muted-foreground" />
            <div>
              <EditableText
                as="h3"
                initialValue={item.title}
                onSave={(v) => onSave(item._key, "title", v)}
                className="font-serif text-xl font-bold text-card-foreground group-hover:text-accent"
              />
              <p className="text-sm text-muted-foreground">{getRepoName(item.url)}</p>
            </div>
          </div>
          <EditableText
            as="p"
            initialValue="A project showcasing modern web development techniques."
            onSave={() => {}}
            className="font-sans text-base text-muted-foreground mb-4"
          />
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span>1.2k</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="h-4 w-4" />
              <span>345</span>
            </div>
          </div>
        </motion.a>
      ))}
    </div>
  )
}
