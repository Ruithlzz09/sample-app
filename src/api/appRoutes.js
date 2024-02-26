module.exports = (app) => {
  app.get('/liveness', (req, res) => {
    try {
      res.status(200).send("working")
    } catch (error) {
      console.log(`liveness check failed: ${error.stack || error}`)
      res.status(400).json(error)
    }
  })
}
