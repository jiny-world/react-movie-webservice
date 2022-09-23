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
import { makeImagePath } from "../utils";

const SliderRow = styled.div`
  position: relative;
  top: -100px;
  margin: 20px;
  height: 200px;
`;

const SliderHeader = styled.span`
  font-size: 30px;
  margin-bottom: 5px;
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
function Slider() {
  const history = useHistory();

  const { data, isLoading } = useQuery<IGetMoviewsResult>(
    ["movies", "nowPlaying"],
    getMovies
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
    history.push(`/movies/${movieId}`);
  };
  return (
    <>
      <SliderRow>
        <SliderHeader>Now Playing</SliderHeader>
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
            custom={{ isBack }}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.8 }}
            key={sliderIndex}
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
                  boxbgphoto={makeImagePath(movie.backdrop_path || "", "w500")}
                >
                  <MovieInfoBox variants={movieInfoBoxVariants}>
                    <h4>{movie.title}</h4>
                  </MovieInfoBox>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
      </SliderRow>
    </>
  );
}

export default Slider;
