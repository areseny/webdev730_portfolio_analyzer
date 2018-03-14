import React from 'react';
import Highcharts from 'highcharts';
import { HighchartsChart, Chart, withHighcharts, XAxis, YAxis, Title, Subtitle, Legend, LineSeries } from 'react-jsx-highcharts';

const plotOptions = {
  series: { type: 'line' },
};

const PortfolioChart = (props) => {
  const {diaData, portfolio, spyData, urthData} = props;
  return (
    <div className="app">
      <HighchartsChart plotOptions={plotOptions}>
        <Chart />
        <Title>{portfolio.name}</Title>
        <Subtitle>$10,000 Investment Comparison</Subtitle>
        <Legend layout="vertical" align="right" verticalAlign="middle" />
        <XAxis type="datetime">
          <XAxis.Title>Date</XAxis.Title>
        </XAxis>
        <YAxis id="number">
          <YAxis.Title>Value</YAxis.Title>
          <LineSeries id='dia'  name='DJIA (DIA)'        data={diaData}  />
          <LineSeries id='spy'  name='S&P 500 (SPY)'     data={spyData}  />
          <LineSeries id='urth' name='MSCI World (URTH)' data={urthData} />
        </YAxis>
      </HighchartsChart>
    </div>
  );
}
// <LineSeries id='p1'   name={portfolio.name}    data={[10000, 10503, 12177, 15658, 17031, 20931, 22133, 20175]} />
// <LineSeries id='dia'  name='DJIA (DIA)'        data={[10000, 17722, 16005, 19771, 20185, 24377, 32147, 39387]} />
// <LineSeries id='qqq'  name='NASDAQ 100 (QQQ)'  data={[10000, 6500, 7988, 12169, 15112, 22452, 34400, 34227]} />
// <LineSeries id='iwm'  name='Russel 2000 (IWM)' data={[10000, 5948, 8105, 11248, 8989, 11816, 18274, 18111]} />

export default withHighcharts(PortfolioChart, Highcharts);
