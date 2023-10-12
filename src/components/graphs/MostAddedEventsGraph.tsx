import { Chart } from "chart.js";
import { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../assets/css/dashboard.css";
import iconCloseDarkImg from "../../assets/images/icon-close-dark.svg";
import { strings } from "../../constants/strings";
import {
  getColorCode,
  showServerError,
  getFilterDateLabel,
} from "../../constants/utils";
import {
  defaultLocationState,
  eventTypes,
  recurrenceTypes,
} from "../../constants/values";
import { useGetMostAddedEventMutation } from "../../redux/api/getMostAddedEventApi";
import MostAddedEventFilter from "../filters/MostAddedEventFilter";
import PageLoader from "../PageLoader";

const MostAddedEventsGraph = () => {
  const [locationData, setLocationData] = useState(defaultLocationState);
  const [filterStartDate, setFilterStartDate] = React.useState<Dayjs | null>(
    null
  );
  const [filterEndDate, setFilterEndDate] = React.useState<Dayjs | null>(null);
  const [eventType, setEventType] = useState(eventTypes);
  const [recurrence, setRecurrence] = useState(recurrenceTypes);

  const [getMostAddedEvent, { isLoading, isError, error, isSuccess, data }] =
    useGetMostAddedEventMutation();

  let colorCode = getColorCode("common", 6);

  const getMostAddedEventData = () => {
    const mostAddedEventCountArray: number[] = [];
    data?.data?.availableEvent?.forEach((element: { counts: number }) => {
      mostAddedEventCountArray.push(element?.counts);
    });
    return mostAddedEventCountArray;
  };

  const getMostAddedEventLabels = () => {
    const mostAddedEventLabelArray: string[] = [];
    data?.data?.availableEvent?.forEach((element: { name: string }) => {
      mostAddedEventLabelArray.push(element.name);
    });
    return mostAddedEventLabelArray;
  };

  useEffect(() => {
    const params = {
      availableEvent: [],
      startDate: "",
      endDate: "",
      eventType: [],
      countryId: 0,
      stateId: 0,
      cityId: 0,
      recurrence: 0,
    };
    getMostAddedEvent(params);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      createMostAddedEventChart();
    }
    if (isError) {
      showServerError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const createMostAddedEventChart = () => {
    const mostAddedEventChart = document.getElementById(
      "most-event-bar-chart"
    ) as HTMLCanvasElement;
    new Chart(mostAddedEventChart, {
      type: "bar",
      data: {
        labels: getMostAddedEventLabels(),
        datasets: [
          {
            backgroundColor: [
              colorCode,
              colorCode,
              colorCode,
              colorCode,
              colorCode,
            ],
            data: getMostAddedEventData(),
            borderRadius: 6,
            barThickness: 20,
          },
        ],
      },
      options: {
        maintainAspectRatio: true,
        indexAxis: "y",
        layout: {
          padding: {
            left: 0,
            right: 0,
          },
        },
        plugins: {
          legend: {
            display: false,
            labels: {
              padding: 10,
              color: "#444444",
              font: {
                size: 12,
              },
              usePointStyle: true,
            },
          },
        },
        scales: {
          y: {
            ticks: {
              mirror: true,
              labelOffset: -20,
              padding: 5,
            },
            grid: {
              display: false,
            },
          },
          x: {
            ticks: {
              precision: 0
            },
            grid: {
              display: false,
            },
          },
        },
      },
    });
  };

  const handleFilterClick = (filterParams: any) => {
    setFilterStartDate(filterParams?.filterStartDate || "");
    setFilterEndDate(filterParams?.filterEndDate || "");
    setEventType(filterParams?.availableEvent);
    setRecurrence(filterParams?.recurrenceData);
    const params = {
      startDate: filterParams?.filterStartDate || "",
      endDate: filterParams?.filterEndDate || "",
      eventType: filterParams?.eventType || "",
      recurrence: filterParams?.recurrence || 0,
      countryId: filterParams?.locationData.countryId || 0,
      stateId: filterParams?.locationData.stateId || 0,
      cityId: filterParams?.locationData.cityId || 0,
    };
    getMostAddedEvent(params);
    setLocationData(filterParams?.locationData);
  };

  const getFilterParams = () => {
    return {
      availableEvent: eventType,
      startDate: filterStartDate || "",
      endDate: filterEndDate || "",
      eventType: eventType || "",
      recurrence: recurrence || 0,
      locationData,
    };
  };
  const getRecurrence = () => {
    let recurrenceId = 0;
    recurrence.map((item) => {
      if (item?.checked) {
        recurrenceId = item.id;
      }
    });
    return recurrenceId;
  };
  const updateEventTypeFilter = (id: number) => {
    const newState = eventType.map((obj) => {
      if (obj?.id === id) {
        return { ...obj, checked: false };
      }
      return { ...obj };
    });
    setEventType(newState);
    const params = {
      availableEvent: [],
      startDate: filterStartDate || "",
      endDate: filterEndDate || "",
      eventType: getEventType(newState),
      recurrence: getRecurrence(),
      countryId: 0,
      stateId: 0,
      cityId: 0,
    };
    getMostAddedEvent(params);
  };
  const updateRecurrenceFilter = (id: number) => {
    const newState = recurrence.map((obj) => {
      if (obj?.id === id) {
        return { ...obj, checked: false };
      }
      return { ...obj };
    });
    setRecurrence(newState);
    const params = {
      availableEvent: [],
      startDate: filterStartDate || "",
      endDate: filterEndDate || "",
      eventType: getEventType(newState),
      recurrence: getRecurrence(),
      countryId: 0,
      stateId: 0,
      cityId: 0,
    };
    getMostAddedEvent(params);
  };
  const getEventType = (eventType: any[]) => {
    const selectArray: number[] = [];
    eventType.map((item) => {
      if (item.checked) {
        selectArray.push(item.id);
      }
    });
    return selectArray;
  };

  const removeChip = (
    startDate: string,
    endDate: string,
    countryValue: number,
    stateValue: number,
    cityValue: number
  ) => {
    const params = {
      startDate: startDate || "",
      endDate: endDate || "",
      eventType: getEventType(eventType),
      recurrence: getRecurrence(),
      countryId: countryValue || 0,
      stateId: stateValue || 0,
      cityId: cityValue || 0,
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
    getMostAddedEvent(params);
  };
  return (
    <>
      <div className="col-lg-6 mr-b-24">
        <div className="card border-radius-12 border-light coach-detail-graph">
          {isLoading ? (
            <PageLoader />
          ) : (
            <div className="card-body pd-all-20">
              <h6 className="body-text-emphasis text-dark-grey mr-b-16">
                {strings.most_added_events}
              </h6>
              {data?.data?.availableEvent?.length == 0 ? (
                <div className="no-data-found-graph domains-compare">
                  {strings.no_data_found_for_compare_domains}
                </div>
              ) : null}
              <canvas height="300" id="most-event-bar-chart"></canvas>
              <hr className="m-0 mr-t-16 mr-b-16" />
              <div className="chart-filter-box ">
                <button
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasAddedEvent"
                  aria-controls="offcanvasAddedEvent"
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
                  {eventType
                    .filter((item) => item?.checked == true)
                    .map((item, index) => (
                      <li key={item.id} className="chip">
                        <div className="chip-label">{item?.type}</div>
                        <Link className="chip-btn" to={""}>
                          <img
                            src={iconCloseDarkImg}
                            alt=""
                            onClick={() => {
                              updateEventTypeFilter(item?.id);
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
                              filterStartDate,
                              filterEndDate,
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
                              filterStartDate,
                              filterEndDate,
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
                          onClick={() =>
                            removeChip(
                              filterStartDate,
                              filterEndDate,
                              locationData?.countryId,
                              locationData?.stateId,
                              0
                            )
                          }
                        />
                      </Link>
                    </li>
                  )}
                  {recurrence
                    .filter((item) => item?.checked == true)
                    .map((item, index) => (
                      <li key={item.id} className="chip">
                        <div className="chip-label">{item?.type}</div>
                        <Link className="chip-btn" to={""}>
                          <img
                            src={iconCloseDarkImg}
                            alt=""
                            onClick={() => {
                              updateRecurrenceFilter(item?.id);
                            }}
                          />
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        <div
          className="offcanvas offcanvas-end"
          tabIndex={-1}
          id="offcanvasAddedEvent"
          aria-labelledby="offcanvasAddedEvent"
        >
          <MostAddedEventFilter
            filterParams={getFilterParams()}
            onApplyFilter={(filterParams: any) =>
              handleFilterClick(filterParams)
            }
          />
        </div>
      </div>
    </>
  );
};

export default MostAddedEventsGraph;
