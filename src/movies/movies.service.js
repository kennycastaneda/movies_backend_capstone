const knex = require("../db/connection");

function movies_theatersMoviesJoin() {
  return knex("movies_theaters as mt").join(
    "movies as m",
    "mt.movie_id",
    "m.movie_id"
  );
}

async function list(is_showing) {
  const query = movies_theatersMoviesJoin().select(
    "m.movie_id",
    "m.title",
    "m.runtime_in_minutes",
    "m.rating",
    "m.description",
    "m.image_url"
  );
  if (typeof is_showing === "boolean") {
    query.where({ "mt.is_showing": is_showing });
  }
  return query.groupBy("m.movie_id");
}

async function getMovieById(movieId) {
  return knex("movies").select("*").where({ movie_id: movieId }).first();
}
module.exports = {
  getMovieById,
  list,
};
