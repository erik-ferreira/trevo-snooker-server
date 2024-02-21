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

      // const formatPlayers = players.map((player) => {
      //   const statistics = player.matches.reduce(
      //     (acc, current) => {
      //       const isPlayerWinner = current.match.winner_player_id === player.id
      //       const isCapote = current.match.is_capote
      //       const isSuicide = current.match.is_suicide
      //       const isMatchNormal =
      //         !current.match.is_capote && !current.match.is_suicide

      //       if (isPlayerWinner) {
      //         acc.numberOfMatchesWon++

      //         if (isCapote) acc.numberOfMatchesWonPerCapote++
      //         if (isSuicide) acc.numberOfMatchesWonPerSuicide++
      //         if (isMatchNormal) acc.numberOfMatchesWonPerNormal++
      //       } else {
      //         acc.numberOfMatchesLose++

      //         if (isCapote) acc.numberOfMatchesLosePerCapote++
      //         if (isSuicide) acc.numberOfMatchesLosePerSuicide++
      //         if (isMatchNormal) acc.numberOfMatchesLosePerNormal++
      //       }

      //       return acc
      //     },
      //     {
      //       numberOfMatchesWon: 0,
      //       numberOfMatchesLose: 0,

      //       numberOfMatchesWonPerNormal: 0,
      //       numberOfMatchesLosePerNormal: 0,

      //       numberOfMatchesWonPerCapote: 0,
      //       numberOfMatchesLosePerCapote: 0,

      //       numberOfMatchesWonPerSuicide: 0,
      //       numberOfMatchesLosePerSuicide: 0,
      //     }
      //   )

      //   let points = 0

      //   points += statistics.numberOfMatchesWonPerCapote * 3
      //   points += statistics.numberOfMatchesWonPerSuicide * 1
      //   points += statistics.numberOfMatchesWonPerNormal * 2

      //   points -= statistics.numberOfMatchesLosePerSuicide * 1
      //   points -= statistics.numberOfMatchesLosePerCapote * 1

      //   return {
      //     id: player.id,
      //     name: player.name,
      //     slug_avatar: player.slug_avatar,
      //     created_at: player.created_at,
      //     statistics: { ...statistics, points },
      //   }
      // })

      return reply.send({ players })
    } catch (err) {
      return reply.send({
        message: "Não foi possível carregar a lista de jogadores",
      })
    }
  })
}
