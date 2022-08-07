import { TimeInterval } from "../../atoms";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import Radio from "./Radio";
import User from "../../user";

const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
  justify-content: space-evenly;
`;
const RowWrapper = styled.div`
display: flex;
flex-direction: row;
`;

const Controls = () => {
    const [ timeInterval, setTimeInterval ] = useRecoilState(TimeInterval)
    
    return (
    <>
      <div style={{height: 10}}/>
      <ControlsWrapper>
        <User/>
        <RowWrapper>
          <b style={{paddingRight: 5}}>Time</b>
        <Radio
          timeInterval={timeInterval}
          setTimeInterval={setTimeInterval}
          options={["24hr","1hr","30min","15min","5min","1min"]} 
        />
        </RowWrapper>
      </ControlsWrapper>   
      <div style={{height: 10}}/>
    </>
    );

}

export default Controls;