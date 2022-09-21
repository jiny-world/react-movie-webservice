import { useQuery } from "react-query";
import {
  getMovies,
  IGetMoviewsResult,
  getMovieInfo,
  IGetCurrentMovieData,
} from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

const Wrapper = styled.div`
  background-color: black;
  height: 500vh;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 90vh;
  background-color: aqua;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-size: cover;

  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(${(props) => props.bgPhoto});
  // 사진에 검은색 투명도를 설정해서 글씨를 더 잘 보이게 해줌 !
`;

const Title = styled.h1`
  color: white;
  font-size: 70px;
  margin-bottom: 10px;
`;

const Overview = styled.span`
  font-size: 25px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
  margin: 5px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ boxbgphoto: string }>`
  background-color: white;
  height: 150px;
  color: black;
  border-radius: 5px;
  background-image: url(${(props) => props.boxbgphoto});
  background-size: cover;
  background-position: center center;
  &:first-child {
    transform-origin: center left !important;
  }
  &:last-child {
    transform-origin: center right !important;
  }
  position: relative;
`;

const MovieInfoBox = styled(motion.div)`
  background-color: ${(props) => props.theme.black.lighter};
  padding: 5px;
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  color: ${(props) => props.theme.white.lighter};
  border-radius: 0px 0px 5px 5px;
  h4 {
    text-align: center;
    font-size: 15px;
  }
`;

const BigMovie = styled(motion.div)`
  position: fixed;
  width: 35vw;
  min-width: 430px;
  height: 70vh;
  background-color: black;
  top: 100px;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 99;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;
`;

const BigCoverImg = styled.div`
  width: 100%;
  max-height: 30vh;
  height: 30vh;
  background-size: cover;
  background-position: center center;
  position: relative;
`;

const BigCoverTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  font-weight: 700;
  font-size: 40px;
  margin: 10px;
  bottom: 0;
  position: absolute;
`;

const BigOverview = styled.div`
  color: ${(props) => props.theme.white.lighter};
  margin: 10px;
  position: relative;
`;

const rowVariants = {
  hidden: {
    x: window.innerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.innerWidth - 5,
  },
};

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

const offset = 6;

function Home() {
  const history = useHistory();

  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const { data, isLoading } = useQuery<IGetMoviewsResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const { data: currentMovieData, isLoading: setcrurentMovieData } =
    useQuery<IGetCurrentMovieData>(
      ["currentMovieData", bigMovieMatch?.params.movieId],
      () => getMovieInfo(bigMovieMatch ? bigMovieMatch?.params.movieId : "")
    );

  console.log(currentMovieData);

  const [sliderIndex, setSliderIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = data.results.length - 1;
      const maxPage = Math.floor(totalMovies / offset);
      setSliderIndex((prev) => (prev === maxPage ? 0 : prev + 1));
    }
  };
  const onBoxClick = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };

  const onBoxCloseClick = () => {
    history.push(`/`);
  };

  const clickedBigMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId
    );

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader> Loading ... </Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>
              {data?.results[0].overview == ""
                ? `this movie overview is null`
                : data?.results[0].overview}
            </Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                key={sliderIndex}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * sliderIndex, offset * sliderIndex + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      onClick={() => onBoxClick(movie.id)}
                      variants={boxVariants}
                      whileHover="hover"
                      key={movie.id}
                      boxbgphoto={makeImagePath(
                        movie.backdrop_path || "",
                        "w500"
                      )}
                    >
                      <MovieInfoBox variants={movieInfoBoxVariants}>
                        <h4>{movie.title}</h4>
                      </MovieInfoBox>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          {bigMovieMatch && (
            <AnimatePresence>
              <>
                <motion.div
                  onClick={onBoxCloseClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    width: " 100vw",
                    height: " 100vh",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    position: "fixed",
                    top: 0,
                    opacity: 0,
                  }}
                ></motion.div>
                <BigMovie layoutId={bigMovieMatch.params.movieId}>
                  {clickedBigMovie && (
                    <>
                      <BigCoverImg
                        style={{
                          backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0)), url(${makeImagePath(
                            clickedBigMovie.backdrop_path,
                            "w400"
                          )})`,
                        }}
                      >
                        <BigCoverTitle>
                          {currentMovieData?.original_title}
                        </BigCoverTitle>
                      </BigCoverImg>
                      <BigOverview>
                        <p>{currentMovieData?.overview}</p>
                        <p>
                          {Number(currentMovieData?.vote_average).toFixed(1)}
                        </p>
                      </BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            </AnimatePresence>
          )}
        </>
      )}
    </Wrapper>
  );
}

export default Home;
