import { FastifyInstance } from "fastify"

import { prisma } from "../lib/prisma"

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
        slug_avatar: player.slug_avatar,
        created_at: player.created_at,
        numberOfMatchesWon: player.matches.length,
      }))

      return reply.send({ players: formatPlayers })
    } catch (err) {
      return reply.send({
        message: "Não foi possível carregar a lista de jogadores",
      })
    }
  })
}
