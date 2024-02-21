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

      const formatPlayers = players.map((player) => {
        const numberOfMatchesWon = player.matches.filter(
          (match) => match.match.winner_player_id === player.id
        ).length
        const numberOfMatchesLose = player.matches.filter(
          (match) => match.match.winner_player_id !== player.id
        ).length
        const quantityCapotesWon = player.matches.filter(
          (match) =>
            match.match.winner_player_id === player.id && match.match.is_capote
        ).length
        const quantityCapotesLose = player.matches.filter(
          (match) =>
            match.match.winner_player_id !== player.id && match.match.is_capote
        ).length
        const quantitySuicideWon = player.matches.filter(
          (match) =>
            match.match.winner_player_id === player.id && match.match.is_suicide
        ).length
        const quantitySuicideLose = player.matches.filter(
          (match) =>
            match.match.winner_player_id !== player.id && match.match.is_suicide
        ).length

        let points = 0

        points += quantityCapotesWon * 3
        points += quantitySuicideWon * 1
        points +=
          (numberOfMatchesWon - (quantityCapotesWon + quantitySuicideWon)) * 2

        points -= quantitySuicideLose * 1
        points -= quantityCapotesLose * 1

        return {
          id: player.id,
          name: player.name,
          slug_avatar: player.slug_avatar,
          created_at: player.created_at,
          statistics: {
            numberOfMatchesWon,
            numberOfMatchesLose,
            quantityCapotesWon,
            quantityCapotesLose,
            quantitySuicideWon,
            quantitySuicideLose,
            points,
          },
        }
      })

      return reply.send({ players, formatPlayers })
    } catch (err) {
      return reply.send({
        message: "Não foi possível carregar a lista de jogadores",
      })
    }
  })
}
