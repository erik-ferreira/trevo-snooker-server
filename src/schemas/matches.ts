import { z } from "zod"

export const createMatchBodySchema = z.object({
  is_capote: z.boolean({
    required_error: "Informe se a partida foi vencida através de um capote",
  }),
  is_suicide: z.boolean({
    required_error: "Informe se a partida foi vencida através de um suicídio",
  }),
  winner_player_id: z.string({
    required_error: "Id do jogador que venceu a partida é obrigatório",
  }),
  players_ids: z
    .array(z.string(), {
      required_error: "Informe os ids dos dois jogadores da partida",
    })
    .length(2, "Você precisa informar os dois jogadores da partida"),
})