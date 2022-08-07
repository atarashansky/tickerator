export const API_KEY = process.env.REACT_APP_API_KEY;
export const API_BASE = "https://fmpcloud.io/api/v";
export const API_VERSION: {[key: string]: number} = {
    quote: 3,
    "historical-chart/1hour": 3,
    "historical-chart/30min": 3,
    "historical-chart/15min": 3,
    "historical-chart/5min": 3,
    "historical-chart/1min": 3,
};

export const leftSideBarWidth = "15%";
export const infoWidth = "70%";
export const feedWidth = "30%";

export const API_STOCKTWITS_MSG = "https://api.stocktwits.com/api/2/streams/symbol/"