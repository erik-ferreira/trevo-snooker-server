import { PlayersProps, ReturnPlayersStatistics } from "./types"

export function calculatePlayersStatistics(
  prismaPlayer: PlayersProps
): ReturnPlayersStatistics {
  const statistics = prismaPlayer.matches.reduce(
    (acc, current) => {
      const isPlayerWinner = current.match.winnerPlayerId === prismaPlayer.id
      const isCapote = current.match.isCapote
      const isSuicide = current.match.isSuicide
      const isMatchNormal = !current.match.isSuicide && !current.match.isSuicide

      if (isPlayerWinner) {
        acc.numberOfMatchesWon++

        if (isCapote) acc.numberOfMatchesWonPerCapote++
        if (isSuicide) acc.numberOfMatchesWonPerSuicide++
        if (isMatchNormal) acc.numberOfMatchesWonPerNormal++
      } else {
        acc.numberOfMatchesLose++

        if (isCapote) acc.numberOfMatchesLosePerCapote++
        if (isSuicide) acc.numberOfMatchesLosePerSuicide++
        if (isMatchNormal) acc.numberOfMatchesLosePerNormal++
      }

      return acc
    },
    {
      numberOfMatchesWon: 0,
      numberOfMatchesLose: 0,

      numberOfMatchesWonPerNormal: 0,
      numberOfMatchesLosePerNormal: 0,

      numberOfMatchesWonPerCapote: 0,
      numberOfMatchesLosePerCapote: 0,

      numberOfMatchesWonPerSuicide: 0,
      numberOfMatchesLosePerSuicide: 0,
    }
  )

  let points = 0

  points += statistics.numberOfMatchesWonPerCapote * 3
  points += statistics.numberOfMatchesWonPerSuicide * 1
  points += statistics.numberOfMatchesWonPerNormal * 2

  points -= statistics.numberOfMatchesLosePerSuicide * 1
  points -= statistics.numberOfMatchesLosePerCapote * 1
  points = points < 0 ? 0 : points

  return {
    id: prismaPlayer.id,
    name: prismaPlayer.name,
    slugAvatar: prismaPlayer.slugAvatar,
    createdAt: prismaPlayer.createdAt,
    statistics: { ...statistics, points },
  }
}
