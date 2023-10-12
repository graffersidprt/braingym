import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import "../../assets/css/dashboard.css"; //Dasboard CSS
import "react-tooltip/dist/react-tooltip.css";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { strings } from "../../constants/strings";
import { showServerError, getColorCode, getDepartmentParams, isEmptyOrNull, getFilterType } from "../../constants/utils";
import PageLoader from "../PageLoader";
import { IBrainHealthSData } from "../../redux/api/types";
import { useGetBrainHealthProgressMutation } from "../../redux/api/brainHealthProgressApi";
const OverallBrainHealthGraph = forwardRef((props, ref) => {
  Chart.register(...registerables);
  // Register the plugin to all charts:
  Chart.register(ChartDataLabels);

  const [
    getBrainHealthProgress,
    { isLoading, isError, error, isSuccess, data },
  ] = useGetBrainHealthProgressMutation();
  useEffect(() => {
    const params = {
      filterType: 0,
      startDate: "",
      endDate: "",
      day: "",
      week: "",
      month: "",
      year: "",
      domainId: 0,
      childDomainId: [],
      coachFilterType: 0,
      countryId: 0,
      stateId: 0,
      cityId: 0,
      genderId: 0,
      userId: 0,
      department: [],
    };
    getBrainHealthProgress(params);
  }, []);

   
  
  useImperativeHandle(ref, () => ({
    applyFilter(filterParams: any) {
      const params = {
        startDate: filterParams?.startDate || "",
        endDate: filterParams?.endDate || "",
        day: "",
        week: "",
        month: "",
        year: "",
        domainId: 0,
        childDomainId: [],
        coachFilterType: 0,
        countryId: filterParams?.locationData?.countryId || 0,
        stateId: filterParams?.locationData?.stateId || 0,
        cityId: filterParams?.locationData?.cityId || 0,
        genderId: filterParams?.genderData?.genderId,
        userId: 0,
        filterType: getFilterType(filterParams?.startDate,filterParams?.endDate),
        department: getDepartmentParams(filterParams?.departmentData),
      };
      getBrainHealthProgress(params);
    },
  }));
  const isDataAvailable = () => {
    return data?.data?.overAllScore || data?.data?.overAllScore == 0;
  };
  useEffect(() => {
    if (isSuccess && isDataAvailable()) {
      createOverAllScoreChart(data?.data);
    }
    if (isError) {
      showServerError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const getDoughnutChart = (overAllScore: number) => {
    const doughnutChartArray = [];
    doughnutChartArray.push(overAllScore);
    doughnutChartArray.push(100 - overAllScore);
    return doughnutChartArray;
  };
  const chartOverAllScoreDoughnut = [
    getColorCode("common", 1),
    getColorCode("common", 7),
  ];

  const createOverAllScoreChart = (brainHealthData: IBrainHealthSData) => {
    const corporatechart = document.getElementById(
      "chart-over-all-score-detail"
    ) as HTMLCanvasElement;
    var corporatedata = getDoughnutChart(brainHealthData.overAllScore);

    new Chart(corporatechart, {
      type: "doughnut",
      data: {
        labels: [strings.active, strings.inactive],
        datasets: [
          {
            label: strings.overall_score,
            data: corporatedata,
            backgroundColor: chartOverAllScoreDoughnut,
          },
        ],
      },
      options: {
        responsive: false,
        layout: {
          padding: {
            top: 0,
          },
        },
        plugins: {
          datalabels: {
            // margin:10 0,
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
              padding: 20,
              color: "#444444",
              font: {
                size: 12,
                weight: "400",
              },
              usePointStyle: true,
            },
            position: "top",
            display: false,
          },
        },
      },
    });
  };
  return (
    <>
      <div className="col-xl-4 col-lg-4 col-md-12 mr-b-24">
        <div className="card border-radius-12 border-light coach-detail-graph">
          <div className="card-body pd-all-20">
            <h6 className="body-text-emphasis text-dark-grey mr-b-16">
              {strings.overall_brain_health_score}
            </h6>
            {isLoading ? (
              <PageLoader />
            ) : isDataAvailable() ? (
              <div className="card-body-graph">
                <span className="overall-score detail-page">
                  {data?.data?.overAllScore || "0"} <br />
                  <span>{strings.overall_score}</span>
                </span>
                <canvas height="250" id="chart-over-all-score-detail"></canvas>
              </div>
            ) : (
              <div className="no-data-found-org-brain-health">
                <span>{data?.data?.message || strings.no_data_found_for_compare_domains}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
});

export default OverallBrainHealthGraph;
