"use client";

import { FormEvent, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";
import HighchartsStock from "highcharts/modules/stock";
import moment from "moment";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

const BarChart = ({ data }: any) => {
  if (!data) return null;

  // Convert data for the bar chart
  const chartData = [
    { name: "Open", y: data.o },
    { name: "High", y: data.h },
    { name: "Low", y: data.l },
    { name: "Close", y: data.c },
    { name: "Previous Close", y: data.pc },
  ];

  const options = {
    chart: {
      type: "bar",
      borderRadius: "0.75rem",
    },
    title: {
      text: "AAPL Stock Price Overview",
    },
    xAxis: {
      categories: ["Open", "High", "Low", "Close", "Previous Close"],
      title: {
        text: null,
      },
    },
    yAxis: {
      title: {
        text: "Value",
      },
    },
    series: [
      {
        name: "Values",
        data: chartData,
      },
    ],
    credits: {
      enabled: false,
    },
  };

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
};

const CandleChart = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          "https://demo-live-data.highcharts.com/aapl-ohlc.json"
        );

        const data = response.data;
        setData(data);
      } catch (err) {
        console.error(err);
      }
    };

    getData();
  }, []);

  if (!data) return <div>Loading...</div>;

  const options = {
    rangeSelector: {
      selected: 1,
    },

    title: {
      text: "AAPL Stock Price",
    },

    chart: {
      borderRadius: "0.75rem",
    },

    series: [
      {
        type: "candlestick",
        name: "AAPL Stock Price",
        data: data,
        dataGrouping: {
          units: [
            [
              "week", // unit name
              [1],
            ],
            ["month", [1, 2, 3, 4, 6]],
          ],
        },
      },
    ],
  };

  return (
    <>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"stockChart"}
        options={options}
      />
    </>
  );
};

const LineChart = ({ data }: any) => {
  if (!data) return null;

  // Convert data for the bar chart
  const chartData = [
    { name: "Open", y: data.o },
    { name: "High", y: data.h },
    { name: "Low", y: data.l },
    { name: "Close", y: data.c },
    { name: "Previous Close", y: data.pc },
  ];

  const options = {
    chart: {
      type: "line",
      borderRadius: "0.75rem",
    },
    title: {
      text: "AAPL Stock Price Overview",
    },
    xAxis: {
      categories: ["Open", "High", "Low", "Close", "Previous Close"],
      title: {
        text: null,
      },
    },
    yAxis: {
      title: {
        text: "Value",
      },
    },
    series: [
      {
        name: "Values",
        data: chartData,
      },
    ],
    credits: {
      enabled: false,
    },
  };

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
};

const PieChart = ({ data }: any) => {
  if (!data) return null;

  // Convert data for the bar chart
  const chartData = [
    { name: "Open", y: data.o },
    { name: "High", y: data.h },
    { name: "Low", y: data.l },
    { name: "Close", y: data.c },
    { name: "Previous Close", y: data.pc },
  ];

  const options = {
    chart: {
      type: "pie",
      borderRadius: "0.75rem",
    },
    title: {
      text: "AAPL Stock Price Overview",
    },
    xAxis: {
      categories: ["Open", "High", "Low", "Close", "Previous Close"],
      title: {
        text: null,
      },
    },
    yAxis: {
      title: {
        text: "Value",
      },
    },
    series: [
      {
        name: "Values",
        data: chartData,
      },
    ],
    credits: {
      enabled: false,
    },
  };

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
};

export default function Home() {
  const [symbol, setSymbol] = useState<string>("");
  const [stockData, setStockData] = useState<any>(null);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);

  const BASE_URL = "https://finnhub.io/api/v1";
  const getStockPrice = async (symbol: any) => {
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
