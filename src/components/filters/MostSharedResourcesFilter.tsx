import { Dayjs } from "dayjs";
import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { strings } from "../../constants/strings";
import {
  compareDates,
  formatFilterDate,
  showInvalidDateMessge,
} from "../../constants/utils";
import { defaultResourcesTypes } from "../../constants/values";
import CheckboxLabels from "../inputs/FormCheckBoxInput";
import FormDatePicker from "../inputs/FormDatePicker";
interface Props {
  onApplyFilter: any;
  filterParams: any;
}
const MostSharedResouresFilter: React.FC<Props> = (props: Props) => {
  const { onApplyFilter, filterParams } = props;
  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);
  const [resourcesType, setResourcesType] = useState(defaultResourcesTypes);
  useEffect(() => {
    if (!filterParams.startDate) setStartDate(null);
    else {
      setStartDate(filterParams.startDate);
    }
    if (!filterParams.endDate) setEndDate(null);
    else {
      setEndDate(filterParams.endDate);
    }
    if (
      filterParams &&
      filterParams.externalResource &&
      filterParams.externalResource.length > 0
    )
      setResourcesType(filterParams.externalResource);
  }, [filterParams]);

  const handleCheckBox = (value: string, index: number) => {
    const newState = resourcesType.map((obj, newIndex) => {
      if (newIndex === index) {
        return { ...obj, checked: obj?.checked ? false : true };
      }
      return obj;
    });
    setResourcesType(newState);
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
  const handleFilterClick = () => {
    const params = {
      fromDate: startDate ? formatFilterDate(startDate) : "",
      toDate: endDate ? formatFilterDate(endDate) : "",
      externalResource: getSelectedResources(),
      date: "",
      resourceFilter: [],
      availableExternalResource: [],
      resourcesType,
    };
    onApplyFilter(params);
  };
  const getSelectedResources = () => {
    const selectArray: number[] = [];
    resourcesType.map((item) => {
      if (item.checked) {
        selectArray.push(item.id);
      }
    });
    return selectArray;
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
            label={strings.start_date}
            value={startDate}
            onDateChange={handleStartDateChange}
          />
          <FormDatePicker
            label={strings.end_date}
            value={endDate}
            onDateChange={handleEndDateChange}
          />
          <div className="col-md-12 mr-b-12 mr-t-16 d-flex">
            <div className="body-text-emphasis ">{strings.resource_type}</div>
            <Link
              to="#"
              className={
                resourcesType[0].checked ||
                resourcesType[1].checked ||
                resourcesType[2].checked ||
                resourcesType[3].checked
                  ? "link ms-auto my-1 blue"
                  : "link ms-auto my-1 gray"
              }
              onClick={() => setResourcesType(defaultResourcesTypes)}
            >
              {strings.clear}
            </Link>
          </div>
          <div className="col-md-12">
            <div className="coach-rating-filter">
              <ul>
                {resourcesType.map((item, index) => (
                  <li key={item.id}>
                    <div className="form-check">
                      <CheckboxLabels
                        label={item?.type}
                        checked={item.checked}
                        value={item.type}
                        onChange={(values: any) => {
                          handleCheckBox(values, index);
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
            onClick={() => handleFilterClick()}
          >
            {strings.apply}
          </Link>
        </div>
      </div>
    </>
  );
};
export default MostSharedResouresFilter;
