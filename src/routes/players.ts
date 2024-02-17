import { FastifyInstance } from "fastify"

import { prisma } from "../lib/prisma"

interface ParamsProps {
  id: string
}

export async function playersRoutes(app: FastifyInstance) {
  app.get("/players", async (req, reply) => {
    const players = await prisma.player.findMany()

    return reply.send({ players })
  })

  app.get("/players/:id", async (request, reply) => {
    const { id } = request.params as ParamsProps

    if (!id) {
      return reply.code(400).send({ error: "Id do usuário não encontrado" })
    }

    const user = await prisma.player.findUniqueOrThrow({
      where: { id },
      include: {
        matches: {
          include: {
            match: true,
          },
        },
      },
    })

    return reply.code(201).send({ user })
  })
}
