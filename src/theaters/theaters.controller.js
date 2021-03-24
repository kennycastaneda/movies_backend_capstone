const TheaterService = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const methodName = "list";
  req.log.debug({ __filename, methodName });

  const { movieId } = req.params;

  const data = await TheaterService.list(movieId);

  req.log.trace({ __filename, methodName, valid: true });

  res.json({
    data,
  });
}

module.exports = {
  list: asyncErrorBoundary(list),
};
