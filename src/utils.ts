export function makeImagePath(id: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}${id}`;
}

export enum WatchTypes {
  "tv" = "tv",
  "movie" = "movie",
}

export enum SliderTypes {
  "nowPlaying" = "now_playing",
  "popular" = "popular",
  "topRated" = "top_rated",
  "upcoming" = "upcoming",
  "onTheAir" = "on_the_air",
  "airingToday" = "airing_today",
}
