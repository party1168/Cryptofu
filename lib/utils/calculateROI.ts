const calculateROI = (averageCost: number, price: number) => {
  const roi = ((price - averageCost) / averageCost) * 100;
  return Number(roi.toFixed(1));
};

export default calculateROI;
