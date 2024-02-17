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

  app.post("/matches", async (req, reply) => {
    try {
      const players = [
        "2adf0741-ac19-4fb4-b342-b5ce19bbe8d3",
        "631cf1a0-7232-490a-be68-7239f55fe2ff",
      ]
      // Crie a partida no banco de dados
      const match = await prisma.match.create({
        data: {
          is_capote: false,
          is_suicide: false,
          players: {
            create: players.map((playerId) => ({
              player: { connect: { id: playerId } },
            })),
          },
        },
        include: { players: true },
      })

      reply.code(201).send(match)
    } catch (error) {
      reply.code(500).send({ error: "Erro ao criar a partida." })
    }
  })
}
