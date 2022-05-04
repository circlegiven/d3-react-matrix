import './App.css';
import React, { useEffect, useState } from 'react';
import { csv } from 'd3-fetch';
import { difference } from 'd3-array';
import MatrixTable from './components/MatrixTable';

function App() {
  const [xAxis, setXAxis] = useState<any>(null);
  const [yAxis, setYAxis] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    csv(
      'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv',
    ).then((d) => {
      setData(d);
      setXAxis(Array.from(difference(d.map((v) => v.group))));
      setYAxis(Array.from(difference(d.map((v) => v.variable))));
    });
  }, []);

  return (
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
        xDimensionKey={'group'}
        yDimensionKey={'variable'}
        measureKey={'value'}
      />
    </div>
  );
}

export default App;
