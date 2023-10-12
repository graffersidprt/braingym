import { strings } from "../../constants/strings";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { forwardRef, useEffect } from "react";
import "../../assets/css/dashboard.css";
import PageLoader from "../PageLoader";
import { getBarPercentage, getColorCode, showServerError } from "../../constants/utils";
import { BarChartItem, DomainItem } from "../../redux/api/types";

interface Props {
  data: any;
  isLoading: boolean;
  isError: boolean;
  error?: string;
  isSuccess: boolean;
  domainIds: number[];
}
const DomainsGraph: React.FC<Props> = (props: Props) => {
  const { data, isLoading, isSuccess, domainIds } = props;
  Chart.register(...registerables);
  // Register the plugin to all charts:
  Chart.register(ChartDataLabels);

  useEffect(() => {
    if (isSuccess) {
       createDomainChart(domainIds?.length>1?getBarChartFullData(data?.data?.graphData?.graphDomains): []);
    }
  }, [isLoading]);
  const getBarChartFullData = (domainData: DomainItem[]) => {
    const chartDataArray: BarChartItem[] = [];
    if(domainData)
    domainData.forEach((element, index) => {
      const item = {
        label: element?.name || "",
        data: [element?.score],
        backgroundColor: getColorCode("subDomain", element?.id || 0) || "",
        borderRadius: 8,
        barPercentage: getBarPercentage(domainData?.length),
        categoryPercentage: 1.0,
      };
      chartDataArray.push(item);
    });
    return chartDataArray;
  };
  const createDomainChart = (graphRecord: BarChartItem[]) => {
    const corporatechart = document.getElementById(
      "chart-domains-bar"
    ) as HTMLCanvasElement;

    new Chart(corporatechart, {
      type: "bar",
      data: {
        labels: [""],
        datasets: graphRecord,
      },
      options: {
        maintainAspectRatio: true,
        responsive: false,
        layout: {
          padding: {
            top: 0,
          },
        },
        plugins: {
          datalabels: {
            padding: 0,
            font: {
              size: 12,
            },
            color: "#444444",
            display: true,
            formatter: function (value, ctx) {
              if (value == 0) return "";
              else return value;
            },
          },
          legend: {
            labels: {
              padding: 10,
              color: "#444444",
              font: {
                size: 12,
              },
              usePointStyle: true,
            },
            position: "bottom",
            display: true,
          },
        },
      },
    });
  };
  
  return (
    <div className="col-xl-4 col-lg-4 col-md-12 mr-b-24">
      <div className="card border-radius-12 border-light coach-detail-graph">
        {isLoading ? (
          <PageLoader />
        ) : (
          <div className="card-body pd-all-20">
            <h6 className="body-text-emphasis text-dark-grey mr-b-16">
              {strings.domains}
            </h6>
            { (domainIds.length<=1) ? (
              <div className="no-data-found-graph domains">{strings.no_domain_selected_msg}</div>
            ): null}
            { ( data?.data.graphData?.graphDomains.length==0 && domainIds.length>1) ? (
              <div className="no-data-found-graph domains">{strings.no_data_found_for_compare_domains}</div>
            ): null}
             <canvas height="300" id="chart-domains-bar"></canvas>
           </div>
        )}
      </div>
    </div>
  );
};

export default DomainsGraph;
