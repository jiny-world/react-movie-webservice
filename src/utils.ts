export function makeImagePath(id: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}${id}`;
}

export enum SliderTypes {
  "nowPlaying" = "now_playing",
  "popular" = "popular",
  "topRated" = "top_rated",
  "upcoming" = "upcoming",
}
