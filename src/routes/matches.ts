import { Prisma } from "@prisma/client"
import { ZodError } from "zod"
import { FastifyInstance } from "fastify"

import {
  createMatchBodySchema,
  getMatchesQuerySchema,
} from "../schemas/matches"

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
  app.get("/matches/dates", async (request, reply) => {
    try {
      const { date } = getMatchesQuerySchema.parse(request.query)

      // let matches

      if (date) {
        const matches = await prisma.match.findMany({
          where: {
            created_at: "2024-02-18T04:38:35.514Z",
          },
        })

        return reply.send({ matches })
      }

      const matches = await prisma.match.findMany({
        select: {
          id: true,
          created_at: true,
        },
      })

      return reply.send({ matches })
    } catch (error) {
      console.log(error)
      let message = "Não foi possível carregar as datas das partidas"

      if (error instanceof ZodError) {
        message = error?.issues[0].message
      }

      reply.code(400).send({ message })
    }
  })
}
