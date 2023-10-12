import { strings } from "../../constants/strings";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { forwardRef, useEffect } from "react";
import "../../assets/css/dashboard.css";
import PageLoader from "../PageLoader";
import { getColorCode, showServerError, getDate, getBarPercentage, getGroupBarPercentage } from "../../constants/utils";
import { BarChartItem, DomainItem } from "../../redux/api/types";

interface Props {
  data: any;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  domainIds: number[];
}

const BrainHealthDomainsComparisonGraph: React.FC<Props> = (props: Props) => {
  Chart.register(...registerables);
  // Register the plugin to all charts:
  Chart.register(ChartDataLabels);

  
  const getComparisonRecordData = (index: number) =>{
    const chartDataArray: number[] = [];

     if(data?.data && data?.data?.graphData){
      data?.data?.graphData?.listOfComparisonChart?.forEach((element: DomainItem)=>{
       chartDataArray.push(element.graphDBDatas[index]?.score);
      })
     }
     return chartDataArray;
  }

  const getRecords = () =>{
    const chartDataArray: BarChartItem[] = [];
    const labelData: string[] = [];
     if(data?.data && data?.data?.graphData?.listOfComparisonChart.length>0 && data?.data?.graphData?.listOfComparisonChart[0]?.graphDBDatas?.length>0){
      data?.data?.graphData?.listOfComparisonChart[0]?.graphDBDatas.forEach((element: { childDomainName: string; childDomainId: number; }, index: number)=>{
        const item = {
          label: element?.childDomainName || '',
          data: getComparisonRecordData(index),
          backgroundColor: getColorCode('subDomain', element?.childDomainId || 0) || '',
          borderRadius: 8,
          barPercentage: getGroupBarPercentage(data?.data?.graphData?.listOfComparisonChart.length),
          categoryPercentage: getGroupBarPercentage(data?.data?.graphData?.listOfComparisonChart.length),
        };
        chartDataArray.push(item);
      })
     }
     if(data?.data && data?.data?.graphData?.listOfComparisonChart.length>0){
      for(let i=0; data?.data?.graphData?.listOfComparisonChart.length>i; i++){
        labelData.push(getDate(data?.data?.graphData?.listOfComparisonChart[i].date));
      }
     }
     return {chartDataArray, labelData}
  }


  const { data, isLoading, isSuccess, domainIds } = props;
  useEffect(() => {
    if (isSuccess && isGraphDataAvailable()) {
      createBrainHealthDomainsChart();
    }
     }, [isLoading]);

  const createBrainHealthDomainsChart = () => {
    const corporatechart = document.getElementById(
      "chart-brain-health-domains-bar"
    ) as HTMLCanvasElement;

    const {chartDataArray, labelData} = getRecords();
    new Chart(corporatechart, {
      type: "bar",
      data: {
        labels: labelData,
        datasets: chartDataArray,
      },
      options: {
        maintainAspectRatio: true,
        responsive: false,
        layout: {
          padding: {
            top: 0,
          },
        },
        scales: {
           y: {
            ticks: {
              precision: 0,
              showLabelBackdrop: false,
              autoSkip: false,
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          datalabels: {
            padding: 0,
            font: {
              size: 2,
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
  const isGraphDataAvailable = () =>{
return data?.data?.graphData?.listOfComparisonChart.length>0 && domainIds?.length>1
  }
  return (
    <div className="col-xl-8 col-lg-8 col-md-12 mr-b-24">
      <div className="card border-radius-12 border-light coach-detail-graph">
        {isLoading ? (
          <PageLoader />
        ) : (
          <div className="card-body pd-all-20">
            <h6 className="body-text-emphasis text-dark-grey mr-b-16">
              {strings.brain_health_domains_comparison}
            </h6>
            { (domainIds?.length<=1) ? (
              <div className="no-data-found-graph domains-compare">{strings.no_domain_selected_msg}</div>
            ): null}
            { ( data?.data.graphData?.listOfComparisonChart?.length==0 && domainIds?.length>1) ? (
              <div className="no-data-found-graph domains-compare">{strings.no_data_found_for_compare_domains}</div>
            ): null}
            {isGraphDataAvailable() && <canvas height="300" id="chart-brain-health-domains-bar"></canvas>}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrainHealthDomainsComparisonGraph;
