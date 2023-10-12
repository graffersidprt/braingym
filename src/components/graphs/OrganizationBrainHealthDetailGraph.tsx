import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "../../assets/css/dashboard.css"; //Dasboard CSS
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { strings } from "../../constants/strings";
import { useGetDomainsNameMutation } from "../../redux/api/getDomainsNameApi";
import { useGetCorporateDomainComparisonMutation } from "../../redux/api/getCorporateDomainComparisonApi";
import {
  BarChartItem,
  DomainItem,
  IBrainHealthSData,
  IDomainName,
} from "../../redux/api/types";
import { showServerError, getColorCode, getDepartmentParams, getBarPercentage, isEmptyOrNull } from "../../constants/utils";
import PageLoader from "../PageLoader";
import OverallBrainHealthGraph from "./OverallBrainHealthGraph";
import {
  defaultGenderState,
  defaultLocationState,
} from "../../constants/values";
import { Dayjs } from "dayjs";
const OrganizationBrainHealthDetailGraph = forwardRef((props, ref) => {
  const [filterStartDate, setFilterStartDate] = useState<Dayjs | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Dayjs | null>(null);
  const [locationData, setLocationData] = useState(defaultLocationState);
  const [genderData, setGenderData] = useState(defaultGenderState);
  const [departmentData, setDepartmentData] = useState([]);
  const [filterType, setFilterType] = useState<number>(0);

  useImperativeHandle(ref, () => ({
    applyFilter(filterParams: any) {
      setFilterType(1);
      setFilterStartDate(filterParams?.startDate || "");
      setFilterEndDate(filterParams?.endDate || "");
      setLocationData(filterParams?.locationData);
      setGenderData(filterParams?.genderData);
      setDepartmentData(filterParams?.departmentData);
      filterCorporateDomainComparisonApi(
        selectedDomain?.domainId || 0,
        filterParams
      );
      if (childRef) {
        childRef?.current?.applyFilter(filterParams);
      }
    },
  }));
  Chart.register(...registerables);
  // Register the plugin to all charts:
  Chart.register(ChartDataLabels);
  const [
    getDomainsName,
    {
      isLoading: isLoadingGetDomainsName,
      isError: isErrorGetDomainsName,
      error: errorGetDomainsName,
      isSuccess: isSuccessGetDomainsName,
      data: dataGetDomainsName,
    },
  ] = useGetDomainsNameMutation();
  const [
    getCorporateDomainComparison,
    { isLoading, isError, error, isSuccess, data },
  ] = useGetCorporateDomainComparisonMutation();
  useEffect(() => {
    getDomainsName(false);
  }, []);
  const filterCorporateDomainComparisonApi = (
    domainId: number,
    filterParams: any
  ) => {
    const params = {
      startDate: filterParams?.startDate || "",
      endDate: filterParams?.endDate || "",
      countryId: filterParams?.locationData?.countryId || 0,
      stateId: filterParams?.locationData?.stateId || 0,
      cityId: filterParams?.locationData?.cityId || 0,
      filterType: getFilterType(filterParams?.startDate,filterParams?.endDate,filterParams?.locationData?.countryId, filterParams?.locationData?.stateId, filterParams?.locationData?.cityId, filterParams?.genderData?.genderId, getDepartmentParams(filterParams?.departmentData)),
      day: "",
      week: "",
      month: "",
      year: "",
      childDomainId: [],
      coachFilterType: 0,
      genderId: filterParams?.genderData?.genderId,
      userId: 0,
      department: getDepartmentParams(filterParams?.departmentData),
      domainId: domainId,
    };
    getCorporateDomainComparison(params);
  };
  const getFilterType= ( startDate: any,
    endDate: any,
    countryValue: number,
    stateValue: number,
    cityValue: number,
    genderValue: number,
    departmentValue: any[]) =>{
   if(isEmptyOrNull(startDate) && isEmptyOrNull(endDate) && countryValue==0 && stateValue==0 && cityValue==0 && genderValue==0  && departmentValue.length==0)
   return 0
  
   return 1;
  }
  const callCorporateDomainComparisonApi = (domainId: number) => {
    const params = {
      filterType: getFilterType(filterStartDate,filterEndDate,locationData?.countryId, locationData?.stateId, locationData?.cityId, genderData?.genderId, getDepartmentParams(departmentData)),
      day: "",
      week: "",
      month: "",
      year: "",
      domainId: domainId,
      childDomainId: [],
      coachFilterType: 0,
      startDate: filterStartDate || "",
      endDate: filterEndDate || "",
      countryId: locationData?.countryId || 0,
      stateId: locationData?.stateId || 0,
      cityId: locationData?.cityId || 0,
      department: getDepartmentParams(departmentData),
      genderId: genderData?.genderId,
    };
    getCorporateDomainComparison(params);
  };
  const getDomainsData = (domainItem: IDomainName) => {
    callCorporateDomainComparisonApi(domainItem?.domainId);
  };

  useEffect(() => {
    if (isSuccess) {
      createOverAllScoreChart(data?.data?.graphData);
      if (data?.data?.graphData?.graphDomains && data?.data?.graphData?.graphDomains.length>0)
       createOverAllScoreBarChart();
    }
    if (isError) {
      showServerError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    if (isSuccessGetDomainsName) {
      if (dataGetDomainsName?.data?.domainNames.length > 0) {
        const domainItem = dataGetDomainsName?.data?.domainNames[0];
        getDomainsData(domainItem);
        setSelectedDomain(domainItem);
      }
    }
    if (isErrorGetDomainsName) {
      showServerError(errorGetDomainsName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingGetDomainsName]);

  const getDoughnutChart = (overAllScore: number) => {
    const doughnutChartArray = [];
    doughnutChartArray.push(overAllScore);
    doughnutChartArray.push(100 - overAllScore);
    return doughnutChartArray;
  };

  const createOverAllScoreChart = (brainHealthData: IBrainHealthSData) => {
    const corporatechart = document.getElementById(
      "domain-comparison-over-all-score"
    ) as HTMLCanvasElement;
    var corporatedata = getDoughnutChart(brainHealthData?.overAllScore || 0);

    new Chart(corporatechart, {
      type: "doughnut",
      data: {
        labels: [strings.active, strings.inactive],
        datasets: [
          {
            label: strings.overall_score,
            data: corporatedata,
            backgroundColor: [
              getColorCode("domain", selectedDomain?.domainId || 1),
              getColorCode("common", 7),
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
  const getChildDomainReocrd = (domainData: DomainItem[]) => {
    const chartDataArray: BarChartItem[] = [];

    domainData.forEach((element, index) => {
      const item = {
        label: element?.name || "",
        data: [element?.score],
        backgroundColor: getColorCode("subDomain", element?.id || 0) || "",
        borderRadius: 8,
        barPercentage: getBarPercentage(domainData?.length),
        categoryPercentage: 1.0,
      };
      chartDataArray.push(item);
    });
    return chartDataArray;
  };
  const createOverAllScoreBarChart = () => {
    const corporatechart = document.getElementById(
      "domain-comparison-domain-bar"
    ) as HTMLCanvasElement;

    new Chart(corporatechart, {
      type: "bar",
      data: {
        labels: [""],
        datasets: getChildDomainReocrd(data?.data?.graphData?.graphDomains),
      },
      options: {
        scales: {
          y: {
           ticks: {
             precision: 0,
           },
         },
       },
        maintainAspectRatio: true,
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

  const [selectedDomain, setSelectedDomain] = useState<IDomainName>();
  const handleClickOnDomain = (item: IDomainName) => {
    setSelectedDomain(item);
    getDomainsData(item);
  };
  const childRef = useRef<any>();

  return (
    <>
      <section className="Users-section fixed-height">
        <div className="row">
          <OverallBrainHealthGraph ref={childRef} />
          <div className="col-xl-8 col-lg-8 col-md-12 mr-b-24">
            <div className="card border-radius-12 border-light coach-detail-graph">
              {isLoading || isLoadingGetDomainsName ? (
                <PageLoader />
              ) : (
                <div className="card-body  pd-all-20 ">
                  <div className="graph-header-justify">
                    <nav className="navbar-well-being">
                      <ul className="navbar-nav">
                        <li className="nav-item dropdown well-being">
                          <a
                            className="nav-link dropdown-toggle"
                            href="#"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <h6 className="body-text-emphasis text-dark-grey mr-b-16">
                              {selectedDomain?.name || strings.select_domain}
                            </h6>
                          </a>
                          <ul className="dropdown-menu">
                            {dataGetDomainsName?.data?.domainNames?.map(
                              (item: IDomainName) => (
                                <li key={item.domainId}
                                  onClick={() => {
                                    handleClickOnDomain(item);
                                  }}
                                >
                                  <span className="dropdown-item">
                                    {item.name}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                  {data?.data?.graphData?.graphDomains ? (
                    <div className="row">
                      <div className="col-xl-4 col-lg-4 col-md-12">
                        {data?.data?.graphData?.overAllScore !== undefined ? (
                          <>
                            <span
                              className="overall-score"
                              style={{
                                position: "absolute",
                                top: 175,
                                left: 96,
                              }}
                            >
                              {data?.data?.graphData?.overAllScore} <br />
                              <span>{strings.overall_score}</span>
                            </span>
                            <canvas
                              height="250"
                              width="230"
                              id="domain-comparison-over-all-score"
                            ></canvas>
                          </>
                        ) : null}
                      </div>
                      <div className="col-xl-8 col-lg-8 col-md-12">
                        <div className="card-body-graph">
                          {data?.data.graphData?.graphDomains.length == 0 && (
                            <div className="no-data-found-graph brain-health">
                              {strings.no_data_found_for_compare_domains}
                            </div>
                          )}
                          {data?.data?.graphData?.graphDomains && data?.data?.graphData?.graphDomains.length>0 && (
                            <canvas
                              height="250"
                              id="domain-comparison-domain-bar"
                            ></canvas>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="no-data-found">
                      <span>{data?.data?.message}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
});

export default OrganizationBrainHealthDetailGraph;
