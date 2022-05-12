import './App.css';
import React, { useEffect, useState } from 'react';
import MatrixTable from './components/MatrixTable';
import { testDataGenerate, xAxis, yAxis } from './test';
import ReactJson from 'react-json-view';

function App() {
  const [data, setData] = useState<any>(null);
  const [clickedData, setClickedData] = useState<any>(null);
  const [brushedData, setBrushedData] = useState<any>(null);

  useEffect(() => {
    testDataGenerate().then((d) => setData(d));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flex: '1 0 0' }}>
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
      <div style={{ flex: '1 0 0', display: 'flex', overflow: 'hidden' }}>
        <div style={{ width: '50%' }}>
          <h2>clicked:</h2>
          <ReactJson
            src={clickedData}
            style={{ height: '100%', overflow: 'auto' }}
          />
        </div>
        <div style={{ width: '50%' }}>
          <h2>brushed:</h2>
          <ReactJson
            src={brushedData}
            style={{ height: '100%', overflow: 'auto' }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
