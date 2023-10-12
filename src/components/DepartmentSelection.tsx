import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { strings } from "../constants/strings";
import { useGetDepartmentListMutation } from "../redux/api/commonApi";
import MultiSelectInput from "./inputs/MultiSelectInput";

interface Props {
  values: any;
  onUpdate: any;
}

const DepartmentSelection: React.FC<Props> = (props: Props) => {
  const { onUpdate, values } = props;
  const [departmentData, setDepartmentData] = useState<any[]>([]);
  const [departmentRecords, setDepartmentRecords] = useState({
    data: [],
  });

  useEffect(() => {
    if(values.forEach)
    setDepartmentData(values);
  }, [values]);

  // ? API Get Department List Mutation
  const [getDepartmentList, { isSuccess, data: departmentListData }] =
    useGetDepartmentListMutation();

  // This for call all initial API (getDepartmentList)
  useEffect(() => {
    getDepartmentList();
  }, []);

  useEffect(() => {
    getDepartmentData();
  }, [isSuccess]);

  const clearAll = () => {
    setDepartmentData([]);
    onUpdate([]);
  };

  const onDepartmentChange = (e: any,value: any) => {
   setDepartmentData(value);
   onUpdate(value);
  };

 
  const getDepartmentData = () => {
    let result = departmentListData?.data.map((item: any) => {
      return {
        id: item.value,
        name: item.text,
      };
    });
    setDepartmentRecords({ data: result });
  };

  return (
    <div>
      <div className="col-md-12 mr-b-12 mr-t-16 d-flex">
        <div className="body-text-emphasis ">{strings.department}</div>
        <Link
          to="#"
          className={
              "link ms-auto my-1 gray"
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
          <MultiSelectInput
            name="department"
            label="Department"
            type="dropdown"
            handelChange={onDepartmentChange}
            data={departmentRecords}
            value={departmentData}
          />
        </div>
      </div>
    </div>
  );
};

export default DepartmentSelection;
