import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import {
  getMovies,
  IGetMoviewsResult,
  getMovieInfo,
  IGetCurrentMovieData,
} from "../api";
import { makeImagePath, SliderTypes, WatchTypes } from "../utils";

const SliderRow = styled.div`
  position: relative;
  margin: 20px;
  height: 200px;
  margin-bottom: 100px;
`;

const SliderHeader = styled.span`
  font-size: 30px;
  margin-bottom: 10px;
  font-weight: 700;
`;

const SliderButton = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  svg {
    z-index: 2;
    cursor: pointer;
    width: 50px;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    &:hover {
      background-color: rgba(0, 0, 0, 0.8);
    }
  }
`;
const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
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
const Box = styled(motion.div)<{ boxbgphoto: string }>`
  background-color: white;
  height: 200px;
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
const BigMovie = styled(motion.div)`
  position: fixed;
  width: 45vw;
  min-width: 380px;
  height: 80vh;
  background-color: ${(props) => props.theme.black.lighter};
  z-index: 99;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;
  top: 10vh;
  margin: 0 auto;
  left: 0;
  right: 0;
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

interface IRowVariantsCustom {
  isBack: boolean;
}

const rowVariants = {
  hidden: ({ isBack }: IRowVariantsCustom) => ({
    x: isBack ? -window.innerWidth - 5 : window.innerWidth + 5,
    opacity: 0,
  }),

  visible: {
    x: 0,
    opacity: 1,
  },
  exit: ({ isBack }: IRowVariantsCustom) => ({
    x: isBack ? window.innerWidth + 5 : -window.innerWidth - 5,
    opacity: 0,
  }),
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
    opacity: 0.7,
    transition: {
      delay: 0.3,
    },
  },
};
function Slider({
  watchType,
  type,
}: {
  watchType: WatchTypes;
  type: SliderTypes;
}) {
  const history = useHistory();
  const { data, isLoading } = useQuery<IGetMoviewsResult>(
    [watchType, type],
    () => getMovies(watchType, type)
  );
  const bigMovieMatch = useRouteMatch<{
    watchType: string;
    movieId: string;
    types: string;
  }>(`/:watchType/:types/:movieId`);
  const { data: currentMovieData } = useQuery<IGetCurrentMovieData>(
    ["currentMovieData", bigMovieMatch?.params.movieId],
    () =>
      getMovieInfo(
        watchType,
        bigMovieMatch ? bigMovieMatch?.params.movieId : ""
      )
  );

  const offset = 6;
  const decreaseIndex = () => {
    if (data) {
      setIsBack(true);

      if (leaving) return;
      setLeaving(true);

      const totalMovies = data.results.length - 1;
      const maxPage = Math.floor(totalMovies / offset);
      setSliderIndex((prev) => (prev === 0 ? maxPage : prev - 1));
    }
  };

  const increaseIndex = () => {
    if (data) {
      setIsBack(false);

      if (leaving) return;
      setLeaving(true);

      const totalMovies = data.results.length - 1;
      const maxPage = Math.floor(totalMovies / offset);
      setSliderIndex((prev) => (prev === maxPage ? 0 : prev + 1));
    }
  };

  const [sliderIndex, setSliderIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [isBack, setIsBack] = useState(false);

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };
  const onBoxClick = (movieId: number) => {
    history.push(`/${watchType}/${type}/${movieId}`);
  };

  const onBoxCloseClick = () => {
    history.push(`/${watchType}`);
  };

  return (
    <>
      <SliderRow>
        <SliderHeader>
          {type === SliderTypes.nowPlaying
            ? "Now Playing"
            : type === SliderTypes.topRated
            ? "Top Rate"
            : type === SliderTypes.popular
            ? "Popular"
            : type === SliderTypes.upcoming
            ? "Upcoming"
            : type === SliderTypes.onTheAir
            ? "On Air"
            : type === SliderTypes.airingToday
            ? "Airing Today"
            : ""}
        </SliderHeader>
        <SliderButton>
          <motion.svg
            onClick={decreaseIndex}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
          >
            <path
              fill="white"
              d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 278.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
            />
          </motion.svg>
          <svg
            onClick={increaseIndex}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
          >
            <path
              fill="white"
              d="M342.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
            />
          </svg>
        </SliderButton>
        <AnimatePresence
          initial={false}
          onExitComplete={toggleLeaving}
          custom={{ isBack }}
        >
          <Row
            key={type + sliderIndex}
            custom={{ isBack }}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.8 }}
          >
            {data?.results
              .slice(1)
              .slice(offset * sliderIndex, offset * sliderIndex + offset)
              .map((movie) => (
                <Box
                  layoutId={type + movie.id}
                  key={type + movie.id}
                  onClick={() => onBoxClick(movie.id)}
                  variants={boxVariants}
                  whileHover="hover"
                  boxbgphoto={makeImagePath(movie.backdrop_path || "", "w500")}
                >
                  <MovieInfoBox variants={movieInfoBoxVariants}>
                    <h4>{movie.title ?? movie.name}</h4>
                  </MovieInfoBox>
                </Box>
              ))}
          </Row>
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
                  backgroundColor: "rgba(0,0,0,0.5)",
                  position: "fixed",
                  top: 0,
                  opacity: 0,
                  zIndex: 3,
                  left: 0,
                }}
              ></motion.div>
              <BigMovie
                layoutId={
                  bigMovieMatch?.params.types + bigMovieMatch?.params.movieId
                }
              >
                {currentMovieData && (
                  <>
                    <BigCoverImg
                      style={{
                        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0)),
                     url(${makeImagePath(
                       currentMovieData?.backdrop_path,
                       "w400"
                     )})`,
                      }}
                    >
                      <BigCoverTitle>
                        {currentMovieData?.original_title ??
                          currentMovieData.original_name}
                      </BigCoverTitle>
                    </BigCoverImg>
                    <BigOverview>
                      <p>
                        {currentMovieData?.overview
                          ? currentMovieData?.overview.slice(0, 310) + " ..."
                          : "This movie overview is null "}
                      </p>
                      <p>{Number(currentMovieData?.vote_average).toFixed(1)}</p>
                    </BigOverview>
                  </>
                )}
              </BigMovie>
            </AnimatePresence>
          </>
        )}
      </SliderRow>
    </>
  );
}

export default Slider;
