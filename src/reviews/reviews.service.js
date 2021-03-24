const knex = require("../db/connection");

async function getReviews(movieId) {
  return knex("reviews as r")
    .select(
      "r.review_id",
      "r.content",
      "r.score",
      "r.created_at",
      "r.updated_at",
      "r.critic_id",
      "r.movie_id"
    )
    .where({ "r.movie_id": movieId });
}

async function list(movieId) {
  if (movieId) {
    const reviews = await getReviews(movieId);

    for (review of reviews) {
      const critic = await knex("critics")
        .select("*")
        .where({ critic_id: review.critic_id });
      review.critic = critic[0];
    }

    return reviews;
  }
}

async function destroy(reviewId) {
  return knex("reviews").where({ review_id: reviewId }).del();
}
async function getReviewById(reviewId) {
  return knex("reviews").select("*").where({ review_id: reviewId }).first();
}

async function update(reviewId, reviewUpdates) {
  const { data } = reviewUpdates;
  await knex("reviews").where({ review_id: reviewId }).update(data);
  //.returning("*"); //returning is not supported by sqlite3
  const review = await knex("reviews")
    .select("*")
    .where({ review_id: reviewId });

  const critic = await knex("critics")
    .select("*")
    .where({ critic_id: review[0].critic_id });
  review[0].critic = critic[0];

  return review[0];
}

module.exports = {
  list,
  getReviewById,
  destroy,
  update,
};
