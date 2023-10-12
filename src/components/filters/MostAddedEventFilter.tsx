import { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { strings } from "../../constants/strings";
import {
  compareDates,
  formatFilterDate,
  showInvalidDateMessge,
} from "../../constants/utils";
import {
  defaultLocationState,
  eventTypes,
  recurrenceTypes,
} from "../../constants/values";
import CheckboxLabels from "../inputs/FormCheckBoxInput";
import FormDatePicker from "../inputs/FormDatePicker";
import RadioBoxLabels from "../inputs/FormRadioBoxInput";
import LocationSelection from "../LocationSelection";

interface Props {
  onApplyFilter: any;
  filterParams: any;
}
const MostAddedEventFilter: React.FC<Props> = (props: Props) => {
  const { onApplyFilter, filterParams } = props;
  const [filterStartDate, setFilterStartDate] = React.useState<Dayjs | null>(
    null
  );
  const [filterEndDate, setFilterEndDate] = React.useState<Dayjs | null>(null);
  const [eventType, setEventType] = useState(eventTypes);
  const [recurrence, setRecurrence] = useState(recurrenceTypes);
  const [locationData, setLocationData] = useState({
    countryId: 0,
    countryName: "",
    stateId: 0,
    stateName: "",
    cityId: 0,
    cityName: "",
  });
  const handleCheckBox = (values: string, index: number) => {
    const newState = eventType.map((obj, newIndex) => {
      if (newIndex === index) {
        if (index === 1 && obj.checked) {
          setLocationData(defaultLocationState);
        }
        return { ...obj, checked: !obj.checked };
      } else {
        return { ...obj, checked: obj.checked };
      }
    });
    setEventType(newState);
  };
  const handleRadioBox = (values: string, index: number) => {
    const newState = recurrence.map((obj, newIndex) => {
      if (newIndex === index) {
        return { ...obj, checked: true };
      } else {
        return { ...obj, checked: false };
      }
    });

    setRecurrence(newState);
  };

  useEffect(() => {
    if (!filterParams.startDate) {
      setFilterStartDate(null);
    } else {
      setFilterStartDate(filterParams.startDate);
    }
    if (!filterParams.endDate) setFilterEndDate(null);
    else {
      setFilterEndDate(filterParams.endDate);
    }
    if (
      filterParams &&
      filterParams.availableEvent &&
      filterParams.availableEvent.length > 0
    ) {
      setEventType(filterParams.availableEvent);
    }
    setLocationData(filterParams?.locationData);
    if (filterParams?.recurrence) {
      setRecurrence(filterParams.recurrence);
    }
  }, [filterParams]);

  const getSelectedEvent = () => {
    const selectArray: number[] = [];
    eventType.map((item) => {
      if (item.checked) {
        selectArray.push(item.id);
      }
    });
    return selectArray;
  };
  const getRecurrence = () => {
    const data = recurrence.filter((item) => {
      if (item.checked === true) {
        return item?.id;
      }
    });
    return data[0]?.id || 0;
  };
  const handleFilterClick = () => {
    setFilterStartDate(filterStartDate);
    setFilterEndDate(filterEndDate);
    const params = {
      availableEvent: eventType,
      filterStartDate: filterStartDate ? formatFilterDate(filterStartDate) : "",
      filterEndDate: filterEndDate ? formatFilterDate(filterEndDate) : "",
      eventType: getSelectedEvent(),
      recurrence: getRecurrence(),
      locationData: locationData,
      recurrenceData: recurrence,
    };

    onApplyFilter(params);
  };

  const checkApplyValidity = () => {
    if (!filterStartDate && !filterEndDate) return true;
    else if (
      filterStartDate &&
      filterEndDate &&
      compareDates(filterStartDate, filterEndDate)
    )
      return true;
    else return false;
  };
  const handleStartDateChange = (value: any) => {
    if (filterEndDate) {
      if (compareDates(value.$d, filterEndDate)) setFilterStartDate(value.$d);
      showInvalidDateMessge(value.$d, filterEndDate);
    } else {
      setFilterStartDate(value.$d);
    }
  };

  const handleEndDateChange = (value: any) => {
    if (filterStartDate) {
      if (compareDates(filterStartDate, value.$d)) setFilterEndDate(value.$d);
      showInvalidDateMessge(filterStartDate, value.$d);
    } else {
      setFilterEndDate(value.$d);
    }
  };
  return (
    <>
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
              to="#"
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
          <div className="col-md-12 mr-b-12 mr-t-16 d-flex">
            <div className="body-text-emphasis ">{strings.event_type} </div>
            <Link
              to="#"
              className={
                eventType[0].checked || eventType[1].checked
                  ? "link ms-auto my-1 blue"
                  : "link ms-auto my-1 gray"
              }
              onClick={() => {
                setEventType(eventTypes);
              }}
            >
              {strings.clear}
            </Link>
          </div>
          <div className="col-md-12">
            <div className="coach-rating-filter">
              <ul>
                {eventType.map((item, index) => (
                  <li key={index}>
                    <div className="form-check">
                      <CheckboxLabels
                        label={item?.type}
                        checked={item?.checked}
                        value={item.type}
                        onChange={(value: any) => {
                          handleCheckBox(value, index);
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {(eventType[0].id === 1 && eventType[0].checked) ||
            (eventType[1].id === 1 && eventType[1].checked && (
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
            ))}
          <div className="col-md-12 mr-b-12 mr-t-16 d-flex">
            <div className="body-text-emphasis ">{strings.recurrence} </div>
            <Link
              to="#"
              className={
                recurrence[0].checked || recurrence[1].checked
                  ? "link ms-auto my-1 blue"
                  : "link ms-auto my-1 gray"
              }
              onClick={() => {
                setRecurrence(recurrenceTypes);
              }}
            >
              {strings.clear}
            </Link>
          </div>
          <div className="col-md-12">
            <div className="coach-rating-filter">
              <ul>
                {recurrence.map((item, index) => (
                  <li key={index}>
                    <div className="form-check">
                      <RadioBoxLabels
                        label={item?.type}
                        value={item.type}
                        checked={item?.checked}
                        onChange={(value: any) => {
                          handleRadioBox(value, index);
                        }}
                      />
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
export default MostAddedEventFilter;
