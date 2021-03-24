const ReviewService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const methodName = "list";
  req.log.debug({ __filename, methodName });

  const { movieId } = req.params;

  const data = await ReviewService.list(movieId);

  req.log.trace({ __filename, methodName, valid: true });

  res.json({
    data,
  });
}
async function reviewExists(req, res, next) {
  const methodName = "reviewExists";
  req.log.debug({ __filename, methodName });

  const error = { status: 404, message: `Review cannot be found.` };

  const { reviewId } = req.params;

  if (!reviewId) return next(error);

  let review = await ReviewService.getReviewById(reviewId);
  if (review instanceof Error) return next({ message: review.message });

  if (!review) return next(error);

  req.log.trace({ __filename, methodName, valid: true });
  next();
}

async function update(req, res) {
  const { reviewId } = req.params;
  const reviewUpdates = req.body;
  const data = await ReviewService.update(reviewId, reviewUpdates);
  res.json({ data });
}

async function destroy(req, res) {
  const { reviewId } = req.params;
  ReviewService.destroy(reviewId);
  res.sendStatus(204);
}

module.exports = {
  list: asyncErrorBoundary(list),
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};
