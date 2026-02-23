import { createClient } from "@/lib/supabase/server"
import { Users } from "lucide-react"
import type { Partido } from "@/lib/types"

export const metadata = {
  title: "Jugadores - Audax Italiano Estadisticas",
  description: "Rivales historicos y registro de partidos de Audax Italiano.",
}

interface RivalStats {
  name: string
  played: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
}

export default async function JugadoresPage() {
  const supabase = await createClient()

  const { data: partidos, error } = await supabase
    .from("partidos")
    .select("*")
    .order("fecha", { ascending: false })

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-center text-muted-foreground">
          Error al cargar los datos. Intente nuevamente.
        </p>
      </div>
    )
  }

  const allPartidos = (partidos ?? []) as Partido[]

  const rivalsMap = new Map<string, RivalStats>()

  allPartidos.forEach((p) => {
    const isLocal = p.local?.toLowerCase().includes("audax")
    const rival = isLocal ? p.visita : p.local
    if (!rival) return

    const existing = rivalsMap.get(rival) || {
      name: rival,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
    }

    existing.played++
    if (p.resultado === "V") existing.wins++
    else if (p.resultado === "E") existing.draws++
    else if (p.resultado === "D") existing.losses++

    existing.goalsFor += isLocal
      ? (p.marcador_local ?? 0)
      : (p.marcador_visita ?? 0)
    existing.goalsAgainst += isLocal
      ? (p.marcador_visita ?? 0)
      : (p.marcador_local ?? 0)

    rivalsMap.set(rival, existing)
  })

  const rivals = Array.from(rivalsMap.values()).sort(
    (a, b) => b.played - a.played,
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="h-7 w-7 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">
            Rivales Historicos
          </h2>
        </div>
        <p className="text-muted-foreground">
          Registro historico contra cada rival, basado en todos los partidos
          registrados.
        </p>
      </div>

      {rivals.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No se encontraron datos de rivales.
        </p>
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            {rivals.length} rivales - {allPartidos.length} partidos totales
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-primary text-primary-foreground">
                  <th className="px-4 py-3 text-left font-semibold">Rival</th>
                  <th className="px-3 py-3 text-center font-semibold">PJ</th>
                  <th className="px-3 py-3 text-center font-semibold">V</th>
                  <th className="px-3 py-3 text-center font-semibold">E</th>
                  <th className="px-3 py-3 text-center font-semibold">D</th>
                  <th className="px-3 py-3 text-center font-semibold">GF</th>
                  <th className="px-3 py-3 text-center font-semibold">GC</th>
                  <th className="hidden px-3 py-3 text-center font-semibold sm:table-cell">
                    Dif
                  </th>
                </tr>
              </thead>
              <tbody>
                {rivals.map((rival, idx) => {
                  const diff = rival.goalsFor - rival.goalsAgainst
                  return (
                    <tr
                      key={rival.name}
                      className={`border-b border-border transition-colors hover:bg-muted/50 ${
                        idx % 2 === 0 ? "bg-card" : "bg-muted/20"
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-card-foreground">
                        {rival.name}
                      </td>
                      <td className="px-3 py-3 text-center text-card-foreground">
                        {rival.played}
                      </td>
                      <td className="px-3 py-3 text-center font-medium text-win">
                        {rival.wins}
                      </td>
                      <td className="px-3 py-3 text-center font-medium text-draw">
                        {rival.draws}
                      </td>
                      <td className="px-3 py-3 text-center font-medium text-loss">
                        {rival.losses}
                      </td>
                      <td className="px-3 py-3 text-center text-card-foreground">
                        {rival.goalsFor}
                      </td>
                      <td className="px-3 py-3 text-center text-card-foreground">
                        {rival.goalsAgainst}
                      </td>
                      <td
                        className={`hidden px-3 py-3 text-center font-medium sm:table-cell ${
                          diff > 0
                            ? "text-win"
                            : diff < 0
                              ? "text-loss"
                              : "text-draw"
                        }`}
                      >
                        {diff > 0 ? `+${diff}` : diff}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
