import { TotalPortfolioValue } from "./total-portfolio-value";
import { CurrentHoldings } from "./current-holdings";
import { PriceChangeChart } from "./price-change-chart";
import { ReturnRate } from "./return-rate";
import { AssetAllocationChart } from "./asset-allocation-chart";
import { HistoricalPerformanceChart } from "./historical-performance-chart";

export default function Dashboard() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-6">
        {/* First Row */}
        <div className="col-span-1">
          <PriceChangeChart />
        </div>

        <div className="col-span-1">
          <ReturnRate />
        </div>

        <div className="col-span-1">
          <HistoricalPerformanceChart />
        </div>
        {/* Second Row */}
        <div className="col-span-1">
          <CurrentHoldings />
        </div>
      </div>
      <div>
        <div className="col-span-1">
          <AssetAllocationChart />
        </div>
      </div>
    </div>
  );
}
