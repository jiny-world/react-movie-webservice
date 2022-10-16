import { useLocation } from "react-router-dom";
import {
  getMultiSearch,
  ISearchResult,
  getMovieInfo,
  IGetCurrentMovieData,
  IMovieCredit,
  getCreditInfo,
} from "../api";
import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { makeImagePath } from "../utils";
import { useHistory, useRouteMatch } from "react-router-dom";

const Wrapper = styled.div`
  margin: 60px;
  background-color: black;
  display: flex;
  flex-direction: column;
`;
const List = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 50px;
`;

const Title = styled.div`
  font-size: 30px;
  strong {
    font-weight: 700;
  }
  margin: 30px;
`;
const Box = styled(motion.div)<{ boxbgphoto: string }>`
  background-color: white;
  height: 450px;
  width: 300px;
  color: black;
  border-radius: 5px;
  background-image: url(${(props) => props.boxbgphoto});
  background-size: cover;
  background-position: center center;
  position: relative;
`;

const BoxBackground = styled(motion.div)`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  font-weight: 700;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  opacity: 0;
`;

const MovieInfoBox = styled(motion.div)`
  background-color: ${(props) => props.theme.black.lighter};
  color: ${(props) => props.theme.white.lighter};
  padding: 5px;
  border-radius: 5px;
  width: 100%;
  margin-top: 5px;
  h4 {
    text-align: center;
    font-size: 15px;
  }
`;

const MovieBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const boxVariants = {
  normal: { scale: 1.0 },
  hover: {
    zIndex: 99,
    scale: 1.2,
    y: -20,
    cursor: "pointer",
    transition: {
      delay: 0.3,
      type: "tween",
    },
  },
};

const movieInfoBoxVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.3,
    },
  },
};

const BigMovie = styled(motion.div)`
  position: fixed;
  width: 45vw;
  min-width: 380px;
  height: 85vh;
  background-color: ${(props) => props.theme.black.lighter};
  z-index: 99;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: auto;
  top: 10vh;
  margin: 0 auto;
  left: 0;
  right: 0;
  overscroll-behavior: contain;
  box-shadow: rgb(0 0 0 / 75%) 0px 3px 10px;
`;

const BigCoverImg = styled.div`
  width: 100%;
  height: 40vh;
  background-size: cover;
  background-position: center center;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;
const BigOverview = styled.div`
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  margin: 30px;
  h1 {
    font-weight: 700;
    margin-bottom: 10px;
    font-size: 17px;
  }
  p {
    margin-bottom: 10px;
    font-size: 14px;
  }
`;

const BigCoverTitle = styled.div`
  color: ${(props) => props.theme.white.lighter};
  font-size: 15px;
  margin: 30px;
  h2 {
    font-weight: 700;
    font-size: 40px;
  }
`;

const MovieInfo = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  span {
    margin-right: 30px;
    font-weight: 400;
  }
`;

const MovieGrade = styled.span`
  border: 1px solid grey;
  background-color: rgba(87, 87, 87, 1);
  padding: 6px;
  border-radius: 5px;
  svg {
    width: 15px;
  }
`;

const MovieGenres = styled.span`
  border: 1px solid grey;
  background-color: rgba(87, 87, 87, 1);
  padding: 6px;
  border-radius: 5px;
  svg {
    width: 15px;
  }
`;

const CreditSlider = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
`;

const Credit = styled.div`
  display: flex;
  flex-direction: column;
  p {
    text-align: center;
    &:last-child {
      font-style: oblique;
    }
  }
`;

const CreditImg = styled.div`
  height: 200px;
  background-size: cover;
  background-position: center center;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgb(0 0 0 / 25%), 0 10px 10px rgb(0 0 0 / 22%);
`;

