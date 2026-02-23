import Link from "next/link"
import { Calendar, ChevronRight } from "lucide-react"
import type { Campeonato } from "@/lib/types"

function getBadgeStyle(tipo: string) {
  switch (tipo?.toLowerCase()) {
    case "liga":
      return "bg-primary text-primary-foreground"
    case "copa":
      return "bg-accent text-accent-foreground"
    default:
      return "bg-secondary text-secondary-foreground"
  }
}

function CampeonatoCard({ campeonato }: { campeonato: Campeonato }) {
  return (
    <Link
      href={`/campeonatos/${campeonato.id}`}
      className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
          <Calendar className="h-5 w-5 text-secondary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
            {campeonato.nombre}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <span
              className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${getBadgeStyle(campeonato.tipo)}`}
            >
              {campeonato.tipo}
            </span>
            {campeonato.categoria && (
              <span className="text-xs text-muted-foreground">
                {campeonato.categoria}
              </span>
            )}
            {campeonato.actual && (
              <span className="inline-block rounded-full bg-win/10 px-2.5 py-0.5 text-xs font-medium text-win">
                En curso
              </span>
            )}
          </div>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
    </Link>
  )
}

export function CampeonatosList({
  years,
  campeonatosByYear,
}: {
  years: number[]
  campeonatosByYear: Record<number, Campeonato[]>
}) {
  return (
    <div className="space-y-8">
      {years.map((year) => (
        <section key={year}>
          <div className="mb-3 flex items-center gap-3">
            <h3 className="text-lg font-bold text-primary">{year}</h3>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="space-y-2">
            {campeonatosByYear[year].map((campeonato) => (
              <CampeonatoCard key={campeonato.id} campeonato={campeonato} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
