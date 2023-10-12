import { Chart } from "chart.js";
import { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../assets/css/dashboard.css";
import iconCloseDarkImg from "../../assets/images/icon-close-dark.svg";
import { strings } from "../../constants/strings";
import {
  getColorCode,
  getFilterDateLabel,
  getInitialStarData,
  showServerError,
} from "../../constants/utils";
import { useGetCoachRatingGraphMutation } from "../../redux/api/coachRatingGraphApi";
import { BarChartItem } from "../../redux/api/types";
import PageLoader from "../PageLoader";

import { defaultLocationState, ratingType } from "../../constants/values";
import CoachRatingFilter from "../filters/CoachRatingFilter";

const CoachRatingGraph = () => {
  const [getCoachRatingGraph, { isLoading, isError, error, isSuccess, data }] =
    useGetCoachRatingGraphMutation();
  let colorCode = getColorCode("common", 2);

  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [locationData, setLocationData] = useState(defaultLocationState);
  const [rating, setRating] = useState(ratingType);

  const getBarChartData = () => {
    const chartDataArray: BarChartItem[] = getInitialStarData();
    const chartDataUpdateArray: number[] = [];

    chartDataArray.forEach((element, index) => {
      chartDataUpdateArray.push(data?.data["star" + (index + 1)]);
    });
    return chartDataUpdateArray;
  };

  const getBarChartLabels = () => {
    const chartDataArray: BarChartItem[] = getInitialStarData();
    const chartDataLabelArray: string[] = [];
    chartDataArray.forEach((element, index) => {
      chartDataLabelArray.push(element.label);
    });
    return chartDataLabelArray;
  };

  const createCoachRatingChart = () => {
    let coachRatingChartRef = document.getElementById(
      "coach-rating-bar-chart"
    ) as HTMLCanvasElement;

    new Chart(coachRatingChartRef, {
      type: "bar",
      data: {
        labels: getBarChartLabels(),
        datasets: [
          {
            label: strings.coach_rating,
            backgroundColor: [
              colorCode,
              colorCode,
              colorCode,
              colorCode,
              colorCode,
            ],
            data: getBarChartData(),
            borderRadius: 8,
            barThickness: 30,
          },
        ],
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 12,
            },
          },
          title: {
            display: true,
            text: strings.no_of_coach,
            color: "#666666",
            position: "left",
            font: {
              size: 14,
              weight: "normal",
            },
          },
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            ticks: {
              precision: 0,
              showLabelBackdrop: false,
              autoSkip: false,
              stepSize: 5,
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 12,
              },
            },
          },
        },
      },
    });
  };

  const getRating = (rating: any[]) => {
    const array = rating.filter((item) => item.checked == true);
    let ratingNewArray:string[] = [];
    array.map((item, index) => {
      if (item.checked) {
        ratingNewArray.push(item.star);
         
      }
    });
    return ratingNewArray;
  };

  const updateRatingFilter = (item: any) => {
    const newState = rating.map((obj, newIndex) => {
      if (obj.star === item.star) {
        return { ...obj, checked: false };
      }
      return { ...obj };
    });
    setRating(newState);
    const params = {
      startDate: startDate || "",
      endDate: endDate || "",
      rating: getRating(newState),
      countryId: 0,
      stateId: 0,
      cityId: 0,
    };
    getCoachRatingGraph(params);
  };

  const handleFilterClick = (filterParams: any) => {
    setStartDate(filterParams?.startDate || "");
    setEndDate(filterParams?.endDate || "");
    setRating(filterParams?.rating);
    const params = {
      startDate: filterParams?.startDate || "",
      endDate: filterParams?.endDate || "",
      rating: getRating(filterParams?.rating),
      countryId: filterParams?.locationData.countryId || 0,
      stateId: filterParams?.locationData.stateId || 0,
      cityId: filterParams?.locationData.cityId || 0,
     };
    getCoachRatingGraph(params);
    setLocationData(filterParams?.locationData);
  };

  const removeChip = (
    startDate: string,
    endDate: string,
    countryValue: number,
    stateValue: number,
    cityValue: number
  ) => {
    setLocationData({
      countryId: countryValue,
      countryName: countryValue === 0 ? "" : locationData?.countryName,
      stateId: stateValue,
      stateName: stateValue === 0 ? "" : locationData?.stateName,
      cityId: cityValue,
      cityName: cityValue === 0 ? "" : locationData?.cityName,
    });
    setStartDate(startDate);
    setEndDate(endDate);
    const params = {
      startDate: startDate || "",
      endDate: endDate || "",
      rating: getRating(rating),
      countryId: countryValue,
      stateId: stateValue,
      cityId: cityValue,
    };
    getCoachRatingGraph(params);
  };

  const getFilterParams = () => {
    return {
      startDate: startDate || "",
      endDate: endDate || "",
      rating: rating || "",
      locationData,
    };
  };

  useEffect(() => {
    const params = {
      startDate: startDate || "",
      endDate: endDate || "",
      rating: getRating(rating),
      countryId: locationData.countryId || 0,
      stateId: locationData.stateId || 0,
      cityId: locationData.cityId || 0,
    };
    getCoachRatingGraph(params);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      createCoachRatingChart();
    }
    if (isError) {
      showServerError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <>
      <div className="col-xl-6 col-lg-6 col-md-12 mr-b-24">
        <div className="card border-radius-12 border-light coach-detail-graph">
          {isLoading ? (
            <PageLoader />
          ) : (
            <div className="card-body pd-all-20">
              <h6 className="body-text-emphasis text-dark-grey mr-b-16">
                {strings.coach_rating}
              </h6>
              <canvas height="300" id="coach-rating-bar-chart"></canvas>
              <hr className="m-0 mr-t-16 mr-b-16" />
              <div className="chart-filter-box ">
                <button
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#coachRatingFilter"
                  aria-controls="coachRatingFilter"
                  className="filter-btn "
                >
                  <i className="icon-filter fs-16 mr-r-6"></i> {strings.filter}
                </button>
                {/* UI for chip */}
                <ul className="chip-group unique-id-list filter-list">
                  {startDate && endDate && (
                    <li className="chip">
                      <div className="chip-label">
                        {getFilterDateLabel(startDate, endDate)}
                      </div>
                      <Link className="chip-btn" to={""}>
                        <img
                          src={iconCloseDarkImg}
                          alt=""
                          onClick={() =>
                            removeChip(
                              "",
                              "",
                              locationData?.countryId,
                              locationData?.stateId,
                              locationData?.cityId
                            )
                          }
                        />
                      </Link>
                    </li>
                  )}
                  {rating
                    .filter((item) => item?.checked == true)
                    .map((item, index) => (
                      <li key={index} className="chip">
                        <div className="chip-label">
                          {strings.star + ": " + item?.star}
                        </div>
                        <Link className="chip-btn" to={""}>
                          <img
                            src={iconCloseDarkImg}
                            alt=""
                            onClick={() => {
                              updateRatingFilter(item);
                            }}
                          />
                        </Link>
                      </li>
                    ))}
                  {locationData.countryName && (
                    <li className="chip">
                      <div className="chip-label">
                        {locationData.countryName}
                      </div>
                      <Link className="chip-btn" to={""}>
                        <img
                          src={iconCloseDarkImg}
                          alt=""
                          onClick={() =>
                            removeChip(
                              startDate,
                              endDate,
                              0,
                              locationData?.stateId,
                              locationData?.cityId
                            )
                          }
                        />
                      </Link>
                    </li>
                  )}
                  {locationData.stateName && (
                    <li className="chip">
                      <div className="chip-label">{locationData.stateName}</div>
                      <Link className="chip-btn" to={""}>
                        <img
                          src={iconCloseDarkImg}
                          alt=""
                          onClick={() =>
                            removeChip(
                              startDate,
                              endDate,
                              locationData?.countryId,
                              0,
                              locationData?.cityId
                            )
                          }
                        />
                      </Link>
                    </li>
                  )}
                  {locationData.cityName && (
                    <li className="chip">
                      <div className="chip-label">{locationData.cityName}</div>
                      <Link className="chip-btn" to={""}>
                        <img
                          src={iconCloseDarkImg}
                          alt=""
                          onClick={() => {
                            removeChip(
                              startDate,
                              endDate,
                              locationData?.countryId,
                              locationData?.stateId,
                              0
                            );
                          }}
                        />
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
        <div
          className="offcanvas offcanvas-end"
          tabIndex={-1}
          id="coachRatingFilter"
          aria-labelledby="coachRatingFilter"
        >
          <CoachRatingFilter
            filterParams={getFilterParams()}
            onApplyFilter={(filterParams: any) => {
              handleFilterClick(filterParams);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default CoachRatingGraph;
