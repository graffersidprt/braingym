import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { strings } from "../constants/strings";
import { filterArrayData, showServerError } from "../constants/utils";
import { defaultGenderState } from "../constants/values";
import { useGetGenderListMutation } from "../redux/api/commonApi";
import SelectInput from "./inputs/SelectInput";

interface Props {
  values: any;
  onUpdate: any;
}

const GenderSelection: React.FC<Props> = (props: Props) => {
  const { onUpdate, values } = props;
  const [genderData, setGenderData] = useState(defaultGenderState);

  useEffect(() => {
    setGenderData(values);
  }, [values]);

  // ? API Get Gender List Mutation
  const [
    getGenderList,
    {
      isLoading: genderListIsLoading,
      isError: genderListIsError,
      error: genderListError,
      data: genderListData,
    },
  ] = useGetGenderListMutation();

  // This for call all initial API (getUser, getGenderList)
  useEffect(() => {
    getGenderList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //This function handel Api error
  useEffect(() => {
    if (genderListIsError) {
      showServerError(genderListError);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    genderListIsLoading,
    //cityListIsLoading,
  ]);

  const clearAll = () => {
    setGenderData(defaultGenderState);
    onUpdate(defaultGenderState);
  };

  // handle onChange Gender select value
  const onGenderChange = (e: any) => {
    const data = filterArrayData(genderListData?.data, e.target.value);
    let tempGenderData = {
      genderId: data[0].id,
      genderName: data[0].name,
    };
    setGenderData(tempGenderData);
    onUpdate(tempGenderData);
  };

  return (
    <div>
      <div className="col-md-12 mr-b-12 mr-t-16 d-flex">
        <div className="body-text-emphasis ">{strings.gender}</div>
        <Link
          to="#"
          className={
            genderData?.genderName
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
            name="gender"
            label="Gender"
            type="dropdown"
            handelChange={(e: any) => onGenderChange(e)}
            data={genderListData}
            value={genderData?.genderId}
          />
        </div>
      </div>
    </div>
  );
};

export default GenderSelection;
