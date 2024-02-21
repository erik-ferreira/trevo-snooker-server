export interface MatchDetails {
  id: string
  is_capote: boolean
  is_suicide: boolean
  created_at: string
  winner_player_id: string
}

export interface Match {
  match_id: string
  player_id: string
  match: MatchDetails
}

export interface PlayersProps {
  id: string
  name: string
  slug_avatar: string
  created_at: string
  matches: Match[]
}

export function calculatePlayersStatistics(players: PlayersProps[]) {
  const formatPlayers = players.map((player) => {
    const statistics = player.matches.reduce(
      (acc, current) => {
        const isPlayerWinner = current.match.winner_player_id === player.id
        const isCapote = current.match.is_capote
        const isSuicide = current.match.is_suicide
        const isMatchNormal =
          !current.match.is_capote && !current.match.is_suicide

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

    return {
      id: player.id,
      name: player.name,
      slug_avatar: player.slug_avatar,
      created_at: player.created_at,
      statistics: { ...statistics, points },
    }
  })
}
