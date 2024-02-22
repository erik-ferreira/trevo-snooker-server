import { Player, PlayersOnMatches, Match } from "@prisma/client"

interface Statistics {
  numberOfMatchesWon: number
  numberOfMatchesLose: number
  numberOfMatchesWonPerNormal: number
  numberOfMatchesLosePerNormal: number
  numberOfMatchesWonPerCapote: number
  numberOfMatchesLosePerCapote: number
  numberOfMatchesWonPerSuicide: number
  numberOfMatchesLosePerSuicide: number
  points: number
}

export interface ReturnPlayersStatistics extends Player {
  statistics: Statistics
}

type MachProps = Array<
  PlayersOnMatches & {
    match: Match
  }
>

export interface PlayersProps extends Player {
  matches: MachProps
}
