export interface Campeonato {
  id: number
  nombre: string
  anio: number
  tipo: string
  categoria: string
  actual: boolean
}

export interface Partido {
  id: number
  campeonato_id: number
  fecha: string
  local: string
  marcador_local: number
  visita: string
  marcador_visita: number
  resultado: string
  estadio: string
}
