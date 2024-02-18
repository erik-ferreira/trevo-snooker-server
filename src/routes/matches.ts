import { z, ZodError } from "zod"
import { FastifyInstance } from "fastify"

import { prisma } from "../lib/prisma"

export async function matchesRoutes(app: FastifyInstance) {
  app.get("/matches", async (req, reply) => {
    const matches = await prisma.match.findMany({
      include: {
        players: {
          include: {
            player: true,
          },
        },
      },
    })

    return reply.send({ matches })
  })

  // create match
  app.post("/matches", async (request, reply) => {
    try {
      const createMatchBodySchema = z.object({
        is_capote: z.boolean({
          required_error:
            "Informe se a partida foi vencida através de um capote",
        }),
        is_suicide: z.boolean({
          required_error:
            "Informe se a partida foi vencida através de um suicídio",
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

      const { is_capote, is_suicide, winner_player_id, players_ids } =
        createMatchBodySchema.parse(request.body)

      reply
        .code(201)
        .send({ is_capote, is_suicide, winner_player_id, players_ids })
    } catch (error) {
      let message = "Não foi possível criar a partida"

      if (error instanceof ZodError) {
        console.log("error", JSON.stringify(error, null, 2))

        message = error?.issues[0].message
      }

      reply.code(400).send({ message })
    }
  })
}

// app.post("/matches", async (req, reply) => {
//   try {
//     const players = await prisma.player.findMany()
//     const playersIds = [players[0].id, players[1].id]
//     // Crie a partida no banco de dados
//     const match = await prisma.match.create({
//       data: {
//         is_capote: false,
//         is_suicide: false,
//         winner_player_id: playersIds[1],
//         players: {
//           create: playersIds.map((playerId) => ({
//             player: { connect: { id: playerId } },
//           })),
//         },
//       },
//       include: { players: true },
//     })

//     reply.code(201).send(match)
//   } catch (error) {
//     reply.code(500).send({ error: "Erro ao criar a partida." })
//   }
// })
