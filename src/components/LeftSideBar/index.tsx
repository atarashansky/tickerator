import { useRecoilState } from "recoil";
import { leftSideBarWidth } from "../../globals";
import { ActiveTickers, AllStockTickers, PortfolioTickers, UserEmail, ChartHeight } from "../../atoms";
import Select from "react-select";
import { fetchQuery } from "../../api";
import { useMemo } from "react";
import { TickerOption } from "../../types";
import { Icon } from "@blueprintjs/core";
import styles from './index.module.css';
import User, { setUserDoc } from "../../user";
// add filter to left side bar (e.g. stock exchange)
// add list of selected tickers, change "Ticker" to an array.

const customStyles = {
    menuList:(provided:any) => ({
        ...provided,
        color:'#000000',
    }),
}

const LeftSideBar = () => {

    const [portfolioTickers, setPortfolioTickers ] = useRecoilState(PortfolioTickers)
    const [allStockTicks, setAllStockTickers] = useRecoilState(AllStockTickers)
    const [ email, _setEmail ] = useRecoilState(UserEmail);

    useMemo(async ()=>{
        const stocks = await fetchQuery("available-traded","list?");
        const crypto = await fetchQuery("symbol","available-cryptocurrencies?");
        let allOptions: TickerOption[] = [];
        for (const opts of [[stocks, false], [crypto, true]]) {
            const [choice, iscrypto] = opts;
            const options = choice.map((i: any)=>{
                return {label: i.symbol, value: i.name, isCrypto: iscrypto};
            })
            options.sort(function(a: TickerOption, b: TickerOption) {
                if (a.label < b.label) return -1;
                if (a.label > b.label) return 1;
                return 0;
              });
            allOptions = allOptions.concat(options)
        }
        setAllStockTickers(allOptions);
    }, [])
    return (
        <div style={{display: "flex", flexDirection: "column", width: leftSideBarWidth, paddingRight: 5, paddingLeft: 5}}>  
            <b> {`Selected Symbols`}</b>              
            {allStockTicks && <Select
                styles={customStyles}
                options={allStockTicks}
                filterOption={(option,input) => {
                    const inPortfolio = portfolioTickers?.find((i: TickerOption)=>i.label === option.label);
                    return input==="" ? false : !inPortfolio && option.label.toLowerCase().startsWith(input.toLowerCase());
                    
                }}
                controlShouldRenderValue={false}
                onChange={(newValue)=>{
                    if (newValue) {
                        const ticks = portfolioTickers ? portfolioTickers : [];
                        const newPortfolioTickers = [...ticks, newValue];
                        setPortfolioTickers(newPortfolioTickers);
                        setUserDoc(email, newPortfolioTickers);
                    }
                }}
            />}
            {portfolioTickers && portfolioTickers.map((ticker: TickerOption)=>{
                return (
                    <Symbol
                        key={ticker.value}
                        ticker={ticker}
                        deleteSymbol={(ticker: TickerOption)=>{
                            const newPortfolioTickers = portfolioTickers.filter((t: TickerOption)=>{
                                return t.label !== ticker.label;
                            })
                            setPortfolioTickers(newPortfolioTickers.length > 0 ? newPortfolioTickers : null);
                            setUserDoc(email, newPortfolioTickers ? newPortfolioTickers : []);
                        }}

                    />
                )
            })}
        </div>
    );

}

interface SymbolProps {
    ticker: TickerOption;
    deleteSymbol: (ticker: TickerOption) => void;
}
const Symbol = ({ticker, deleteSymbol}: SymbolProps) => {
    const [activeTickers, setActiveTickers ] = useRecoilState(ActiveTickers)
    const [ chartHeight, setChartHeight ] = useRecoilState(ChartHeight);
    const list = activeTickers?.filter((t: TickerOption)=>{
        return t.label !== ticker.label;
    }) ?? [];
    const isActive = list.length !== (activeTickers?.length ?? 0);
    return (
        <div style={{display: "flex", flexDirection: "row", textAlign: "left"}}>
            <div
                className={styles.deleter}
                onClick={()=>{
                    deleteSymbol(ticker);
                }}
            >
                <Icon size={12} icon="trash" />
            </div>
            <div className={styles.wrapper}>
            <div
                className={styles.clickable}
                style={{backgroundColor: isActive ? "#182335" : undefined}}
                onClick={()=>{
                    if (!isActive) {
                        const chartHeightNew = {...chartHeight};
                        if (!(ticker.label in chartHeight)) {
                            chartHeightNew[ticker.label] = 500;
                            setChartHeight(chartHeightNew);
                        }
                        setActiveTickers(list.concat([ticker]));
                    }
                    else {
                        setActiveTickers(list.length > 0 ? list : null);
                    }
                }}
            >
                {ticker.label}
            </div>
            </div>
        </div>
    );
}

export default LeftSideBar;