const ratings = [
  {
    name: `novice`,
    count: 10,
  },
  {
    name: `fan`,
    count: 19,
  },
  {
    name: `movie buff`,
    count: Infinity,
  },
];

export default function calcRating(data) {
  const count = data.filter((item) => item.userDetails.alreadyWatched).length;
  for (const rating of ratings) {
    if (count <= rating.count) return rating.name;
  }
  return `unknow`;
}
