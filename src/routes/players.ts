import { FastifyInstance } from "fastify"

import { prisma } from "../lib/prisma"

import { calculatePlayersStatistics } from "../utils/calculatePlayersStatistics"

interface ParamsProps {
  id: string
}

export async function playersRoutes(app: FastifyInstance) {
  // list players
  app.get("/players", async (_, reply) => {
    try {
      const players = await prisma.player.findMany({
        orderBy: {
          name: "asc",
        },
        include: {
          matches: {
            include: {
              match: true,
            },
          },
        },
      })

      const formatPlayers = players.map((player) => ({
        id: player.id,
        name: player.name,
        slugAvatar: player.slugAvatar,
        createdAt: player.createdAt,
        numberOfMatchesPlayed: player.matches.length,
      }))

      return reply.send({ players: formatPlayers })
    } catch (err) {
      return reply.send({
        message: "Não foi possível carregar a lista de jogadores",
      })
    }
  })

  // list players with statistics
  app.get("/players/statistics", async (_, reply) => {
    try {
      const prismaPlayers = await prisma.player.findMany({
        orderBy: {
          name: "asc",
        },
        include: {
          matches: {
            include: {
              match: true,
            },
          },
        },
      })

      const players = prismaPlayers.map((player) =>
        calculatePlayersStatistics(player)
      )

      return reply.send({ players })
    } catch (err) {
      return reply.send({
        message: "Não foi possível carregar a lista de jogadores",
      })
    }
  })
}
