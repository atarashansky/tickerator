import LeftSideBar from '../LeftSideBar';
import Feed from '../Feed';
import Controls from '../Controls';
import Info from '../Info';
import { RecoilRoot, useRecoilState } from "recoil";
import styled from "styled-components";
import { theme } from '../../theme';
import { ThemeProvider, CssBaseline } from "@material-ui/core";
import { ActiveTickers, ChartHeight } from '../../atoms';
import { Portfolio, TickerOption } from '../../types';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
`;
function App() {

  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Controls/>
        <Container>
          <LeftSideBar/>
          <InfoFeed/>
        </Container>
      </ThemeProvider>
    </RecoilRoot>
  );
}

const InfoFeed = () => {
  const [ activeTickers, _setActiveTickers ] = useRecoilState(ActiveTickers);
  const [ chartHeight, _setChartHeight ] = useRecoilState(ChartHeight);
  let totalChartHeight = 0;
  if (activeTickers) 
    totalChartHeight = Object.entries(chartHeight).reduce((acc, curr) => curr[0] in activeTickers ? acc + curr[1] : acc, 0);
  return (
    <div style={{display: "flex", flexDirection: "column", height: totalChartHeight, width: "100%"}}>
    {activeTickers && activeTickers.map((ticker: TickerOption)=>{
      return (
        <div key={`${ticker.label}-infofeed-wrapper`} style={{display: "flex", flexDirection: "row", paddingBottom: 10}}>
          <Info ticker={ticker}/>
          <Feed ticker={ticker}/>
        </div>                
      );
    })}

  </div>
  );

}

export default App;
