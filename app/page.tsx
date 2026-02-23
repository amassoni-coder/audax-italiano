import { createClient } from "@/lib/supabase/server"
import { CampeonatosList } from "@/components/campeonatos-list"
import { Trophy } from "lucide-react"
import type { Campeonato } from "@/lib/types"

export default async function HomePage() {
  const supabase = await createClient()

  const { data: campeonatos, error } = await supabase
    .from("campeonatos")
    .select("*")
    .order("anio", { ascending: false })

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-center text-muted-foreground">
          Error al cargar los campeonatos. Intente nuevamente.
        </p>
      </div>
    )
  }

  const campeonatosByYear = (campeonatos as Campeonato[]).reduce(
    (acc, c) => {
      const year = c.anio
      if (!acc[year]) acc[year] = []
      acc[year].push(c)
      return acc
    },
    {} as Record<number, Campeonato[]>,
  )

  const years = Object.keys(campeonatosByYear)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-7 w-7 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Campeonatos</h2>
        </div>
        <p className="text-muted-foreground">
          Historial de campeonatos disputados por Audax Italiano, ordenados por
          temporada.
        </p>
      </div>

      {years.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No se encontraron campeonatos.
        </p>
      ) : (
        <CampeonatosList years={years} campeonatosByYear={campeonatosByYear} />
      )}
    </div>
  )
}
