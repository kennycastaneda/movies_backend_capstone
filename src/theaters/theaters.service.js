const knex = require("../db/connection");

function movies_theatersMoviesJoin() {
  return knex("movies_theaters as mt").join(
    "movies as m",
    "mt.movie_id",
    "m.movie_id"
  );
}

const movies_theatersTheatersJoin = knex("movies_theaters as mt")
  .join("theaters as t", "mt.theater_id", "t.theater_id")
  .join("movies as m", "mt.movie_id", "m.movie_id");

async function getTheaters() {
  return knex("theaters").select("*");
}
async function list(movieId) {
  if (movieId) {
    return movies_theatersTheatersJoin
      .select(
        "t.theater_id",
        "t.name",
        "t.address_line_1",
        "t.address_line_2",
        "t.city",
        "t.zip",
        "t.created_at",
        "t.updated_at",
        "mt.is_showing",
        "mt.movie_id"
      )
      .where({ "mt.movie_id": movieId });
  }
  const theaters = await getTheaters();
  let movies = [];

  for (theater of theaters) {
    movies = await movies_theatersMoviesJoin()
      .select(
        "m.movie_id",
        "m.title",
        "m.runtime_in_minutes",
        "m.rating",
        "m.description",
        "m.image_url",
        "m.created_at",
        "m.updated_at",
        "mt.is_showing",
        "mt.theater_id"
      )
      .where({ "mt.theater_id": theater.theater_id });
    // console.log(`movie search ${theater.theater_id}`, movies);
    theater.movies = movies;
  }
  return theaters;
}

module.exports = {
  list,
};
