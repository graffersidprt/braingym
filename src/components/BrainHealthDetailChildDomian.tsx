import { strings } from "../constants/strings";
import { Link } from "react-router-dom";
import iconCloseDarkImg from "../assets/images/icon-close-chip.svg";
import iconCloseGrayImg from "../assets/images/icon-close-dark.svg";
import iconPlusImg from "../assets/images/icon-plus.svg";
import DomainsGraph from "./graphs/DomainsGraph";
import BrainHealthDomainsComparisonGraph from "./graphs/BrainHealthDomainsComparisonGraph";
import { useGetDomainsNameMutation } from "../redux/api/getDomainsNameApi";
import { useGetCorporateDomainComparisonMutation } from "../redux/api/getCorporateDomainComparisonApi";

import { getDepartmentParams, getFilterDateLabel, isEmptyOrNull, showServerError } from "../constants/utils";
import { useEffect, useState } from "react";
import { IDomainName } from "../redux/api/types";
import { toast } from "react-toastify";
import { Dayjs } from "dayjs";
import {
  defaultGenderState,
  defaultLocationState,
} from "../constants/values";
import DomainComparisonGraphFilter from "./filters/DomainComparisonGraphFilter";

const BrainHealthDetailChildDomain = () => {
  const [filterStartDate, setFilterStartDate] = useState<Dayjs | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Dayjs | null>(null);
  const [locationData, setLocationData] = useState(defaultLocationState);
  const [genderData, setGenderData] = useState(defaultGenderState);
  const [departmentData, setDepartmentData] = useState<any[]>([]);

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
  const [domainList, setDomainList] = useState<any[]>([]);

  const callCorporateDomainComparisonApi = (domainIds: number[]) => {
    
    const params = {
      filterType: getFilterType(filterStartDate,filterEndDate),
      day: "",
      week: "",
      month: "",
      year: "",
      domainId: 0,
      childDomainId: domainIds,
      coachFilterType: 0,
      userId: 0,
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
  useEffect(() => {
    getDomainsName(true);
    callCorporateDomainComparisonApi([],0);
  }, []);

  useEffect(() => {
    if (isSuccessGetDomainsName) {
      setDomainList(dataGetDomainsName?.data?.domainNames);
    }
    if (isErrorGetDomainsName) {
      showServerError(errorGetDomainsName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingGetDomainsName]);
  useEffect(() => {
    if (isSuccess) {
    }
    if (isError) {
      showServerError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);
  const getSelectedCss = (item: IDomainName) => {
    if (item.selected) return "selected";
    else return "unselected";
  };
  const handleDomainChange = (item: IDomainName, index: number) => {
    if (getSelectedDomainIds(domainList)?.length < 5 || item?.selected) {
      const newState = domainList?.map((obj, newIndex) => {
        if (newIndex === index) {
          return { ...obj, selected: obj?.selected ? false : true };
        }
        return obj;
      });
      setDomainList(newState);
      callCorporateDomainComparisonApi(getSelectedDomainIds(newState));
    } else {
      toast.error(strings.domain_select_error, {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };
  const getSelectedDomainIds = (domainList: any[]) => {
    const domainIds: number[] = [];
    domainList.map((item) => {
      if (item.selected) {
        domainIds.push(item.childDomainId);
      }
    });
    return domainIds;
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
      filterType: getFilterType(filterParams?.startDate,filterParams?.endDate),
      day: "",
      week: "",
      month: "",
      year: "",
      domainId: 0,
      childDomainId: getSelectedDomainIds(domainList),
      coachFilterType: 0,
      genderId: filterParams?.genderData?.genderId,
      userId: 0,
      department: getDepartmentParams(filterParams?.departmentData),
    };
    getCorporateDomainComparison(params);
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
const getFilterType= ( startDate: string,
  endDate: string) =>{
 if(isEmptyOrNull(startDate) && isEmptyOrNull(endDate))
 return 0

 return 1;
}
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
      childDomainId: getSelectedDomainIds(domainList),
      coachFilterType: 0,
      countryId: countryValue || 0,
      stateId: stateValue || 0,
      cityId: cityValue || 0,
      genderId: genderValue,
      userId: 0,
      day: "",
      week: "",
      month: "",
      year: "",
      domainId: 0,
      department: getDepartmentParams(departmentValue),
      filterType: getFilterType(startDate,endDate),
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
    getCorporateDomainComparison(params);
  };

  return (
    <>
      <div className="detail-heading-row">
        <div className="detail-heading">
          <span className="compare-domains-detail">
            {strings.compare_domains}
          </span>
          <span className="detail-heading-select">{strings.select_up_to}</span>
        </div>
        <div className="chart-filter-row">
          <ul className="detail-chip-group unique-id-list filter-list">
            {filterStartDate && filterEndDate && (
              <li className="chip">
                <div className="chip-label">
                  {getFilterDateLabel(filterStartDate, filterEndDate)}
                </div>
                <Link className="chip-btn" to={""}>
                  <img
                    src={iconCloseGrayImg}
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
                    src={iconCloseGrayImg}
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
                    src={iconCloseGrayImg}
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
                    src={iconCloseGrayImg}
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
                    src={iconCloseGrayImg}
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
                      <li key={index} className="chip">
                          <div className="chip-label">
                            {item?.name}
                          </div>
                          <Link className="chip-btn" to={""}>
                            <img
                              src={iconCloseGrayImg}
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
          <button
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#chilDomainDetailFilter"
            aria-controls="chilDomainDetailFilter"
            className="filter-btn pdl"
          >
            <i className="icon-filter fs-16 mr-r-6"></i>
            {strings.filter}
          </button>
        </div>
      </div>
      <div className="detail-chart-filter-box">
        <div className="domain-chip-group">
          {domainList?.map((item: IDomainName, index: number) => (
            <div
              key={index}
              onClick={() => {
                handleDomainChange(item, index);
              }}
              className={"domain-chip " + getSelectedCss(item)}
            >
              <span className={"domain-chip-label " + getSelectedCss(item)}>
                {item.name}
              </span>
              <div className="domain-chip-btn">
                <img
                  src={!item.selected ? iconPlusImg : iconCloseDarkImg}
                  alt=""
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="row">
        <DomainsGraph
          data={data}
          isLoading={isLoading}
          isError={isError}
          isSuccess={isSuccess}
          domainIds={getSelectedDomainIds(domainList)}
        />
        <BrainHealthDomainsComparisonGraph
          data={data}
          isLoading={isLoading}
          isError={isError}
          isSuccess={isSuccess}
          domainIds={getSelectedDomainIds(domainList)}
        />
      </div>
      <div
          className="offcanvas offcanvas-end"
          tabIndex={-1}
          id="chilDomainDetailFilter"
          aria-labelledby="chilDomainDetailFilter"
        >
      <DomainComparisonGraphFilter
        filterParams={getFilterParams()}
        onApplyFilter={(filterParams: any) => handleFilterClick(filterParams)}
      />
      </div>
    </>
  );
};

export default BrainHealthDetailChildDomain;
