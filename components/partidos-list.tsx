import type { Partido } from "@/lib/types"
import { MapPin } from "lucide-react"

function getResultBadge(resultado: string) {
  switch (resultado) {
    case "V":
      return {
        label: "V",
        className: "bg-win/10 text-win",
      }
    case "E":
      return {
        label: "E",
        className: "bg-draw/10 text-draw",
      }
    case "D":
      return {
        label: "D",
        className: "bg-loss/10 text-loss",
      }
    default:
      return {
        label: "-",
        className: "bg-muted text-muted-foreground",
      }
  }
}

function getResultBorder(resultado: string) {
  switch (resultado) {
    case "V":
      return "border-l-win"
    case "E":
      return "border-l-draw"
    case "D":
      return "border-l-loss"
    default:
      return "border-l-border"
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return ""
  try {
    const date = new Date(dateStr + "T12:00:00")
    return date.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  } catch {
    return dateStr
  }
}

function isAudaxTeam(team: string) {
  return team?.toLowerCase().includes("audax")
}

export function PartidosList({ partidos }: { partidos: Partido[] }) {
  return (
    <div className="space-y-2">
      {partidos.map((partido) => {
        const badge = getResultBadge(partido.resultado)
        const borderClass = getResultBorder(partido.resultado)

        return (
          <div
            key={partido.id}
            className={`rounded-lg border border-border border-l-4 ${borderClass} bg-card p-4 transition-colors hover:bg-muted/50`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${badge.className}`}
                >
                  {badge.label}
                </span>

                <div className="flex flex-1 items-center gap-2 min-w-0">
                  <span
                    className={`text-sm font-medium truncate ${isAudaxTeam(partido.local) ? "text-primary font-bold" : "text-card-foreground"}`}
                  >
                    {partido.local}
                  </span>
                  <span className="shrink-0 rounded bg-muted px-2 py-0.5 text-sm font-bold text-card-foreground">
                    {partido.marcador_local ?? "-"} - {partido.marcador_visita ?? "-"}
                  </span>
                  <span
                    className={`text-sm font-medium truncate ${isAudaxTeam(partido.visita) ? "text-primary font-bold" : "text-card-foreground"}`}
                  >
                    {partido.visita}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                {partido.estadio && (
                  <span className="hidden items-center gap-1 md:flex">
                    <MapPin className="h-3 w-3" />
                    {partido.estadio}
                  </span>
                )}
                <span className="min-w-[80px] text-right">
                  {formatDate(partido.fecha)}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
