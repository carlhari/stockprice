// BarChart.js

import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";
import HighchartsStock from "highcharts/modules/stock";
import axios from "axios";

HighchartsMore(Highcharts);
HighchartsStock(Highcharts);

export const BarChart = ({ data }: any) => {
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

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export const CandleChart = () => {
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
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={"stockChart"}
      options={options}
    />
  );
};

export const LineChart = ({ data }: any) => {
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

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export const PieChart = ({ data }: any) => {
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

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};
