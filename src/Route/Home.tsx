import { useQuery } from "react-query";
import {
  getMovies,
  IGetMoviewsResult,
  getMovieInfo,
  IGetCurrentMovieData,
} from "../api";
import styled from "styled-components";
import { makeImagePath, SliderTypes } from "../utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import Slider from "../Components/Slider";

const Wrapper = styled.div`
  background-color: black;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 85vh;
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

interface IRowVariantsCustom {
  isBack: boolean;
}

function Home() {
  const history = useHistory();

  const { data, isLoading } = useQuery<IGetMoviewsResult>(
    ["movies", "nowPlaying"],
    () => getMovies(SliderTypes.nowPlaying)
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader> Loading ... </Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>
              {data?.results[0].overview == ""
                ? `this movie overview is null`
                : data?.results[0].overview}
            </Overview>
          </Banner>
          <Slider type={SliderTypes.nowPlaying}></Slider>
          <Slider type={SliderTypes.popular}></Slider>
          <Slider type={SliderTypes.topRated}></Slider>
          <Slider type={SliderTypes.upcoming}></Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
