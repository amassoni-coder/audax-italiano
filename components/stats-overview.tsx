interface StatsProps {
  stats: {
    total: number
    wins: number
    draws: number
    losses: number
    goalsFor: number
    goalsAgainst: number
  }
}

export function StatsOverview({ stats }: StatsProps) {
  const winRate =
    stats.total > 0 ? ((stats.wins / stats.total) * 100).toFixed(0) : "0"

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <StatCard label="Partidos" value={stats.total} />
      <StatCard label="Victorias" value={stats.wins} color="win" />
      <StatCard label="Empates" value={stats.draws} color="draw" />
      <StatCard label="Derrotas" value={stats.losses} color="loss" />
      <StatCard
        label="Goles"
        value={`${stats.goalsFor} - ${stats.goalsAgainst}`}
      />
      <StatCard label="% Victoria" value={`${winRate}%`} />
    </div>
  )
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: string | number
  color?: "win" | "draw" | "loss"
}) {
  const colorClasses = {
    win: "text-win",
    draw: "text-draw",
    loss: "text-loss",
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 text-center">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p
        className={`mt-1 text-2xl font-bold ${color ? colorClasses[color] : "text-card-foreground"}`}
      >
        {value}
      </p>
    </div>
  )
}
