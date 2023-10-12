import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Dayjs } from "dayjs";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Link } from "react-router-dom";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import "../../assets/css/dashboard.css";
import iconCloseDarkImg from "../../assets/images/icon-close-dark.svg";
import iconInfoImg from "../../assets/images/icon-info.svg";
import { strings } from "../../constants/strings";
import {
  getColorCode,
  getDepartmentParams,
  getFilterDateLabel,
  showServerError,
} from "../../constants/utils";
import {
  defaultGenderState,
  defaultLocationState,
} from "../../constants/values";
import {
  useGetCountryListMutation,
  useGetDepartmentListMutation,
  useGetGenderListMutation,
} from "../../redux/api/commonApi";
import { useGetCurrentBrainHealthScoreMutation } from "../../redux/api/currentBrainHealthScoreApi";
import CurrentBrainFilter from "../filters/CurrentBrainFilter";
import PageLoader from "../PageLoader";

const CurrentBrainScoreRangeGraph = forwardRef((props, ref) => {
  const [filterStartDate, setFilterStartDate] = useState<Dayjs | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Dayjs | null>(null);
  const [locationData, setLocationData] = useState(defaultLocationState);
  const [genderData, setGenderData] = useState(defaultGenderState);
  const [departmentData, setDepartmentData] = useState<any[]>([]);

  Chart.register(...registerables);
  // Register the plugin to all charts:
  Chart.register(ChartDataLabels);

  const [
    getCurrentBrainHealthScore,
    { isLoading, isError, error, isSuccess, data },
  ] = useGetCurrentBrainHealthScoreMutation();

  useImperativeHandle(ref, () => ({
    onLoad() {},
  }));

  useEffect(() => {
    const params = {
      startDate: filterStartDate || "",
      endDate: filterEndDate || "",
      countryId: locationData?.countryId || 0,
      stateId: locationData?.stateId || 0,
      cityId: locationData?.cityId || 0,
      department: getDepartmentParams(departmentData),
      genderId: genderData?.genderId,
    };
    getCurrentBrainHealthScore(params);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      createCurrentBrainHealthScoresChart();
    }
    if (isError) {
      showServerError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleFilterClick = (filterParams: any) => {
    setFilterStartDate(filterParams?.startDate || "");
    setFilterEndDate(filterParams?.endDate || "");
    setLocationData(filterParams?.locationData);
    setGenderData(filterParams?.genderData);
    setDepartmentData(filterParams?.departmentData);
    const params = {
      startDate: filterParams?.startDate || "",
      endDate: filterParams?.endDate || "",
      eventType: filterParams?.eventType || "",
      countryId: filterParams?.locationData?.countryId || 0,
      stateId: filterParams?.locationData?.stateId || 0,
      cityId: filterParams?.locationData?.cityId || 0,
      filterType: 0,
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
    getCurrentBrainHealthScore(params);
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

  // This for call all initial API (getGenderList, getCountryList, getDepartmentList)
  useEffect(() => {
    getGenderList();
    getCountryList();
    getDepartmentList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ? API Get Gender List Mutation
  const [
    getGenderList,
    {
      isLoading: genderListIsLoading,
      isError: genderListIsError,
      error: genderListError,
      data: genderListData,
    },
  ] = useGetGenderListMutation();

  // ? API Get Country List Mutation
  const [
    getCountryList,
    {
      isLoading: countryListIsLoading,
      isError: countryListIsError,
      error: countryListError,
      data: countryListData,
    },
  ] = useGetCountryListMutation();

  // ? API Get Department List Mutation
  const [getDepartmentList, { data: departmentListData }] =
    useGetDepartmentListMutation();

  const getCurrentBrainHealthScoreData = () => {
    const chartScoreArray: number[] = [];
    const chartLabelArray: string[] = [];
    Object.keys(data?.data?.currentBrainHealthScore).forEach((key) => {
      chartScoreArray.push(data?.data?.currentBrainHealthScore[key]);
      let label = "";
      switch (key) {
        case "poor":
          label = strings[key];
          break;
        case "great":
          label = strings[key];
          break;
        case "ok":
          label = strings[key];
          break;
      }
      chartLabelArray.push(
        label + " (" + data?.data?.currentBrainHealthScore[key] + ")"
      );
    });
    return { chartLabelArray, chartScoreArray };
  };

  const createCurrentBrainHealthScoresChart = () => {
    const corporatechart = document.getElementById(
      "chart-employee-brain-score"
    ) as HTMLCanvasElement;
    const { chartScoreArray, chartLabelArray } =
      getCurrentBrainHealthScoreData();
    new Chart(corporatechart, {
      type: "doughnut",
      data: {
        labels: chartLabelArray,
        datasets: [
          {
            label: strings.employees_brain_score_range,
            data: chartScoreArray,
            backgroundColor: [
              getColorCode("brainHealthScore", 3),
              getColorCode("brainHealthScore", 2),
              getColorCode("brainHealthScore", 1),
            ],
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
    getCurrentBrainHealthScore(params);
  };

  return (
    <>
      <div className="col-xl-4 col-lg-4 col-md-12 mr-b-24">
        <div className="card border-radius-12 border-light coach-detail-graph">
          <div className="card-body pd-all-20">
            <h6 className="body-text-emphasis text-dark-grey mr-b-16">
              <ReactTooltip
                className="custom-tooltip"
                anchorId="info-icon-id"
              />
              {strings.employees_brain_score_range}
              <img
                id="info-icon-id"
                data-tooltip-content={strings.employees_brain_score_range_info}
                className="info-icon"
                src={iconInfoImg}
                alt=""
              />
            </h6>
            {isLoading ? (
              <PageLoader />
            ) : (
              <div className="card-body-graph">
                {data?.data?.currentBrainHealthScore ? (
                  <canvas height="300" id="chart-employee-brain-score"></canvas>
                ) : (
                  <div className="no-data-found">
                    <span>{data?.data?.message}</span>
                  </div>
                )}
              </div>
            )}
            <hr className="m-0 mr-t-16 mr-b-16" />
            <div className="chart-filter-box ">
              <button
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#brainHealthFilter"
                aria-controls="brainHealthFilter"
                className="filter-btn "
              >
                <i className="icon-filter fs-16 mr-r-6"></i> {strings.filter}
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
                    <div className="chip-label">{locationData?.stateName}</div>
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
                    <div className="chip-label">{locationData?.cityName}</div>
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
                    <div className="chip-label">{genderData.genderName}</div>
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
        </div>
      </div>
      <div
        className="offcanvas offcanvas-end"
        tabIndex={-1}
        id="brainHealthFilter"
        aria-labelledby="brainHealthFilter"
      >
        <CurrentBrainFilter
          filterParams={getFilterParams()}
          onApplyFilter={(filterParams: any) => handleFilterClick(filterParams)}
        />
      </div>
    </>
  );
});

export default CurrentBrainScoreRangeGraph;
