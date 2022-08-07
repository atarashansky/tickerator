import { useState, useRef, useMemo} from "react";
import { infoWidth } from "../../globals";
import { fetchQuery } from "../../api";
import { useInterval } from "../../hooks";
import { CandlestickData, createChart, CrosshairMode, IChartApi, UTCTimestamp } from 'lightweight-charts';
import { useIsomorphicLayoutEffect as useEffect } from "../../hooks";
import { ChartHeight, PriceChartCache, TimeInterval } from "../../atoms";
import { useRecoilState, useSetRecoilState } from "recoil";
import { FetchCache, TickerOption } from "../../types";

interface InfoProps {
  ticker: TickerOption;
}
const Info = ({ticker}: InfoProps) => {
    const [ priceChartCache, setPriceChartCache ] = useRecoilState(PriceChartCache)
    const [ timeInterval, _setTimeInterval ] = useRecoilState(TimeInterval)
    const [ chartHeightRecoil, setChartHeightRecoil ] = useRecoilState(ChartHeight);

    const [chart,setChart] = useState<IChartApi>();
    const [data,setData] = useState<CandlestickData[]>(); 
    const [ chartHeight, setChartHeight ] = useState(chartHeightRecoil[ticker.label] ?? 500);
    const [ chartWidth, setChartWidth ] = useState(0);
    const isDaily = timeInterval === "24hr";
    const query = isDaily ? "historical-price-full" : `historical-chart/${timeInterval.replace("hr","hour")}`;
    const arg = isDaily ? `${ticker.label}?timeseries=3650&` : `${ticker.label}?`;
    const updateChartHistorical = async (useCache=true) => {
      if (!ticker.label) return
      let r;
      const key = `${query}:${arg}`;
      const cache = priceChartCache as FetchCache;
      if (key in priceChartCache && useCache) {
        r = cache[key]
      } else {
        r = await fetchQuery(query,arg);
        const { [key]: curr, ...newCache} = cache;
        newCache[key]=r;
        setPriceChartCache(newCache);          
      }
      
      
      let result;
      if (isDaily) {
        const { historical: res } = r;
        result=res;
      } else {
        result = r;
      }
      const data = result.map((d: any)=>{
          const { date, volume, ...dsub} = d;
          return {...dsub, time: Math.floor(new Date(date).getTime()/1000) as UTCTimestamp}
      });      
      data.reverse();
      setData(data);  

    }


    useMemo(async ()=>{
      await updateChartHistorical();
    }, [ticker, timeInterval])

    useInterval(async ()=>{
      await updateChartHistorical(false);
    },5000);


    const resizeObserver = useRef<ResizeObserver>();

    const firstDataPoint = JSON.stringify(data?.at(0));
    const lastDataPoint = JSON.stringify(data?.at(-1));
    const memoizer = `${firstDataPoint}:${lastDataPoint}:${query}:${arg}`

    useEffect(() => {
      const container = document.getElementById(`chart-wrapper-${ticker.label}-${ticker.value}`);
      if (!container || !data) return;
      const chart = createChart(container, {
        width: container.clientWidth,
        height: container.clientHeight,
        layout: {
          backgroundColor: '#253248',
          textColor: 'rgba(255, 255, 255, 0.9)',
        },
        grid: {
          vertLines: {
            color: '#334158',
          },
          horzLines: {
            color: '#334158',
          },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
        },
        timeScale: {
          borderColor: '#485c7b',
        },
      });
  
      const candleSeries = chart.addCandlestickSeries({
        upColor: '#4bffb5',
        downColor: '#ff4976',
        borderDownColor: '#ff4976',
        borderUpColor: '#4bffb5',
        wickDownColor: '#838ca1',
        wickUpColor: '#838ca1',
      });
      candleSeries.setData(data);
      chart.applyOptions({
        timeScale: {
          timeVisible: !isDaily,
        },
      })
    //   const areaSeries = chart.addAreaSeries({
    //     topColor: 'rgba(38,198,218, 0.56)',
    //     bottomColor: 'rgba(38,198,218, 0.04)',
    //     lineColor: 'rgba(38,198,218, 1)',
    //     lineWidth: 2
    //   });
  
    //   areaSeries.setData(areaData);
  
    //   const volumeSeries = chart.addHistogramSeries({
    //     color: '#182233',
    //     priceFormat: {
    //       type: 'volume',
    //     },
    //     scaleMargins: {
    //       top: 0.8,
    //       bottom: 0,
    //     },
    //   });
  
    //   volumeSeries.setData(volumeData);
      setChart(chart)
      return ()=>{
        chart.remove();
        setChart(undefined);
      }
    }, [memoizer, chartHeight, chartWidth, isDaily]);
  
    //Resize chart on container resizes.
    useEffect(() => {
      const { [ticker.label]: curr, ...chartHeightRecoilNew} = chartHeightRecoil;
      if (curr === chartHeight) return;
      chartHeightRecoilNew[ticker.label]=chartHeight;
      setChartHeightRecoil(chartHeightRecoilNew);
    }, [chartHeight, chartHeightRecoil]);

    useEffect(() => {
      const chartContainer = document.getElementById(`chart-wrapper-${ticker.label}-${ticker.value}`);
      resizeObserver.current = new ResizeObserver(entries => {
        const { width, height } = entries[0].contentRect;

        if (Math.abs(height - chartHeight)>1 || (Math.abs(width-chartWidth) > 1 && chartWidth!==0)) {
          setChartHeight(height);
          setChartWidth(width);
          setTimeout(() => {
            chart?.timeScale().fitContent();
          }, 0);
  
        }
      });
      if (!chartContainer) return;
      resizeObserver.current.observe(chartContainer);
      return () => resizeObserver.current?.disconnect();
    }, []);
    
    return (
        <div style={{display: "flex", flexDirection: "column", width: infoWidth}}>
            <b> {ticker.label ? `${ticker.label} - ${ticker.value}` : "Symbol - Name"}</b>        
            <div style={{
              position: "relative",
              resize: "vertical",
              height: chartHeight,
              overflow: "auto",
              border:"0.5px solid white"
            }} id={`chart-wrapper-${ticker.label}-${ticker.value}`}/>
        </div>
    );

}

export default Info;