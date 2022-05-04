import { scaleBand, scaleLinear, ScaleBand, ScaleLinear } from 'd3-scale';
import { max, mean, min } from 'd3-array';
import { Selection } from 'd3-selection';

export type RectColor = {
  lowColor: string;
  midColor: string;
  highColor: string;
};
type DataKey = string | number;
type Data = Record<DataKey, any>;
type D3Selection<T> = Selection<SVGGElement, T, SVGSVGElement | null, unknown>;

export const generateXScale = (width: number, domains: any[]) => {
  return scaleBand().range([0, width]).domain(domains);
};

export const generateYScale = (height: number, domains: any[]) => {
  return scaleBand().range([height, 0]).domain(domains);
};

export function generateGradationColorScale(
  rectColor: RectColor,
  values: number[],
) {
  return scaleLinear<string>()
    .domain(extentValues(values))
    .range([rectColor.lowColor, rectColor.midColor, rectColor.highColor]);
}

interface MatrixSelection {
  selection: D3Selection<Data>;
  xScale: ScaleBand<any>;
  yScale: ScaleBand<any>;
  colorScale: ScaleLinear<string, string>;
  xDimensionKey: DataKey;
  yDimensionKey: DataKey;
  measureKey: DataKey;
}

export const appendRectToSelection = ({
  selection,
  xScale,
  yScale,
  colorScale,
  xDimensionKey,
  yDimensionKey,
  measureKey,
}: MatrixSelection) =>
  selection
    .append('rect')
    .attr('x', (d) => xScale(d[xDimensionKey]) as number)
    .attr('y', (d) => yScale(d[yDimensionKey]) as number)
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())
    .style('fill', (d) => colorScale(d[measureKey]));

export const appendTextToSelection = ({
  selection,
  xScale,
  yScale,
  xDimensionKey,
  yDimensionKey,
  measureKey,
}: Omit<MatrixSelection, 'colorScale'>) =>
  selection
    .append('text')
    .attr('x', (d) => (xScale(d[xDimensionKey]) ?? 0) + xScale.bandwidth() / 2)
    .attr('y', (d) => (yScale(d[yDimensionKey]) ?? 0) + yScale.bandwidth() / 2)
    .attr('font-size', 10)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .text((d) => d[measureKey]);

function extentValues(values: number[]) {
  const minValue = min(values);
  const meanValue = mean(values);
  const maxValue = max(values);

  const result = new Array<number>();

  if (minValue !== undefined) {
    result.push(minValue);
  }

  if (meanValue !== undefined) {
    result.push(meanValue);
  }

  if (maxValue !== undefined) {
    result.push(maxValue);
  }

  return result;
}
