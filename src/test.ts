import { csv } from 'd3-fetch';

export const xAxis = [
  'Coca-Cola',
  'Microsoft',
  'IBM',
  'Intel',
  'Nokia',
  'GE',
  'Ford',
  'Disney',
  "McDonald's",
  'AT&T',
  'Marlboro',
  'Mercedes-Benz',
  'HP',
  'Cisco',
  'Toyota',
  'Citi',
  'Gillette',
  'Sony',
  'American Express',
  'Honda',
];
export const yAxis = [
  '2000-01-01',
  '2001-01-01',
  '2002-01-01',
  '2003-01-01',
  '2004-01-01',
  '2005-01-01',
  '2006-01-01',
  '2007-01-01',
  '2008-01-01',
  '2009-01-01',
  '2010-01-01',
  '2011-01-01',
  '2012-01-01',
  '2013-01-01',
  '2014-01-01',
  '2015-01-01',
  '2016-01-01',
  '2017-01-01',
  '2018-01-01',
  '2019-01-01',
];

export async function testDataGenerate() {
  return await csv(
    'https://static.observableusercontent.com/files/aec3792837253d4c6168f9bbecdf495140a5f9bb1cdb12c7c8113cec26332634a71ad29b446a1e8236e0a45732ea5d0b4e86d9d1568ff5791412f093ec06f4f1',
  ).then((d) => {
    return (d ?? [])
      .filter((data) => xAxis.some((axis) => axis === data.name))
      .map((data) => ({ ...data, value: Number(data.value) }));
  });
}
