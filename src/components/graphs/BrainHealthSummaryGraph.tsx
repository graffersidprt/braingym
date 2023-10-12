import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Dayjs } from "dayjs";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Link } from "react-router-dom";
import "../../assets/css/dashboard.css";
import iconCloseDarkImg from "../../assets/images/icon-close-dark.svg";
import iconRightArrow from "../../assets/images/icon-right-arrow.svg";
import { strings } from "../../constants/strings";
import {
  getColorCode,
  getDepartmentNames,
  getDepartmentParams,
  getFilterDateLabel,
  getFilterType,
  isEmptyOrNull,
  showServerError,
} from "../../constants/utils";
import {
  defaultGenderState,
  defaultLocationState,
} from "../../constants/values";
import { useGetBrainHealthProgressMutation } from "../../redux/api/brainHealthProgressApi";
import {
  BarChartItem,
  DomainItem,
  IBrainHealthSData,
} from "../../redux/api/types";
import CurrentBrainScoreRange from "./CurrentBrainScoreRangeGraph";
import BrainHealthFilter from "../filters/BrainHealthSummaryFilter";
import PageLoader from "../PageLoader";

const BrainHealthSummaryGraph = forwardRef((props, ref) => {
  const [filterStartDate, setFilterStartDate] = React.useState<Dayjs | null>(
    null
  );
  const [filterEndDate, setFilterEndDate] = React.useState<Dayjs | null>(null);
  const [locationData, setLocationData] = useState(defaultLocationState);
  const [genderData, setGenderData] = useState(defaultGenderState);
  const [departmentData, setDepartmentData] = useState<string[]>([]);

  Chart.register(...registerables);
  // Register the plugin to all charts:
  Chart.register(ChartDataLabels);

  const [
    getBrainHealthProgress,
    { isLoading, isError, error, isSuccess, data },
  ] = useGetBrainHealthProgressMutation();
  useImperativeHandle(ref, () => ({
    onLoad() {},
  }));
  
  const handleFilterClick = (filterParams: any) => {
    setFilterStartDate(filterParams?.startDate || "");
    setFilterEndDate(filterParams?.endDate || "");
    setLocationData(filterParams?.locationData);
    setGenderData(filterParams?.genderData);
    setDepartmentData(filterParams?.departmentData);
    const params = {
      startDate: filterParams?.startDate || "",
      endDate: filterParams?.endDate || "",
      countryId: filterParams?.locationData?.countryId || 0,
      stateId: filterParams?.locationData?.stateId || 0,
      cityId: filterParams?.locationData?.cityId || 0,
      filterType: getFilterType(filterParams?.startDate, filterParams?.endDate),
      day: "",
      week: "",
      month: "",
      year: "",
      domainId: 0,
      childDomainId: [],
      coachFilterType: 0,
      genderId: filterParams?.genderData?.genderId,
      userId: 0,
      department: getDepartmentParams(filterParams?.departmentData)
    };
    getBrainHealthProgress(params);
  };

  const getFilterParams = () => {
    return {
      startDate: filterStartDate || "",
      endDate: filterEndDate || "",
      coachFilterType: 0,
      locationData: locationData,
      genderData: genderData,
      departmentData: departmentData,
    };
  };

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

  useEffect(() => {
    if (isSuccess) {
      createOverAllScoreChart(data?.data);
      createOverAllScoreBarChart(data?.data?.domainData);
    }
    if (isError) {
      showServerError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const chartOverAllScoreDoughnut = [
    getColorCode("common", 1),
    getColorCode("common", 7),
  ];

  const getDoughnutChart = (overAllScore: number) => {
    const doughnutChartArray = [];
    doughnutChartArray.push(overAllScore);
    doughnutChartArray.push(100 - overAllScore);
    return doughnutChartArray;
  };

  const createOverAllScoreChart = (brainHealthData: IBrainHealthSData) => {
    if (!brainHealthData.domainData) return;
    const corporatechart = document.getElementById(
      "chart-over-all-score"
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
            padding: 0,
            font: {
              size: 12,
            },
            color: "#444444",
            display: true,
            formatter: function (value, ctx) {
              if (value === 0) return "";
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

  const getBarChartFullData = (domainData: DomainItem[]) => {
    const chartDataArray: BarChartItem[] = [];
    domainData.forEach((element, index) => {
      const item = {
        label: element?.name,
        data: [element?.score],
        backgroundColor: getColorCode("domain", element?.domainId),
        borderRadius: 8,
        barPercentage: 0.3,
        categoryPercentage: 1.0,
      };
      chartDataArray.push(item);
    });
    return chartDataArray;
  };

  const createOverAllScoreBarChart = (domainData: DomainItem[]) => {
    if (!domainData) return;
    const corporatechart = document.getElementById(
      "chart-over-all-score-bar"
    ) as HTMLCanvasElement;
    new Chart(corporatechart, {
      type: "bar",
      data: {
        labels: [""],
        datasets: getBarChartFullData(domainData),
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
            ticks: {
              display: false, //this will remove only the label
            },
            grid: {
              offset: true,
              display: false, //this will remove only the label
            },
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
              if (value === 0) return "";
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
            position: "bottom",
            display: true,
          },
        },
      },
    });
  };

  const removeFilterClick = (
    startDate: any,
    endDate: any,
    countryValue: number,
    stateValue: number,
    cityValue: number,
    genderValue: number,
    departmentValue: any[]
  ) => {
    const params = {
      startDate: startDate || "",
      endDate: endDate || "",
      day: "",
      week: "",
      month: "",
      year: "",
      domainId: 0,
      childDomainId: [],
      coachFilterType: 0,
      countryId: countryValue || 0,
      stateId: stateValue || 0,
      cityId: cityValue || 0,
      genderId: genderValue,
      userId: 0,
      filterType: getFilterType(startDate, endDate),
      department: getDepartmentParams(departmentValue)
    };
    setFilterStartDate(startDate);
    setFilterEndDate(endDate);
    setLocationData({
      countryId: countryValue,
      countryName: countryValue === 0 ? "" : locationData?.countryName,
      stateId: stateValue,
      stateName: stateValue === 0 ? "" : locationData?.stateName,
      cityId: cityValue,
      cityName: cityValue === 0 ? "" : locationData?.cityName,
    });
    setGenderData({
      genderId: genderValue,
      genderName: genderValue === 0 ? "" : genderData?.genderName,
    });
    setDepartmentData(departmentValue);
    getBrainHealthProgress(params);
  };

  return (
    <>
      <section className="Users-section fixed-height">
        <div className="row">
          <div className="col-xl-8 col-lg-8 col-md-12 mr-b-24">
            <div className="card border-radius-12 border-light coach-detail-graph">
              {isLoading ? (
                <PageLoader />
              ) : (
                <div className="card-body  pd-all-20 ">
                  <div className="graph-header-justify">
                    <h6 className="body-text-emphasis text-dark-grey mr-b-16">
                      {strings.organizations_brain_health}
                    </h6>
                    <Link
                      className="label-view-detail mr-b-16"
                      to="/brain-health-detail"
                    >
                      <span>
                        {strings.view_details}
                        <img src={iconRightArrow} />
                      </span>
                    </Link>
                  </div>
                  {data?.data?.domainData ? (
                    <div className="row">
                      <div className="col-xl-4 col-lg-4 col-md-12">
                        {data?.data?.domainData && (
                          <>
                          <span className="overall-score" 
                           style={{
                            position: "absolute",
                            top: 190,
                            left: 96,
                          }}
                          >{data?.data?.overAllScore} <br/>
                          <span>{strings.overall_score}</span>
                        </span>
                          <canvas
                            height="300"
                            width="230"
                            id="chart-over-all-score"
                          ></canvas>
                          </>
                        )}
                      </div>
                      <div className="col-xl-8 col-lg-8 col-md-12">
                        <div className="card-body-graph">
                          {data?.data?.domainData && (
                            <canvas
                              height="300"
                              id="chart-over-all-score-bar"
                            ></canvas>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="no-data-found-org-brain-health">
                      <span>{data?.data?.message}</span>
                    </div>
                  )}
                  <hr className="m-0 mr-t-16 mr-b-16" />
                  <div className="chart-filter-box ">
                    <button
                      type="button"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#organizationBrainHealthFilter"
                      aria-controls="organizationBrainHealthFilter"
                      className="filter-btn "
                    >
                      <i className="icon-filter fs-16 mr-r-6"></i>{" "}
                      {strings.filter}
                    </button>
                    <ul className="chip-group unique-id-list filter-list">
                      {filterStartDate && filterEndDate && (
                        <li className="chip">
                          <div className="chip-label">
                            {getFilterDateLabel(filterStartDate, filterEndDate)}
                          </div>
                          <Link className="chip-btn" to={""}>
                            <img
                              src={iconCloseDarkImg}
                              alt=""
                              onClick={() =>
                                removeFilterClick(
                                  "",
                                  "",
                                  locationData?.countryId,
                                  locationData?.stateId,
                                  locationData?.cityId,
                                  genderData?.genderId,
                                  departmentData
                                )
                              }
                            />
                          </Link>
                        </li>
                      )}
                      {locationData?.countryName && (
                        <li className="chip">
                          <div className="chip-label">
                            {locationData?.countryName}
                          </div>
                          <Link className="chip-btn" to={""}>
                            <img
                              src={iconCloseDarkImg}
                              alt=""
                              onClick={() =>
                                removeFilterClick(
                                  filterStartDate,
                                  filterEndDate,
                                  0,
                                  locationData?.stateId,
                                  locationData?.cityId,
                                  genderData?.genderId,
                                  departmentData
                                )
                              }
                            />
                          </Link>
                        </li>
                      )}
                      {locationData?.stateName && (
                        <li className="chip">
                          <div className="chip-label">
                            {locationData?.stateName}
                          </div>
                          <Link className="chip-btn" to={""}>
                            <img
                              src={iconCloseDarkImg}
                              alt=""
                              onClick={() =>
                                removeFilterClick(
                                  filterStartDate,
                                  filterEndDate,
                                  locationData?.countryId,
                                  0,
                                  locationData?.cityId,
                                  genderData?.genderId,
                                  departmentData
                                )
                              }
                            />
                          </Link>
                        </li>
                      )}
                      {locationData?.cityName && (
                        <li className="chip">
                          <div className="chip-label">
                            {locationData?.cityName}
                          </div>
                          <Link className="chip-btn" to={""}>
                            <img
                              src={iconCloseDarkImg}
                              alt=""
                              onClick={() =>
                                removeFilterClick(
                                  filterStartDate,
                                  filterEndDate,
                                  locationData?.countryId,
                                  locationData?.stateId,
                                  0,
                                  genderData?.genderId,
                                  departmentData
                                )
                              }
                            />
                          </Link>
                        </li>
                      )}
                      {genderData?.genderName && (
                        <li className="chip">
                          <div className="chip-label">
                            {genderData.genderName}
                          </div>
                          <Link className="chip-btn" to={""}>
                            <img
                              src={iconCloseDarkImg}
                              alt=""
                              onClick={() =>
                                removeFilterClick(
                                  filterStartDate,
                                  filterEndDate,
                                  locationData?.countryId,
                                  locationData?.stateId,
                                  locationData?.cityId,
                                  0,
                                  departmentData
                                )
                              }
                            />
                          </Link>
                        </li>
                      )}
                      {departmentData.map((item: any,index)=>
                      <li key={item.id} className="chip">
                          <div className="chip-label">
                            {item?.name}
                          </div>
                          <Link className="chip-btn" to={""}>
                            <img
                              src={iconCloseDarkImg}
                              alt=""
                              onClick={() =>{

                                const updatedArray = departmentData;
                                updatedArray.splice(index, 1);
                                removeFilterClick(
                                  filterStartDate,
                                  filterEndDate,
                                  locationData?.countryId,
                                  locationData?.stateId,
                                  locationData?.cityId,
                                  genderData?.genderId,
                                  updatedArray
                                )
                              }
                              }
                            />
                          </Link>
                        </li>)
                      }
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
          <CurrentBrainScoreRange />
        </div>
        <div
          className="offcanvas offcanvas-end"
          tabIndex={-1}
          id="organizationBrainHealthFilter"
          aria-labelledby="organizationBrainHealthFilter"
        >
          <BrainHealthFilter
            filterParams={getFilterParams()}
            onApplyFilter={(filterParams: any) =>
              handleFilterClick(filterParams)
            }
          />
        </div>
      </section>
    </>
  );
});

export default BrainHealthSummaryGraph;
