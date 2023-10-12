import iconCloseDarkImg from "../../assets/images/icon-close-dark.svg";
import { strings } from "../../constants/strings";
import { Chart } from "chart.js";
import "../../assets/css/dashboard.css";
import { useEffect, useState } from "react";
import {
  showServerError,
  getColorCode,
  getFilterDateLabel,
} from "../../constants/utils";
import PageLoader from "../PageLoader";
import { useGetMessagesCallsMutation } from "../../redux/api/messagesCallsApi";
import MessageAndCallsFilter from "../filters/MessageAndCallsFilter";
import { defaultLocationState } from "../../constants/values";
import { Dayjs } from "dayjs";
import { Link } from "react-router-dom";

const MessagesAndCallsGraph = () => {
  const [getMessagesAndCalls, { isLoading, isError, error, isSuccess, data }] =
    useGetMessagesCallsMutation();
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [locationData, setLocationData] = useState(defaultLocationState);

  useEffect(() => {
    getMessagesAndCalls("");
  }, []);

  const messagesData: any = [];
  const callsData: any = [];
  const datesData: any = [];

  useEffect(() => {
    if (isSuccess) {
      if (data && data.data.messagesCallReport) {
        for (let i = 0; i < data.data.messagesCallReport.length; i++) {
          messagesData.push(data.data.messagesCallReport[i].message);
          callsData.push(data.data.messagesCallReport[i].call);
          datesData.push(data.data.messagesCallReport[i].date);
        }
      }
      createMessagesAndCallsChart();
    }
    if (isError) {
      showServerError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const createMessagesAndCallsChart = () => {
    let messagesAndCallsChart = document.getElementById(
      "messages-and-calls-chart"
    ) as HTMLCanvasElement;

    new Chart(messagesAndCallsChart, {
      type: "line",
      data: {
        labels: datesData,
        datasets: [
          {
            label: strings.messages,
            data: messagesData,
            borderColor: getColorCode("common", 3),
          },
          {
            label: strings.calls,
            data: callsData,
            borderColor: getColorCode("common", 4),
          },
        ],
      },
      options: {
        elements: {
          line: {
            tension: 0.8,
          },
        },
        bezierCurve: false,
        responsive: false,
        layout: {
          padding: {
            top: 20,
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
            font: {
              weight: "400",
              size: 12,
            },
            color: "#666666",
            display: true,
            formatter: function (value, ctx) {
              if (value == 0) return "";
              else return value;
            },
          },
          title: {
            display: true,
            text: strings.count,
            color: "#666666",
            position: "left",
            font: {
              size: 14,
              weight: "normal",
            },
          },
          legend: {
            labels: {
              padding: 40,
              color: "#666666",
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

  const getFilterParams = () => {
    return {
      startDate: startDate || "",
      endDate: endDate || "",
      locationData,
    };
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
      countryId: locationData.countryId || 0,
      stateId: locationData.stateId || 0,
      cityId: locationData.cityId || 0,
    };
    // TODO: API Down HERE
  };

  const handleFilterClick = (filterParams: any) => {
    setStartDate(filterParams?.startDate || "");
    setEndDate(filterParams?.endDate || "");
    const params = {
      startDate: filterParams?.startDate || "",
      endDate: filterParams?.endDate || "",
      countryId: filterParams?.locationData.countryId || 0,
      stateId: filterParams?.locationData.stateId || 0,
      cityId: filterParams?.locationData.cityId || 0,
    };
    // TODO: API down here

    setLocationData(filterParams?.locationData);
  };

  return (
    <>
      <div className="col-xl-6 col-lg-6 col-md-12 mr-b-24">
        <div className="card border-radius-12 border-light coach-detail-graph">
          {isLoading ? (
            <PageLoader />
          ) : (
            <div className="card-body pd-all-20">
              <h6 className="body-text-emphasis text-dark-grey mr-b-16">
                {strings.messages_and_calls}
              </h6>

              <canvas
                height="300"
                width="500"
                className="mx-auto"
                id="messages-and-calls-chart"
              ></canvas>

              <hr className="m-0 mr-t-16 mr-b-16" />
              <div className="chart-filter-box ">
                <button
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#messageAndCallsFilter"
                  aria-controls="messageAndCallsFilter"
                  className="filter-btn "
                >
                  <i className="icon-filter fs-16 mr-r-6"></i> {strings.filter}
                </button>
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
          id="messageAndCallsFilter"
          aria-labelledby="messageAndCallsFilter"
        >
          <MessageAndCallsFilter
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

export default MessagesAndCallsGraph;
