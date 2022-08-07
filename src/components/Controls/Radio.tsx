import { RadioGroup } from "@blueprintjs/core";
import { SetterOrUpdater } from "recoil";
import styled from "styled-components";

const RadioWrapper = styled.div`
  display: flex;
  flex-direction: row;
`
interface RadioProps {
  options: string[];
  setTimeInterval: SetterOrUpdater<string>;
  timeInterval: string;
}
const Radio = ({options, timeInterval, setTimeInterval}: RadioProps) => {
    return (
      <RadioWrapper>
        <RadioGroup
          options={options.map((i)=>({label: i, value: i}))}
          selectedValue={timeInterval}
          onChange={(v)=>{
            const val = (v.target as HTMLInputElement).value
            setTimeInterval(val);
          }}
        >
        </RadioGroup>
      </RadioWrapper>
    );

}

export default Radio;