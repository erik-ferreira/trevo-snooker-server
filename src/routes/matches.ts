import { Prisma } from "@prisma/client"
import { ZodError } from "zod"
import { FastifyInstance } from "fastify"

import { createMatchBodySchema } from "../schemas/matches"

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
      const { is_capote, is_suicide, winner_player_id, players_ids } =
        createMatchBodySchema.parse(request.body)

      const match = await prisma.match.create({
        data: {
          is_capote,
          is_suicide,
          winner_player_id,
          players: {
            create: players_ids.map((playerId) => ({
              player: { connect: { id: playerId } },
            })),
          },
        },
        include: { players: true },
      })

      reply.code(201).send(match)
    } catch (error) {
      let message = "Não foi possível criar a partida"

      if (error instanceof ZodError) {
        console.log("error", JSON.stringify(error, null, 2))

        message = error?.issues[0].message
      } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          message = "Um ou mais jogadores fornecidos não foram encontrados."
        }
      }

      console.log(error)

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
