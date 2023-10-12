import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Dayjs } from "dayjs";
import { forwardRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import "../../assets/css/dashboard.css";
import iconCloseDarkImg from "../../assets/images/icon-close-dark.svg";
import iconInfoImg from "../../assets/images/icon-info.svg";
import { strings } from "../../constants/strings";
import {
  getDepartmentParams,
  getEmotionalStateData,
  getFilterDateLabel,
  showServerError,
} from "../../constants/utils";
import {
  defaultGenderState,
  defaultLocationState,
} from "../../constants/values";
import { useGetEmotionalStateMutation } from "../../redux/api/emotionalStateApi";
import EmotionalStateFilter from "../filters/EmotionalStateFilter";
import PageLoader from "../PageLoader";

const EmotionalStateGraph = forwardRef((props, ref) => {
  const [filterStartDate, setFilterStartDate] = useState<Dayjs | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Dayjs | null>(null);
  const [locationData, setLocationData] = useState(defaultLocationState);
  const [genderData, setGenderData] = useState(defaultGenderState);
  const [departmentData, setDepartmentData] = useState<any[]>([]);

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
      genderId: filterParams?.genderData?.genderId,
      department: getDepartmentParams(filterParams?.departmentData)
    };

    getEmotionalState(params);
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

  Chart.register(...registerables);
  // Register the plugin to all charts:
  Chart.register(ChartDataLabels);

  

  const [getEmotionalState, { isLoading, isError, error, isSuccess, data }] =
    useGetEmotionalStateMutation();

  var emotionalStateData =  getEmotionalStateData();

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
    getEmotionalState(params);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      if (data && data.data.emotionalState) {
        emotionalStateData[0].data = [data.data.emotionalState.happy];
        emotionalStateData[1].data = [data.data.emotionalState.disappointed];
        emotionalStateData[2].data = [data.data.emotionalState.fearful];
        emotionalStateData[3].data = [data.data.emotionalState.angry];
        emotionalStateData[4].data = [data.data.emotionalState.sad];
        emotionalStateData[5].data = [data.data.emotionalState.surprise];
        emotionalStateData[6].data = [data.data.emotionalState.contempt];
      }
      createEmotionalStateChart();
    }
    if (isError) {
      showServerError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const createEmotionalStateChart = () => {
    const corporatechart = document.getElementById(
      "chart-affect-continuum-bar"
    ) as HTMLCanvasElement;

    new Chart(corporatechart, {
      type: "bar",
      data: {
        labels: [""],
        datasets: emotionalStateData,
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
              precision: 0
            }
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
      countryId: countryValue || 0,
      stateId: stateValue || 0,
      cityId: cityValue || 0,
      genderId: genderValue,
      department: getDepartmentParams(departmentValue),
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
    getEmotionalState(params);

  };

  return (
    <>
      <div className="col-xl-4 col-lg-4 col-md-12 mr-b-24">
        <div className="card border-radius-12 border-light coach-detail-graph">
          {isLoading ? (
            <PageLoader />
          ) : (
            <div className="card-body pd-all-20">
              <h6 className="body-text-emphasis text-dark-grey mr-b-16">
                {strings.emotional_state}
                <ReactTooltip
                  className="custom-tooltip"
                  anchorId="info-icon-state-id"
                />
                <img
                  id="info-icon-state-id"
                  data-tooltip-content={strings.emotional_state_tooltip}
                  src={iconInfoImg}
                  className="info-icon"
                  alt=""
                />
              </h6>
              <canvas height="300" id="chart-affect-continuum-bar"></canvas>
              <hr className="m-0 mr-t-16 mr-b-16" />
              <div className="chart-filter-box ">
                <button
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#emotionStateFilter"
                  aria-controls="emotionStateFilter"
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
          )}
        </div>
      </div>
      <div
        className="offcanvas offcanvas-end"
        tabIndex={-1}
        id="emotionStateFilter"
        aria-labelledby="emotionStateFilter"
      >
        <EmotionalStateFilter
          filterParams={getFilterParams()}
          onApplyFilter={(filterParams: any) => handleFilterClick(filterParams)}
        />
      </div>
    </>
  );
});

export default EmotionalStateGraph;