function Search() {
  const history = useHistory();
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { data: searchResult } = useQuery<ISearchResult>(
    ["searchResult", keyword],
    () => getMultiSearch(keyword ? keyword : ""),
    {
      enabled: !!keyword,
    }
  );

  const bigMovieMatch = useRouteMatch<{ mediaType: string; movieId: string }>(
    `/:search/:mediaType/:movieId/`
  );

  const { data: currentMovieData } = useQuery<IGetCurrentMovieData>(
    ["currentMovieData", bigMovieMatch?.params.movieId],
    () =>
      getMovieInfo(
        bigMovieMatch ? bigMovieMatch?.params.mediaType : "",
        bigMovieMatch ? bigMovieMatch?.params.movieId : ""
      ),
    {
      enabled: !!bigMovieMatch?.params.movieId,
    }
  );

  const { data: currentMovieCredit } = useQuery<IMovieCredit>(
    ["currentMovieCredit", bigMovieMatch?.params.movieId],
    () =>
      getCreditInfo(
        bigMovieMatch ? bigMovieMatch?.params.mediaType : "",
        bigMovieMatch ? bigMovieMatch?.params.movieId : ""
      ),
    {
      enabled: !!bigMovieMatch?.params.movieId,
    }
  );

  const onBoxClick = (mediaId: number, mediaType: string) => {
    history.push(`/search/${mediaType}/${mediaId}?keyword=${keyword}`);
  };

  const onBoxCloseClick = () => {
    history.goBack();
  };

  const getRuntime = (runtime: number) => {
    if (runtime >= 60) {
      const hour = Math.floor(runtime / 60);
      const min = runtime - 60 * hour;
      return hour + "시간" + min + "분";
    }
    return runtime;
  };

  return (
    <Wrapper>
      <Title>
        <strong>{keyword}</strong>
        {Number(searchResult?.results.length) !== 0
          ? `에 대한 검색 결과입니다.`
          : `에 대한 검색 결과가 없습니다.`}
      </Title>
      <AnimatePresence>
        <List>
          {searchResult?.results.map((movie) => (
            <MovieBox key={"search" + movie.id}>
              <Box
                layoutId={movie.media_type + movie.id}
                whileHover="hover"
                boxbgphoto={makeImagePath(movie.poster_path || "", "w500")}
                variants={boxVariants}
                onClick={() => onBoxClick(movie.id, movie.media_type)}
              >
                <BoxBackground variants={movieInfoBoxVariants}>
                  더보기
                </BoxBackground>
              </Box>
              <MovieInfoBox key={movie.id}>
                <h4>{movie.title ?? movie.name}</h4>
                <h4>개봉일 : {movie.first_air_date ?? movie.release_date}</h4>
                <h4>평점 : {movie.vote_average} 점</h4>
              </MovieInfoBox>
            </MovieBox>
          ))}
        </List>
      </AnimatePresence>

      {bigMovieMatch && (
        <>
          <AnimatePresence>
            <motion.div
              onClick={onBoxCloseClick}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                width: " 100vw",
                height: " 100vh",
                backgroundColor: "rgba(0,0,0,0.2)",
                position: "fixed",
                top: 0,
                opacity: 0,
                zIndex: 10,
                left: 0,
              }}
            ></motion.div>
            <BigMovie
              key={
                bigMovieMatch?.params.mediaType + bigMovieMatch?.params.movieId
              }
              layoutId={
                bigMovieMatch?.params.mediaType + bigMovieMatch?.params.movieId
              }
            >
              {currentMovieData && (
                <>
                  <BigCoverImg
                    style={{
                      backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0)),
                     url(${makeImagePath(
                       currentMovieData?.backdrop_path ??
                         currentMovieData?.poster_path,
                       "w500"
                     )})`,
                    }}
                  >
                    <BigCoverTitle>
                      <h2>
                        {currentMovieData?.title ?? currentMovieData.name}
                      </h2>
                      {currentMovieData?.tagline != "" ? (
                        <MovieInfo>
                          <p>{currentMovieData?.tagline}</p>
                        </MovieInfo>
                      ) : null}
                      {bigMovieMatch?.params.mediaType === "movie" ? (
                        <MovieInfo>
                          <span>{currentMovieData?.release_date}</span>
                          <span>{getRuntime(currentMovieData?.runtime)}</span>
                        </MovieInfo>
                      ) : (
                        <MovieInfo>
                          <span>
                            첫상영일 : {currentMovieData?.first_air_date}
                          </span>
                          <span>
                            시즌 {currentMovieData?.number_of_seasons} 개
                          </span>
                          <span>
                            에피소드 {currentMovieData?.number_of_episodes} 개
                          </span>
                        </MovieInfo>
                      )}

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <MovieGrade>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 576 512"
                            fill="yellow"
                          >
                            <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                          </svg>
                          {Number(currentMovieData?.vote_average).toFixed(1)}
                        </MovieGrade>
                        {currentMovieData?.genres?.map((genres) => (
                          <MovieGenres key={genres.id + ""}>
                            #{genres.name}
                          </MovieGenres>
                        ))}
                      </div>
                    </BigCoverTitle>
                  </BigCoverImg>
                  <BigOverview>
                    <h1>줄거리</h1>
                    <p>{currentMovieData?.overview || "준비중입니다. "}</p>
                    <h1>주요 출연진</h1>
                    <CreditSlider>
                      {currentMovieCredit?.cast
                        .slice(0, 4)
                        .map((actor, index) => (
                          <Credit key={index}>
                            <CreditImg
                              style={{
                                backgroundImage: `url(${makeImagePath(
                                  actor.profile_path || ""
                                )})`,
                              }}
                            />
                            <p>{actor.original_name}</p>
                            <p>{actor.character}</p>
                          </Credit>
                        ))}
                    </CreditSlider>
                  </BigOverview>
                </>
              )}
            </BigMovie>
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Search;
