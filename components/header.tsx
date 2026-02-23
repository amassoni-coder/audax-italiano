import Link from "next/link"
import { Trophy, Users, Home } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground">
            <span className="text-lg font-bold text-primary">AI</span>
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Audax Italiano</h1>
            <p className="text-xs text-primary-foreground/70">Estadisticas</p>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Inicio</span>
          </Link>
          <Link
            href="/jugadores"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Jugadores</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
