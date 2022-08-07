import { feedWidth } from "../../globals";
import { useInterval } from "../../hooks";
import { API_STOCKTWITS_MSG } from "../../globals";
import { useRecoilState } from "recoil";
import { ChartHeight } from "../../atoms";
import { useState, useMemo } from "react";
import { JSONObject, TickerOption } from "../../types";
import styled from "styled-components";
import theme from "../../theme";
import styles from './index.module.css';
import parse from "html-react-parser";

const FeedWrapper = styled.div`
    padding-right: 5;
    padding-left: 5;
    text-align: left;
    font-size: 12;
    background-color: white;
    color: black;
    overflow-y: scroll;
    overflow-x: hidden;
    overflow-wrap: break-word;
    padding-top: 30;   
`;
function decodeHtml(html: string, symbols: string[], user: string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    const val = colorUser(colorSymbols(linkify(txt.value),symbols),user);
    txt.remove();
    return val;
}

function linkify(inputText: string) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText;
}

function colorSymbols(inputText: string, symbols: string[]) {
    let text = inputText;
    for (const symbol of symbols) {
        text = text.replace(`$${symbol}`,
            `<strong class=${styles["symbol"]}>$${symbol}</strong>`    
        )
    }
    return text;
}
function colorUser(inputText: string, user: string) {
    const text = inputText.replace(`@${user}`,
        `<strong class=${styles["user"]}>@${user}</strong>`    
    )
    return text;
}

// TODO: put trending bar above chart?
interface FeedProps {
    ticker: TickerOption;
}

const Feed = ({ticker}: FeedProps) => {
    const [feed,setFeed] = useState<JSONObject[]>([]);
    const [chartHeight, _setChartHeight] = useRecoilState(ChartHeight);
    const [tickerLabel, setTickerLabel] = useState(ticker.label);

    const updateChart = async () => {
        let label = ticker.label;
        if (!label) {
            return;
        }
        if (ticker.isCrypto) {
            label=label.replace("USD",".X")
        }
        setTickerLabel(label);        
        fetch(`${API_STOCKTWITS_MSG}${label}.json`).then(async (response: Response) => {
            if (response.ok) {
                const result = await response.json();
                setFeed(result.messages)
            } else {
                setFeed([])
            }
        })
    }
    useMemo(async ()=>{
        updateChart();
    }, [ticker])
        
    useInterval(async ()=>{
        await updateChart();
      },10000);

    let width = document.getElementById(`feed-wrapper-${ticker.label}-${ticker.value}`)?.clientWidth;
    if (width) width = width - 54
    return (              
        <div id={`feed-wrapper-${ticker.label}-${ticker.value}`} style={{display: "flex", flexDirection: "column", width: feedWidth, paddingLeft: 5, paddingRight: 5}}>
        <div style={{
            color: "white",
            textAlign: "center",
            backgroundColor: theme.palette.background.default
        }}>
            <b>
                {ticker.label ? `${tickerLabel} - Stocktwits Feed` : "Stocktwits Feed"}
            </b>
        </div>            
        <FeedWrapper
            style={{
                height: chartHeight[ticker.label],
                width: "100%"
            }} 
        >

            {feed.map((entry: any)=>{
                const sent = entry.entities?.sentiment?.basic;
                const sentColor = sent==="Bullish" ? "#20bb79" : "#ff4f4d";
                const backgroundSentColor = sent==="Bullish" ? "#e5f7f0" : "#ffeceb";
                return  (<div className={styles["twitter-tweet"]} key={entry.id}>
                    {/* USERINFO */}
                    <div style={{height: 10, width: width}}/>
                    <p>
                        <img src={entry.user.avatar_url} height="25px" width="25px"/>
                        <span style={{paddingLeft: 10, display: "table-cell", verticalAlign: "middle", paddingBottom: 5}}>
                        {entry.user.name}
                        </span>                     
                    </p>
                    {sent && <b style={{paddingLeft: 5, color: sentColor, textAlign: "right", display: "block"
                            }}><span style={{backgroundColor: backgroundSentColor, borderRadius: 100, paddingLeft: 5, paddingRight: 5, paddingTop: 2, paddingBottom: 2}}>{sent}</span></b>}
                    {/* TIME */}
                    <b>{`${(new Date(entry.created_at)).toLocaleString()}`}</b>
                    <br/>
                    {/* BODY */}
                    {parse(decodeHtml(entry.body, [tickerLabel], entry.user.name))}
                    {/* entry.symbols.map((item: any)=>item.symbol) */}
                    {/* SYMBOLS */}
                </div>)
            })}
        </FeedWrapper>
        </div>
    );

}

export default Feed;