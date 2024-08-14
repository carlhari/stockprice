"use client";
import { getStockPrice } from "@/app/utils/finapi";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BarChart, CandleChart, LineChart, PieChart } from "./components/chart";
import moment from "moment";
import { FaSearch } from "react-icons/fa";

export default function Home() {
  const [symbol, setSymbol] = useState<string>("");
  const [stockData, setStockData] = useState<any>(null);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);

  const fetchStockData = async (symbol: string) => {
    const loadingId = toast.loading("Loading...");
    try {
      if (symbol && symbol.trim() !== "") {
        const data = await getStockPrice(symbol);

        if (data && data.c !== undefined && data.c !== 0) {
          setStockData(data);
        } else {
          toast.error("Stock symbol not found or invalid.");
          setStockData(null);
          setIsPolling(false);
        }
      } else {
        toast.error("Please enter a valid stock symbol.");
        setStockData(null);
        setIsPolling(false);
      }
    } catch (err: any) {
      toast.error("Error fetching stock data. Please try again.");
      console.error(err.message);
      setStockData(null);
      setIsPolling(false);
    } finally {
      toast.dismiss(loadingId);
    }
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShow(false);
    if (symbol && symbol.trim() !== "") {
      fetchStockData(symbol);
      setIsPolling(true);
    }
  };

  useEffect(() => {
    let intervalId: any = null;

    if (isPolling) {
      intervalId = setInterval(() => {
        if (symbol) {
          fetchStockData(symbol);
        }
      }, 10000); // Poll every 10 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [symbol, isPolling]);

  const handleShow = () => {
    setShow(!show);
  };

  return (
    <div className="w-full p-4">
      <Toaster />
      <div className="w-full text-center text-black font-semibold text-4xl p-1">
        Stock Price Application
      </div>
      <form
        onSubmit={handleSearch}
        className="flex items-center justify-center gap-2"
      >
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          className="text-xl rounded-lg px-2 w-[20%] xl:w-[50%]"
          placeholder="Enter stock symbol (e.g., AAPL)"
          required
        />

        <button type="submit" className="text-2xl">
          <FaSearch />
        </button>
      </form>

      <div className="w-full flex items-center justify-center my-4">
        <button
          className="bg-white rounded-md px-1 text-lg"
          onClick={() => handleShow()}
        >
          {!show ? "Click to show Static Data" : "Hide Static Data"}
        </button>
      </div>

      {stockData && show === false && (
        <div className="w-full h-full flex gap-2 2xl:flex-col">
          <div className="w-[20%] flex items-center justify-between flex-col gap-2 2xl:w-full">
            <div className="w-full h-full text-lg font-semibold bg-white shadow-xl rounded-xl p-10 flex text-justify items-start justify-center flex-col">
              <p>Current Symbol: {symbol}</p>
              <p>Current Price: {stockData.c}</p>
              <p>Change: {stockData.d}</p>
              <p>Percent Change: {stockData.dp}</p>
              <p>High: {stockData.h}</p>
              <p>Low: {stockData.l}</p>
              <p>Open: {stockData.o}</p>
              <p>Previous Close: {stockData.pc}</p>
              <p>Time: {moment().format("MMMM D, YYYY h:mm A")}</p>
            </div>

            <div className="w-full h-full">
              <PieChart data={stockData} />
            </div>
          </div>

          <div className="w-[80%] flex flex-col gap-2 justify-center 2xl:w-full">
            <BarChart data={stockData} />
            <LineChart data={stockData} />
          </div>
        </div>
      )}

      {show && (
        <div>
          <p className="text-base font-semibold text-justify">
            This is static Data because the API needs premium key to access the
            multiple date real time data
          </p>
          <CandleChart />
        </div>
      )}
    </div>
  );
}
