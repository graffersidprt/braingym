import Header from "../components/Header";
import { strings } from "../constants/strings";
import backImg from "../assets/images/icon-arrow-left.svg";
import { Link } from "react-router-dom";
import OrganizationBrainHealthDetailGraph from "../components/graphs/OrganizationBrainHealthDetailGraph";
import iconCloseDarkImg from "../assets/images/icon-close-dark.svg";
import { getFilterDateLabel, isEmptyOrNull } from "../constants/utils";
import { useState } from "react";
import BrainHealthSummaryDetailFilter from "../components/filters/BrainHealthSummaryDetailFilter";
import { Dayjs } from "dayjs";
import {
  defaultGenderState,
  defaultLocationState,
} from "../constants/values";
import BrainHealthDetailChildDomain from "../components/BrainHealthDetailChildDomian";
import { useRef } from "react";

const BrainHealthDetailPage = () => {
  const childLeftRef = useRef<any>();
 
  const [filterStartDate, setFilterStartDate] = useState<Dayjs | null>(
    null
  );
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
     if(childLeftRef){
      childLeftRef?.current?.applyFilter(filterParams);
     }
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
  const removeFilterClick = (
    startDate: any,
    endDate: any,
    countryValue: number,
    stateValue: number,
    cityValue: number,
    genderValue: number,
    departmentValue: any[]
  ) => {
   
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
    const params = {
      startDate: startDate || "",
      endDate: endDate || "",
      day: "",
      week: "",
      month: "",
      year: "",
      childDomainId: [],
      coachFilterType: 0,
      countryId: countryValue || 0,
      stateId: stateValue || 0,
      cityId: cityValue || 0,
      genderId: genderValue,
      userId: 0,
      locationData: {
        countryId: countryValue,
        countryName: countryValue === 0 ? "" : locationData?.countryName,
        stateId: stateValue,
        stateName: stateValue === 0 ? "" : locationData?.stateName,
        cityId: cityValue,
        cityName: cityValue === 0 ? "" : locationData?.cityName,
      },
      genderData: {
        genderId: genderValue,
        genderName: genderValue === 0 ? "" : genderData?.genderName,
      },
      departmentData: departmentValue,
      filterType: getFilterType(startDate,endDate,countryValue, stateValue, cityValue, genderValue, departmentValue),
    };
    if(childLeftRef){
      childLeftRef?.current?.applyFilter(params);
     }
  };

  
  return (
    <>
      <div className="bg-white">
        <div className="toasts-alert">
          <div id="liveAlert" className="live-alert"></div>
        </div>
        <Header />
        <main className=" ms-sm-auto after-login corporate-detail">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12 col-md-12 pd-b-32 mr-b-12">
                <div className="go-back me-auto">
                  <Link to="/dashboard" className="body-text text-black">
                    <img src={backImg} className="mr-r-4" alt="" />
                    {strings.back}
                  </Link>
                </div>
                <div className="detail-heading-row">
                  <span className="detail-heading-header">
                    {strings.organization_brain_health}
                  </span>
                  <div className="chart-filter-row">
                  <ul className="detail-chip-group unique-id-list filter-list">
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
                    <button
                      type="button"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#organizationBrainHealthDetailFilter"
                      aria-controls="organizationBrainHealthDetailFilter"
                      className="filter-btn pdl"
                    >
                      <i className="icon-filter fs-16 mr-r-6"></i>
                      {strings.filter}
                    </button>
                  </div>
                </div>
                <OrganizationBrainHealthDetailGraph ref={childLeftRef}/>
              <BrainHealthDetailChildDomain />
              </div>
            </div>
          </div>
        </main>
        <div
          className="offcanvas offcanvas-end"
          tabIndex={-1}
          id="organizationBrainHealthDetailFilter"
          aria-labelledby="organizationBrainHealthDetailFilter"
        >
          <BrainHealthSummaryDetailFilter
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

export default BrainHealthDetailPage;
