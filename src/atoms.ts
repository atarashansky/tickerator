import { atom, RecoilState } from "recoil";
import { TickerOption } from "./types";

export const ActiveTickers = atom<TickerOption[] | null>({
    key: "ActiveTickers",
    default: null,
})

export const AllStockTickers = atom<TickerOption[] | null>({
    key: "StockTickers",
    default: null
})

export const PriceChartCache = atom({
    key: "PriceChartCache",
    default: {}
})

export const PortfolioTickers = atom<TickerOption[] | null>({
    key: "PortfolioTickers",
    default: null
})

export const ChartHeight: RecoilState<{[key: string]: number}> = atom({
    key: "ChartHeight",
    default: {"": 500} as {[key: string]: number}
})

export const TimeInterval = atom({
    key: "TimeInterval",
    default: "15min"
})

export const UserEmail = atom({
    key: "UserEmail",
    default: ""
})