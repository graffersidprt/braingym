import { strings } from "../../constants/strings";
import { Chart } from "chart.js";
import "../../assets/css/dashboard.css";
import { useEffect, useState } from "react";
import iconCloseDarkImg from "../../assets/images/icon-close-dark.svg";
import { useGetMostSharedResourcesMutation } from "../../redux/api/getMostSharedResourcesApi";
import {
  showServerError,
  getColorCode,
  formatFilterDate,
  getFilterDateLabel,
} from "../../constants/utils";
import PageLoader from "../PageLoader";
import { Link } from "react-router-dom";
import React from "react";
import { Dayjs } from "dayjs";
import MostSharedResouresFilter from "../filters/MostSharedResourcesFilter";
import { defaultResourcesTypes } from "../../constants/values";

const MostSharedResourcesGraph = () => {
  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);
  const [resourcesType, setResourcesType] = useState(defaultResourcesTypes);
  const [
    getMostSharedResources,
    { isLoading, isError, error, isSuccess, data },
  ] = useGetMostSharedResourcesMutation();
  let colorCode = getColorCode("common", 5);

  useEffect(() => {
    const params = {
      fromDate: "",
      toDate: "",
      externalResource: [],
      date: "",
      resourceFilter: [],
      availableExternalResource: [],
    };
    getMostSharedResources(params);
  }, []);

  const getMostSharedResourcesData = () => {
    const mostSharedCountArray: number[] = [];
    data?.data?.availableExternalResource?.forEach(
      (element: { sharedCount: number }) => {
        mostSharedCountArray.push(element?.sharedCount);
      }
    );
    return mostSharedCountArray;
  };
  const getMostSharedResourcesLabels = () => {
    const mostSharedResourceLabelArray: string[] = [];
    data?.data?.availableExternalResource?.forEach(
      (element: { name: string; type: string }) => {
        mostSharedResourceLabelArray.push(element.name + " - " + element.type);
      }
    );
    return mostSharedResourceLabelArray;
  };
  useEffect(() => {
    if (isSuccess) {
      createMostSharedResourcesChart();
    }
    if (isError) {
      showServerError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);
  const createMostSharedResourcesChart = () => {
    const externalresourcesChart = document.getElementById(
      "most-shared-resource-bar-chart"
    ) as HTMLCanvasElement;

    new Chart(externalresourcesChart, {
      type: "bar",
      data: {
        labels: getMostSharedResourcesLabels(),
        datasets: [
          {
            backgroundColor: [
              colorCode,
              colorCode,
              colorCode,
              colorCode,
              colorCode,
            ],
            data: getMostSharedResourcesData(),
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
  /*  call on apply click and update state*/
  const handleFilterClick = (filterParams: any) => {
    setStartDate(filterParams?.fromDate || "");
    setEndDate(filterParams?.toDate || "");
    setResourcesType(filterParams?.resourcesType);
    const params = {
      fromDate: filterParams?.fromDate || "",
      toDate: filterParams?.toDate || "",
      externalResource: filterParams?.externalResource,
      date: "",
      resourceFilter: [],
      availableExternalResource: [],
    };

    getMostSharedResources(params);
  };
  const getFilterParams = () => {
    return {
      startDate: startDate || "",
      endDate: endDate || "",
      externalResource: resourcesType,
      date: "",
      resourceFilter: [],
      availableExternalResource: [],
    };
  };
  const getSelectedResources = (resourcesType: any[]) => {
    const selectArray: number[] = [];
    resourcesType.map((item) => {
      if (item.checked) {
        selectArray.push(item.id);
      }
    });

    return selectArray;
  };
  /** update data when chip remove */
  const updateResourcesFilter = (item: any) => {
    console.log("item", item);
    const newState = resourcesType.map((obj) => {
      if (obj.id === item.id) {
        return { ...obj, checked: false };
      }
      return { ...obj };
    });
    setResourcesType(newState);
    const params = {
      fromDate: startDate ? formatFilterDate(startDate) : "",
      toDate: endDate ? formatFilterDate(endDate) : "",
      externalResource: getSelectedResources(newState),
      date: "",
      resourceFilter: [],
      availableExternalResource: [],
    };
    getMostSharedResources(params);
  };
  const removeChip = (startDate: string, endDate: string) => {
    setStartDate(startDate);
    setEndDate(endDate);
    const params = {
      fromDate: startDate || "",
      toDate: endDate || "",
      externalResource: getSelectedResources(resourcesType),
      date: "",
      resourceFilter: [],
      availableExternalResource: [],
    };
    getMostSharedResources(params);
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
                {strings.most_shared_resources}
              </h6>

              {data?.data?.availableExternalResource?.length == 0 ? (
                <div className="no-data-found-graph domains-compare">
                  {strings.no_data_found_for_compare_domains}
                </div>
              ) : null}
              <canvas height="300" id="most-shared-resource-bar-chart"></canvas>
              <hr className="m-0 mr-t-16 mr-b-16" />
              <div className="chart-filter-box ">
                <button
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasExternalResources"
                  aria-controls="offcanvasExternalResources"
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
                          onClick={() => removeChip("", "")}
                        />
                      </Link>
                    </li>
                  )}
                  {resourcesType
                    .filter((item) => item?.checked == true)
                    .map((item, index) => (
                      <li key={item.id} className="chip">
                        <div className="chip-label">{item?.type}</div>
                        <Link className="chip-btn" to={""}>
                          <img
                            src={iconCloseDarkImg}
                            alt=""
                            onClick={() => {
                              updateResourcesFilter(item);
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
          id="offcanvasExternalResources"
          aria-labelledby="offcanvasExternalResources"
        >
          <MostSharedResouresFilter
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

export default MostSharedResourcesGraph;
