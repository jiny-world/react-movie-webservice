const API_KEY = "34b3635932700dce4dff4308d9053724";
const BASE_PATH = "https://api.themoviedb.org/3";
const LANGUAGE = "kr";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  name: string;
}
export interface IGetMoviewsResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetCurrentMovieData {
  overview: string;
  original_title: string;
  original_name: string;
  vote_average: string;
  backdrop_path: string;
  id: string;
}

export function getMovies(watchType: string, types: string) {
  return fetch(
    `${BASE_PATH}/${watchType}/${types}?api_key=${API_KEY}&language=${LANGUAGE}&page=1`
  ).then((response) => response.json());
}

export function getMovieInfo(watchType: string, movieId: string) {
  return fetch(`${BASE_PATH}/${watchType}/${movieId}?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
