import './App.css';
import React, { useEffect, useState } from 'react';
import MatrixTable from './components/MatrixTable';
import { testDataGenerate, xAxis, yAxis } from './test';

function App() {
  const [data, setData] = useState<any>(null);
  const [clickedData, setClickedData] = useState<any>(null);
  const [brushedData, setBrushedData] = useState<any>(null);

  useEffect(() => {
    testDataGenerate().then((d) => setData(d));
  }, []);

  return (
    <>
      <div className="MatrixGridArea">
        <MatrixTable
          xAxis={xAxis}
          yAxis={yAxis}
          data={data}
          rectColor={{
            lowColor: 'blue',
            midColor: 'white',
            highColor: 'red',
          }}
          xDimensionKey={'name'}
          yDimensionKey={'date'}
          measureKey={'value'}
          onClick={setClickedData}
          onBrushed={setBrushedData}
        />
      </div>
      <div>clicked: {JSON.stringify(clickedData)}</div>
      <div>brushed: {JSON.stringify(brushedData)}</div>
    </>
  );
}

export default App;
