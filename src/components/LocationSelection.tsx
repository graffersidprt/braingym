import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { strings } from "../constants/strings";
import { filterArrayData, showServerError } from "../constants/utils";
import { defaultLocationState } from "../constants/values";
import {
  useGetCityListMutation,
  useGetCountryListMutation,
  useGetStateListMutation,
} from "../redux/api/commonApi";
import SelectInput from "./inputs/SelectInput";

interface Props {
  values: any;
  onUpdate: any;
}

const LocationSelection: React.FC<Props> = (props: Props) => {
  const { onUpdate, values } = props;
  const [locationData, setLocationData] = useState(defaultLocationState);

  useEffect(() => {
    setLocationData(values);
  }, [values]);

  // ? API Get Country List Mutation
  const [
    getCountryList,
    {
      isLoading: countryListIsLoading,
      isError: countryListIsError,
      error: countryListError,
      data: countryListData,
    },
  ] = useGetCountryListMutation();

  // ? API Get State List Mutation
  const [getStateListById, { data: stateListData }] = useGetStateListMutation();

  // ? API Get City List Mutation
  const [
    getCityListById,
    {
      isLoading: cityListIsLoading,
      isError: cityListIsError,
      error: cityListError,
      data: cityListData,
    },
  ] = useGetCityListMutation();

  // This for call all initial API (getCountryList)
  useEffect(() => {
    getCountryList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //This function handel Api error
  useEffect(() => {
    if (countryListIsError) {
      showServerError(countryListError);
    }
    if (cityListIsError) {
      showServerError(cityListError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryListIsLoading, cityListIsLoading]);

  // handle onChange country select value
  const getStateList = (e: any) => {
    const data = filterArrayData(countryListData?.data, e.target.value);
    let tempLocationData = {
      countryId: data[0].id,
      countryName: data[0].name,
      stateId: 0,
      stateName: "",
      cityId: 0,
      cityName: "",
    };
    getStateListById(e.target.value);
    getCityListById();
    setLocationData(tempLocationData);
    onUpdate(tempLocationData);
  };

  // handle onChange State select value
  const getCityList = (e: any) => {
    const data = filterArrayData(stateListData?.data, e.target.value);
    let tempLocationData = {
      ...locationData,
      stateId: data[0].id,
      stateName: data[0].name,
      cityId: 0,
      cityName: "",
    };
    getCityListById(e.target.value);
    setLocationData(tempLocationData);
    onUpdate(tempLocationData);
  };

  // handle onChange City select value
  const cityValueChange = (e: any) => {
    const data = filterArrayData(cityListData?.data, e.target.value);
    let tempLocationData = {
      ...locationData,
      cityId: data[0].id,
      cityName: data[0].name,
    };
    setLocationData(tempLocationData);
    onUpdate(tempLocationData);
  };

  const clearAll = () => {
    setLocationData(defaultLocationState);
    onUpdate(defaultLocationState);
  };

  return (
    <div>
      <div className="col-md-12 mr-b-12 mr-t-16 d-flex">
        <div className="body-text-emphasis ">{strings.location}</div>
        <Link
          to="#"
          className={
            locationData?.countryName ||
            locationData?.stateName ||
            locationData?.cityName
              ? "link ms-auto my-1 blue"
              : "link ms-auto my-1 gray"
          }
          onClick={() => {
            clearAll();
          }}
        >
          {strings.clear}
        </Link>
      </div>
      <div className="col-md-12">
        <div className="form-floating custom-dd-s">
          <SelectInput
            name="country"
            label={strings.country}
            type="dropdown"
            handelChange={(e: any) => getStateList(e)}
            data={countryListData}
            value={locationData.countryId}
          />
        </div>
      </div>
      <div className="col-md-12">
        <div className="form-floating custom-dd-s">
          <SelectInput
            name="state"
            label={strings.state}
            type="dropdown"
            handelChange={(e: any) => getCityList(e)}
            data={stateListData}
            value={locationData.stateId}
          />
        </div>
      </div>
      <div className="col-md-12">
        <div className="form-floating custom-dd-s">
          <SelectInput
            name="city"
            label={strings.city}
            type="dropdown"
            handelChange={(e: any) => cityValueChange(e)}
            data={cityListData}
            value={locationData.cityId}
          />
        </div>
      </div>
    </div>
  );
};

export default LocationSelection;
