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

const CoachRatingFilter: React.FC<Props> = (props: Props) => {
  const { onApplyFilter, filterParams } = props;
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [locationData, setLocationData] = useState(defaultLocationState);
  const [rating, setRating] = useState(ratingType);

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
    if (filterParams && filterParams.rating && filterParams.rating.length > 0)
      setRating(filterParams.rating);
    setLocationData(filterParams?.locationData);
  }, [filterParams]);

  const handleCheckBox = (index) => {
    const newState = rating.map((obj, newIndex) => {
      if (newIndex === index) {
        return { ...obj, checked: obj.checked ? false : true };
      }
      return obj;
    });
    setRating(newState);
  };

  const handleFilterClick = () => {
    setStartDate(startDate);
    setEndDate(endDate);
    const params = {
      startDate: startDate ? formatFilterDate(startDate) : null,
      endDate: endDate ? formatFilterDate(endDate) : null,
      rating: rating,
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
              {strings.date_range}
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
          <div className="col-md-12 mr-b-12 mr-t-16 d-flex">
            <div className="body-text-emphasis ">{strings.coach_rating} </div>
            <Link
              to="#"
              className={
                rating[0].checked ||
                rating[1].checked ||
                rating[2].checked ||
                rating[3].checked ||
                rating[4].checked
                  ? "link ms-auto my-1 blue"
                  : "link ms-auto my-1 gray"
              }
              onClick={() => {
                setRating(ratingType);
              }}
            >
              {strings.clear}
            </Link>
          </div>
          <div className="col-md-12">
            <div className="coach-rating-filter">
              <ul>
                {rating.map((item, index) => (
                  <li key={index}>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="CoachRating01star"
                        checked={item.checked}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="CoachRating01star"
                        onClick={(values) => {
                          handleCheckBox(index);
                        }}
                      >
                        {rating.map((starItem) => (
                          <i key={starItem.star}
                            className={
                              index + 1 >= starItem.star
                                ? "icon-star-fill"
                                : "icon-star"
                            }
                          ></i>
                        ))}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
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

export default CoachRatingFilter;
