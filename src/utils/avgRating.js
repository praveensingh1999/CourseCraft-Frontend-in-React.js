export default function GetAvgRating(ratingArr = []) {
  //console.log("ratingArrhjh", ratingArr);

  // guard checks
  if (!Array.isArray(ratingArr) || ratingArr.length === 0) return 0;

  // keep only valid rating objects
  const validRatings = ratingArr.filter(
    item => item && typeof item.rating === "number"
  );

  if (validRatings.length === 0) return 0;

  const totalReviewCount = validRatings.reduce(
    (acc, curr) => acc + curr.rating,
    0
  );

 // console.log("totalReviewCount", totalReviewCount);

  // round to 1 decimal
  const avgReviewCount =
    Math.round((totalReviewCount / validRatings.length) * 10) / 10;

  return avgReviewCount;
}
