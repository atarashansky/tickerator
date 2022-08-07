import { Icon } from "@blueprintjs/core";
import { SetterOrUpdater } from "recoil";
import Switch from "react-switch";
import styled from "styled-components";
import { BlueprintIcons_16Id } from "@blueprintjs/icons/lib/esm/generated/16px/blueprint-icons-16"
import { useIsomorphicLayoutEffect as useEffect } from "../../hooks";
const SwitchWrapper = styled.div`
  display: flex;
  flex-direction: row;
`
interface SwitcherProps {
    isA: boolean;
    setIsA: SetterOrUpdater<boolean>;
    labelA: string;
    labelB: string;
    iconA: BlueprintIcons_16Id;
    iconB: BlueprintIcons_16Id;
}
const Switcher = ({isA, setIsA, labelA, labelB, iconA, iconB}: SwitcherProps) => {
  useEffect(()=>{
    const switcher = document.getElementById(`${labelA}:${labelB}-switcher`);
    if (switcher) switcher.remove();
  },[])
    return (
      <SwitchWrapper>
        <div style={{fontWeight: !isA ? "bold" : "normal", paddingRight: 5}}>{labelB}</div>
        <Switch
            id={`${labelA}:${labelB}-switcher`}
            handleDiameter={20}
            height={20}
            width={50}
            style={{height: "100%"}}
            checked={isA}
            onChange={()=>{
                setIsA(!isA);
            }}
            offColor="#419884"
            onColor="#419884"
            uncheckedIcon={<div style={{paddingLeft: 5, paddingTop: 2}}><Icon color="white" icon={iconB}/></div>}
            checkedIcon={<div style={{paddingLeft: 10, paddingTop: 2}}><Icon color="white" icon={iconA}/></div>}
        />
        <div style={{ fontWeight: isA ? "bold" : "normal", paddingLeft: 5}}>{labelA}</div>
      </SwitchWrapper>
    );

}

export default Switcher;