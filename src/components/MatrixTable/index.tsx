import React from 'react';
import HeatMap, { HeatMapProp } from '../HeatMap';

interface MatrixProp extends HeatMapProp {}

/**
 *
 * Author: circlegiven
 * Date: 2022-04-27
 */
const MatrixTable = ({
  xAxis,
  yAxis,
  data,
  rectColor,
  xDimensionKey,
  yDimensionKey,
  measureKey,
}: MatrixProp) => {
  /******************************************
   * Constant / State
   * ****************************************/

  /******************************************
   * Global State
   * ****************************************/

  /******************************************
   * Handler
   * ****************************************/

  /******************************************
   * Function
   * ****************************************/

  /******************************************
   * Lifecycle
   * ****************************************/

  /******************************************
   * Render
   * ****************************************/
  return (
    <table className="MatrixGrid">
      <colgroup>
        <col
          span={(xAxis ?? []).length + 1}
          width="1%"
        />
      </colgroup>
      <thead>
        <tr className="MatrixHeader">
          <th className="PartHeader">구분</th>
          {(xAxis ?? []).map((v, i) => (
            <th key={i}>{v}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(yAxis ?? []).map((v, i: number) => (
          <tr
            className="MatrixRow"
            key={i}>
            <td>{v}</td>
            {i === 0 ? (
              <td
                className="graph"
                rowSpan={(yAxis ?? []).length}
                colSpan={(xAxis ?? []).length}>
                <HeatMap
                  xAxis={xAxis}
                  yAxis={yAxis}
                  data={data}
                  rectColor={rectColor}
                  xDimensionKey={xDimensionKey}
                  yDimensionKey={yDimensionKey}
                  measureKey={measureKey}
                />
              </td>
            ) : null}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MatrixTable;
