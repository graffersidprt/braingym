import { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { strings } from "../../constants/strings";
import { compareDates, formatFilterDate, showInvalidDateMessge } from "../../constants/utils";
import {
  defaultGenderState,
  defaultLocationState,
} from "../../constants/values";
import DepartmentSelection from "../DepartmentSelection";
import FormDatePicker from "../inputs/FormDatePicker";
import GenderSelection from "../GenderSelection";
import LocationSelection from "../LocationSelection";
interface Props {
  onApplyFilter: any;
  filterParams: any;
}

const CurrentBrainFilter: React.FC<Props> = (props: Props) => {
  const { onApplyFilter, filterParams } = props;
  const [filterStartDate, setFilterStartDate] = React.useState<Dayjs | null>(
    null
  );
  const [filterEndDate, setFilterEndDate] = React.useState<Dayjs | null>(null);
  const [locationData, setLocationData] = useState(defaultLocationState);
  const [genderData, setGenderData] = useState(defaultGenderState);
  const [departmentData, setDepartmentData] = useState([]);

  const handleFilterClick = () => {
    setFilterStartDate(filterStartDate);
    setFilterEndDate(filterEndDate);
    const params = {
      filterType: 0,
      startDate: filterStartDate ? formatFilterDate(filterStartDate) : "",
      endDate: filterEndDate ? formatFilterDate(filterEndDate) : "",
      day: "",
      week: "",
      month: "",
      year: "",
      domainId: 0,
      childDomainId: [],
      coachFilterType: 0,
      userId: 0,
      locationData,
      genderData,
      departmentData,
    };
    onApplyFilter(params);
  };

  useEffect(() => {
    if (!filterParams.startDate) setFilterStartDate(null);
    else {
      setFilterStartDate(filterParams.startDate);
    }
    if (!filterParams.endDate) setFilterEndDate(null);
    else {
      setFilterEndDate(filterParams.endDate);
    }
    setLocationData(filterParams.locationData);
    setGenderData(filterParams.genderData);
    setDepartmentData(filterParams.departmentData);
  }, [filterParams]);

  const checkApplyValidity = () => {
    if (!filterStartDate && !filterEndDate) return true;
    else if (filterStartDate && filterEndDate && compareDates(filterStartDate, filterEndDate)) return true;
    else return false;
  };
  const handleStartDateChange = (value: any) =>{
    if (filterEndDate) {
      if (compareDates(value.$d, filterEndDate))
        setFilterStartDate(value.$d);
      showInvalidDateMessge(value.$d, filterEndDate);
    } else {
      setFilterStartDate(value.$d);
    }
  }

  const handleEndDateChange = (value: any) =>{
    if (filterStartDate) {
      if (compareDates(filterStartDate, value.$d))
        setFilterEndDate(value.$d);
      showInvalidDateMessge(filterStartDate, value.$d);
    } else {
      setFilterEndDate(value.$d);
    }
  }
  return (
    <React.Fragment>
      <div className="offcanvas-header">
        <h4 className="offcanvas-title" id="offcanvasExampleLabel">
          {strings.filter}
        </h4>
        <button
          type="button"
          className="btn-close text-reset"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body">
        <div className="row">
          <div className="col-md-12 mr-b-12 d-flex align-items-center">
            <div className="body-text-emphasis ">{strings.date_range}</div>
            <Link
              to={""}
              className={
                filterStartDate || filterEndDate
                  ? "link ms-auto my-1 blue"
                  : "link ms-auto my-1 gray"
              }
              onClick={() => {
                setFilterStartDate(null);
                setFilterEndDate(null);
              }}
            >
              {strings.clear}
            </Link>
          </div>
          <FormDatePicker
            label={strings.start_date}
            value={filterStartDate}
            onDateChange={handleStartDateChange}
          />
          <FormDatePicker
            label={strings.end_date}
            value={filterEndDate}
            onDateChange={handleEndDateChange}
          />
          <LocationSelection
            values={locationData}
            onUpdate={(data: any) => {
              setLocationData({
                countryId: data.countryId,
                countryName: data.countryName,
                stateId: data.stateId,
                stateName: data.stateName,
                cityId: data.cityId,
                cityName: data.cityName,
              });
            }}
          />
          <GenderSelection
            values={genderData}
            onUpdate={(data: any) => {
              setGenderData({
                genderId: data.genderId,
                genderName: data.genderName,
              });
            }}
          />
          <DepartmentSelection
            values={departmentData}
            onUpdate={(data: any) => {
              setDepartmentData(data);
            }}
          />
        </div>
      </div>
      <div className="offcanvas-footer">
        <div className="block-action text-end">
          <Link
            to={""}
            data-bs-dismiss="offcanvas"
            className="btn btn-secondary mr-r-16"
          >
            {strings.cancel}
          </Link>
          <Link
            className={
              checkApplyValidity()
                ? "btn btn-primary"
                : "btn btn-primary disabled"
            }
            data-bs-dismiss="offcanvas"
            to="#"
            onClick={() => {
              handleFilterClick();
            }}
          >
            {strings.apply}
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CurrentBrainFilter;
