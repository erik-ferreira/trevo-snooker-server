import { Prisma } from "@prisma/client"
import { ZodError } from "zod"
import { FastifyInstance } from "fastify"

import { createMatchBodySchema } from "../schemas/matches"

import { prisma } from "../lib/prisma"

export async function matchesRoutes(app: FastifyInstance) {
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

      reply.code(400).send({ message })
    }
  })

  // get all list match dates
  app.get("/matches/dates", async (_, reply) => {
    try {
      const matches = await prisma.match.findMany({
        select: {
          id: true,
          created_at: true,
        },
      })

      return reply.send({ matches })
    } catch (error) {
      reply
        .code(400)
        .send({ message: "Não foi possível carregar as datas das partidas" })
    }
  })
}
