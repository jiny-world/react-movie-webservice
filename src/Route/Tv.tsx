import { useQuery } from "react-query";
import { getMovies, IGetMoviewsResult } from "../api";
import styled from "styled-components";
import { makeImagePath, SliderTypes, WatchTypes } from "../utils";
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
function Tv() {
  const watchType = WatchTypes.tv;
  const { data, isLoading } = useQuery<IGetMoviewsResult>(
    [watchType, "popular"],
    () => getMovies(watchType, SliderTypes.popular)
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader> Loading ... </Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].name}</Title>
            <Overview>
              {data?.results[0].overview == ""
                ? `this movie overview is null`
                : data?.results[0].overview}
            </Overview>
          </Banner>
          <Slider watchType={watchType} type={SliderTypes.popular}></Slider>
          <Slider watchType={watchType} type={SliderTypes.topRated}></Slider>
          <Slider watchType={watchType} type={SliderTypes.onTheAir}></Slider>
          <Slider watchType={watchType} type={SliderTypes.airingToday}></Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
