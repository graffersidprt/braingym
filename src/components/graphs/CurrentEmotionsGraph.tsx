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
import { useGetCurrentEmotionsMutation } from "../../redux/api/currentEmotionsApi";
import CurrentEmotionsFilter from "../filters/CurrentEmotionsFilter";
import PageLoader from "../PageLoader";

const CurrentEmotionsGraph = forwardRef((props, ref) => {
  const [filterStartDate, setFilterStartDate] = useState<Dayjs | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Dayjs | null>(null);
  const [locationData, setLocationData] = useState(defaultLocationState);
  const [genderData, setGenderData] = useState(defaultGenderState);
  const [departmentData, setDepartmentData] = useState<any[]>([]);

  Chart.register(...registerables);
  // Register the plugin to all charts:
  Chart.register(ChartDataLabels);

 
  const [getCurrentEmotions, { isLoading, isError, error, isSuccess, data }] =
    useGetCurrentEmotionsMutation();

  const currentEmotionsData = {
    happy: 0,
    disappointed: 0,
    fearful: 0,
    angry: 0,
    sad: 0,
    surprise: 0,
    contempt: 0,
  };

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
    getCurrentEmotions(params);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      if (data && data.data.emotionalState) {
        currentEmotionsData.happy = data.data.emotionalState.happy;
        currentEmotionsData.disappointed =
          data.data.emotionalState.disappointed;
        currentEmotionsData.fearful = data.data.emotionalState.fearful;
        currentEmotionsData.angry = data.data.emotionalState.angry;
        currentEmotionsData.sad = data.data.emotionalState.sad;
        currentEmotionsData.surprise = data.data.emotionalState.surprise;
        currentEmotionsData.contempt = data.data.emotionalState.contempt;
      }
      createCurrentEmotionsChart();
    }
    if (isError) {
      showServerError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const createCurrentEmotionsChart = () => {
    const currentEmotionsChart = document.getElementById(
      "chart-current-emotions"
    ) as HTMLCanvasElement;
    var corporatedata = [
      currentEmotionsData.happy,
      currentEmotionsData.disappointed,
      currentEmotionsData.fearful,
      currentEmotionsData.angry,
      currentEmotionsData.sad,
      currentEmotionsData.surprise,
      currentEmotionsData.contempt,
    ];

    new Chart(currentEmotionsChart, {
      type: "doughnut",
      data: {
        labels: [
          strings.happy + " (" + currentEmotionsData.happy + "%)",
          strings.disappointed + " (" + currentEmotionsData.disappointed + "%)",
          strings.fearful + " (" + currentEmotionsData.fearful + "%)",
          strings.angry + " (" + currentEmotionsData.angry + "%)",
          strings.sad + " (" + currentEmotionsData.sad + "%)",
          strings.surprise + " (" + currentEmotionsData.surprise + "%)",
          strings.contempt + " (" + currentEmotionsData.contempt + "%)",
        ],
        datasets: [
          {
            data: corporatedata,
            backgroundColor: [
              getColorCode("emotional", 5),
              getColorCode("emotional", 3),
              getColorCode("emotional", 4),
              getColorCode("emotional", 1),
              getColorCode("emotional", 6),
              getColorCode("emotional", 7),
              getColorCode("emotional", 2),
            ],
          },
        ],
      },
      options: {
        responsive: false,
        layout: {
          padding: {
            top: 20,
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
    getCurrentEmotions(params);
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
    getCurrentEmotions(params);
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
                {strings.current_emotions}
                <ReactTooltip
                  className="custom-tooltip"
                  anchorId="info-icon-emotions-id"
                />
                <img
                  id="info-icon-emotions-id"
                  data-tooltip-content={strings.current_emotions_tooltip}
                  src={iconInfoImg}
                  className="info-icon"
                  alt=""
                />
              </h6>
              <canvas height="300" id="chart-current-emotions"></canvas>
              <hr className="m-0 mr-t-16 mr-b-16" />
              <div className="chart-filter-box ">
                <button
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#currentEmotionFilter"
                  aria-controls="currentEmotionFilter"
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
        id="currentEmotionFilter"
        aria-labelledby="currentEmotionFilter"
      >
        <CurrentEmotionsFilter
          filterParams={getFilterParams()}
          onApplyFilter={(filterParams: any) => handleFilterClick(filterParams)}
        />
      </div>
    </>
  );
});

export default CurrentEmotionsGraph;
