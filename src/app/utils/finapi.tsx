import axios from "axios";
const BASE_URL = "https://finnhub.io/api/v1";
export const getStockPrice = async (symbol: any) => {
  try {
    const response = await axios.get(`${BASE_URL}/quote`, {
      params: {
        symbol: symbol,
        token: process.env.NEXT_PUBLIC_KEY,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Invalid stock symbol or API error");
  }
};
