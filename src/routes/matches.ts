import { ZodError } from "zod"
import { randomUUID } from "crypto"
import { Prisma } from "@prisma/client"
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

  // list of all matches on a date
  app.get("/matches", async (request, reply) => {
    try {
      const { date } = getMatchesQuerySchema.parse(request.query)

      const matches = await prisma.match.findMany({
        where: {
          created_at: {
            gte: date?.startDate,
            lte: date?.endDate,
          },
        },
      })

      return reply.send({ matches })
    } catch (error) {
      let message = "Não foi possível carregar as partidas"

      if (error instanceof ZodError) {
        message = error?.issues[0].message
      }

      reply.code(400).send({ message })
    }
  })

  // list off all match dates
  app.get("/matches/dates", async (_, reply) => {
    try {
      const matchesPrismaDates = await prisma.match.findMany({
        select: {
          created_at: true,
        },
      })

      const convertMatches = matchesPrismaDates.map((match) =>
        match.created_at.toDateString()
      )

      const matches = Array.from(new Set(convertMatches)).map((match) => ({
        id: randomUUID(),
        created_at: new Date(match),
      }))

      return reply.send({ matches })
    } catch (error) {
      reply
        .code(400)
        .send({ message: "Não foi possível carregar as datas das partidas" })
    }
  })
}
