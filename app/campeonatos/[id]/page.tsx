import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Trophy } from "lucide-react"
import { PartidosList } from "@/components/partidos-list"
import { StatsOverview } from "@/components/stats-overview"
import type { Campeonato, Partido } from "@/lib/types"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: campeonato } = await supabase
    .from("campeonatos")
    .select("nombre, anio")
    .eq("id", id)
    .single()

  if (!campeonato) return { title: "Campeonato no encontrado" }

  return {
    title: `${campeonato.nombre} ${campeonato.anio} - Audax Italiano`,
    description: `Detalle y partidos del ${campeonato.nombre} ${campeonato.anio} de Audax Italiano.`,
  }
}

export default async function CampeonatoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [campeonatoRes, partidosRes] = await Promise.all([
    supabase.from("campeonatos").select("*").eq("id", id).single(),
    supabase
      .from("partidos")
      .select("*")
      .eq("campeonato_id", id)
      .order("fecha", { ascending: true }),
  ])

  if (campeonatoRes.error || !campeonatoRes.data) {
    notFound()
  }

  const campeonato = campeonatoRes.data as Campeonato
  const partidos = (partidosRes.data ?? []) as Partido[]

  const stats = {
    total: partidos.length,
    wins: partidos.filter((p) => p.resultado === "V").length,
    draws: partidos.filter((p) => p.resultado === "E").length,
    losses: partidos.filter((p) => p.resultado === "D").length,
    goalsFor: partidos.reduce((sum, p) => {
      if (p.local === "Audax Italiano") return sum + (p.marcador_local ?? 0)
      return sum + (p.marcador_visita ?? 0)
    }, 0),
    goalsAgainst: partidos.reduce((sum, p) => {
      if (p.local === "Audax Italiano") return sum + (p.marcador_visita ?? 0)
      return sum + (p.marcador_local ?? 0)
    }, 0),
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a campeonatos
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-7 w-7 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">
            {campeonato.nombre}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
            {campeonato.tipo}
          </span>
          {campeonato.categoria && (
            <span className="text-sm text-muted-foreground">
              {campeonato.categoria}
            </span>
          )}
          <span className="text-sm text-muted-foreground">
            Temporada {campeonato.anio}
          </span>
          {campeonato.actual && (
            <span className="inline-block rounded-full bg-win/10 px-3 py-1 text-xs font-medium text-win">
              En curso
            </span>
          )}
        </div>
      </div>

      {partidos.length > 0 && <StatsOverview stats={stats} />}

      <div className="mt-8">
        <h3 className="mb-4 text-lg font-bold text-foreground">
          Partidos ({partidos.length})
        </h3>
        {partidos.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            No se encontraron partidos para este campeonato.
          </p>
        ) : (
          <PartidosList partidos={partidos} />
        )}
      </div>
    </div>
  )
}
