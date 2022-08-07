import { RecoilState } from "recoil";

export type JSONValue =
    | string
    | number
    | boolean
    | JSONObject
    | Array<JSONValue>;

export interface JSONObject { 
    [key: string]: JSONValue 
}

export interface TickerOption {
    label: string;
    value: string;
    isCrypto: boolean;
}

export interface FetchCache {
    [key: string]: Array<JSONObject>
}

export type Portfolio = RecoilState<TickerOption[]> | RecoilState<null>;
