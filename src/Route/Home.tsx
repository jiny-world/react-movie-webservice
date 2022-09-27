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
import { WatchTypes } from "../utils";
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

  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2)),
    url(${(props) => props.bgPhoto});
  // 사진에 검은색 투명도를 설정해서 글씨를 더 잘 보이게 해줌 !
`;

const Title = styled.h1`
  color: white;
  font-size: 50px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const Overview = styled.span`
  font-size: 18px;
  width: 30%;
  min-width: 420px;
`;

function Home() {
  const watchType = WatchTypes.movie;
  const { data, isLoading } = useQuery<IGetMoviewsResult>(
    [watchType, "nowPlaying"],
    () => getMovies(watchType, SliderTypes.nowPlaying)
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
          <Slider watchType={watchType} type={SliderTypes.nowPlaying}></Slider>
          <Slider watchType={watchType} type={SliderTypes.popular}></Slider>
          <Slider watchType={watchType} type={SliderTypes.topRated}></Slider>
          <Slider watchType={watchType} type={SliderTypes.upcoming}></Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
