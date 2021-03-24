const MovieService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const methodName = "movieExists";
  req.log.debug({ __filename, methodName });

  const error = { status: 404, message: `Movie cannot be found.` };

  const { movieId } = req.params;

  if (!movieId) return next(error);

  let movie = await MovieService.getMovieById(movieId);
  if (movie instanceof Error) return next({ message: movie.message });

  if (!movie) return next(error);

  req.log.trace({ __filename, methodName, valid: true });
  res.locals.movie = movie;
  next();
}

async function read(req, res) {
  const methodName = "read";
  req.log.debug({ __filename, methodName });
  res.json({ data: res.locals.movie });
}

async function list(req, res) {
  const methodName = "list";
  req.log.debug({ __filename, methodName });

  let { is_showing } = req.query;
  if (is_showing) {
      is_showing = is_showing === "true";
  }
  const data = await MovieService.list(is_showing);

  req.log.trace({ __filename, methodName, valid: true });

  res.json({
    data,
  });
}

module.exports = {
  movieExists,
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
  list: asyncErrorBoundary(list),
};
