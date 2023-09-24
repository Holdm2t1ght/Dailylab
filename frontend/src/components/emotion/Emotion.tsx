import { useEffect, useRef, useState } from "react";
import EmotionMatter from "./EmotionMatter";
import { getEmotionList } from "@/api/Emotion";
import { EmotionType } from "@/type/EmotionType";
import { Player } from '@lottiefiles/react-lottie-player';

const Emotion = () => {
    const playerRef = useRef<Player | null>(null);
    const handlePlay = () => playerRef.current?.play();
//  const handleStop = () => playerRef.current.stop();
    const handlePause = () => playerRef.current?.pause();

    const [circleCount, setCircleCount] = useState(0);
    const [emotionNo, setEmotionNo] = useState(1); // 이 부분에 emotionNo를 추가하고 초기값을 설정합니다.
    const [emotionName, setEmotionName] = useState(""); // 이 부분에 emotionNo를 추가하고 초기값을 설정합니다.
    const [emotionType, setEmotionType] = useState(""); // 이 부분에 emotionNo를 추가하고 초기값을 설정합니다.
    const [emotionList, setEmotionList] = useState<EmotionType[]>([]);
    
    const handleButtonClick = () => {
      setCircleCount(prevCount => prevCount + 1);
    };
  
    const onEmotionClick = (emoId: number, name: string, type: string) => {
      setEmotionNo(emoId); // 버튼 클릭 시 emotionNo를 변경합니다.
      setEmotionName(name);
      setEmotionType(type);
      void handleButtonClick();
      handlePlay();
      setTimeout(() => {
        handlePause(); // 1초 뒤에 handlePause 실행
      }, 300); 
    };

    const getList = async () => {
        await getEmotionList(({data}) => {
            console.log(data)
            setEmotionList(data.data as EmotionType[])
        }, (error) => {console.log(error)});
    };

    useEffect(() => {
        void getList();
    }, []);
  
    return (
      <div className="">
        <div className="absolute top-[100px] left-[calc(50%-150px)] h-[230px]">
            {/* lottie 시험하기 */}
            <Player
            src="./assets/lottie/sample.json"
            className="players"
            // loop
            // autoplay
            style={{ height: '200px', width: '300px' }}
            ref={playerRef}
            />
            <div className="text-center font-semibold text-3xl">
                {circleCount === 0 ? (
                    <p className="mb-24 w-[300px] h-[40px]">오늘은 어떤 기분이신가요?</p>
                ) : (
                    <p className="mb-24 w-[300px] h-[40px]">이 감정은... {emotionName}!<br/> {emotionType === 'n' ? "안좋은 감정은 제가 대신 가져갈게요!" : "저까지 기분이 좋아지네요!"}</p>
                )}
                <div className="relative mb-[250px]">
                    <img className="absolute left-1/2 mb-24 transform -translate-x-1/2 w-[150px]" src="./assets/img/character/cloe_noface.png" alt="클로에" />
                    <img className="absolute left-1/2 transform mt-[20px] -translate-x-1/2 w-[100px]" src={circleCount === 0 ? `./assets/img/emotion/face/100.png` : `./assets/img/emotion/face/${emotionNo}.png`} alt="표정" />
                </div>
            </div>
        </div>
        <div className="absolute top-[400px] left-[calc(50%-160px)] max-h-[300px] h-[calc(100%-500px)] overflow-y-auto w-[320px] bg_contents_con p-[20px] child-[button]:w-[40px] child-[button]:m-3 ">
            {emotionList.length > 0 && emotionList.map((emo, index) => (
            <button className="transition-transform duration-300 ease-in-out active:scale-125 webkit-tap-highlight-color" key={index} onClick={() => {onEmotionClick(emo.emotionId, emo.name, emo.type)}}>
                <img src={`./assets/img/emotion/${emo.emotionId}.png`} alt={emo.name} />
                <p className="font-light text-xl p-2 text-text">{emo.name}</p>
            </button>
            ))}
        </div>
        <div>
            <EmotionMatter circleCount={circleCount} emotionNo={emotionNo} />
        </div>
      </div>
    );
  };
  
  export default Emotion;
  