import fastify from "fastify"

import { playersRoutes } from "./routes/players"
import { matchesRoutes } from "./routes/matches"

const app = fastify()

app.register(playersRoutes)
app.register(matchesRoutes)

app.listen({ port: 3333 }).then(() => {
  console.log("http server running")
})
