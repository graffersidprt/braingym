import { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "react-tooltip/dist/react-tooltip.css";
import "../../assets/css/dashboard.css";
import { strings } from "../../constants/strings";
import {
  compareDates,
  formatFilterDate,
  showInvalidDateMessge,
} from "../../constants/utils";
import { defaultLocationState, ratingType } from "../../constants/values";
import FormDatePicker from "../inputs/FormDatePicker";
import LocationSelection from "../LocationSelection";

interface Props {
  onApplyFilter: any;
  filterParams: any;
}

const MessageAndCallsFilter: React.FC<Props> = (props: Props) => {
  const { onApplyFilter, filterParams } = props;
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [locationData, setLocationData] = useState(defaultLocationState);

  useEffect(() => {
    if (!filterParams.startDate) {
      setStartDate(null);
    } else {
      setStartDate(filterParams.startDate);
    }
    if (!filterParams.endDate) setEndDate(null);
    else {
      setEndDate(filterParams.endDate);
    }

    setLocationData(filterParams?.locationData);
  }, [filterParams]);

  const handleFilterClick = () => {
    setStartDate(startDate);
    setEndDate(endDate);
    const params = {
      startDate: startDate ? formatFilterDate(startDate) : null,
      endDate: endDate ? formatFilterDate(endDate) : null,
      locationData: locationData,
    };
    onApplyFilter(params);
  };

  const checkApplyValidity = () => {
    if (!startDate && !endDate) return true;
    else if (startDate && endDate && compareDates(startDate, endDate))
      return true;
    else return false;
  };

  const handleStartDateChange = (value: any) => {
    if (endDate) {
      if (compareDates(value.$d, endDate)) setStartDate(value.$d);
      showInvalidDateMessge(value.$d, endDate);
    } else {
      setStartDate(value.$d);
    }
  };

  const handleEndDateChange = (value: any) => {
    if (startDate) {
      if (compareDates(startDate, value.$d)) setEndDate(value.$d);
      showInvalidDateMessge(startDate, value.$d);
    } else {
      setEndDate(value.$d);
    }
  };

  return (
    <>
      <div className="offcanvas-header">
        <h4 className="offcanvas-title" id="offcanvasratingCoach1">
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
            <div className="body-text-emphasis ">
              {strings.created_date_range}
            </div>
            <Link
              to="#"
              className={
                startDate || endDate
                  ? "link ms-auto my-1 blue"
                  : "link ms-auto my-1 gray"
              }
              onClick={() => {
                setStartDate(null);
                setEndDate(null);
              }}
            >
              {strings.clear}
            </Link>
          </div>
          <FormDatePicker
            label="Start date"
            value={startDate}
            onDateChange={handleStartDateChange}
          />
          <FormDatePicker
            label="End date"
            value={endDate}
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
        </div>
      </div>
      <div className="offcanvas-footer">
        <div className="block-action text-end">
          <Link
            to="#"
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
    </>
  );
};

export default MessageAndCallsFilter;
