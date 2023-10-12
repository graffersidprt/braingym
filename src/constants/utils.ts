import moment from "moment";
import { toast } from "react-toastify";
import { BarChartItem, DomainItem } from "../redux/api/types";
import { strings } from "./strings";
import {
  commonColorsData,
  domainColorsData,
  subDomainColorsData,
  brainHealthScoreColorsData,
  emotionalColorsData,
  currentSentimentColorsData,
} from "./colors";

export const emailReg =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const setStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  return true;
};

export const getStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

export const removeStorage = (key) => {
  localStorage.removeItem(key);
  return true;
};

export const getCurrentUser = () => {
  return getStorage("user");
};

export const getUserToken = () => {
  const user = getCurrentUser();
  return user ? user.data.accessToken : "";
};

export const getApiHeader = () => {
  const token = getUserToken();
  const header = {
    "Content-Type": "application/json",
  };
  if (token) {
    header["authorization"] = "Bearer " + getUserToken();
  }
  return header;
};
/* desc 
@param:date
 to remove time from date */
export const getFullDate = (date: string) => {
  let newDate = moment(new Date(date)).format("MM/DD/YY").split("T")[0];
  return newDate;
};
export const formatFilterDate = (date: string) => {
  let newDate = moment(new Date(date)).format("MM/DD/YYYY").split("T")[0];
  return newDate;
};

export const formatUpdateFilterDate = (date: string) => {
  let newDate = moment(new Date(date)).format("YYYY/MM/DD").split("T")[0];
  return newDate;
};

export const getDate = (date: string) => {
  let newDate = moment(new Date(date)).format("DD").split("T")[0];
  return newDate;
};

export const showServerError = (error) => {
  if (error.status == 401) {
    toast.error(strings.server_error_401, {
      position: "top-right",
      autoClose: 1000,
      onClose: ({ uid }) => window.location.replace("/corporate/login"),
    });
    removeStorage("user");
  }
  if (error.status == 404) {
    toast.error(strings.server_error_404, {
      position: "top-right",
    });
  } else if (error.status == 500) {
    toast.error(strings.server_error_500, {
      position: "top-right",
    });
  } else if (error.status == 405) {
    toast.error(strings.server_error_405, {
      position: "top-right",
    });
  } else {
    if (Array.isArray((error as any).data.error)) {
      (error as any).data.error.forEach((el: any) =>
        toast.error(el.message, {
          position: "top-right",
        })
      );
    } else {
      toast.error((error as any).data.title, {
        position: "top-right",
      });
    }
  }
  return true;
};

export const getCurrentPageName = (pathname) => {
  let page = strings.dashboard;
  if (pathname === "/dashboard") {
    page = strings.dashboard;
  } else if (pathname === "/organizaion-details") {
    page = strings.organization;
  } else if (pathname === "/profile") {
    page = strings.user_account;
  } else if (pathname === "/edit-profile") {
    page = strings.edit_profile;
  } else if (pathname === "/brain-health-detail") {
    page = strings.detail_page;
  }
  return page;
};

export const getInitialStarData = () => {
  const chartDataArray: BarChartItem[] = [];
  for (let i = 1; i <= 5; i++) {
    chartDataArray.push({
      label: i + " Star",
      data: [0],
      backgroundColor: "#FFD100",
      borderRadius: 8,
    });
  }
  return chartDataArray;
};

export const filterArrayData = (data: any[], value: number) => {
  return data?.filter((data: { id: any }) => data.id === value);
};

export const getBase64 = (file: any) => {
  return new Promise((resolve) => {
    let baseURL = "";
    // Make new FileReader
    let reader = new FileReader();

    // Convert the file to base64 text
    reader.readAsDataURL(file);

    // on reader load somthing...
    reader.onload = () => {
      // Make a fileInfo Object
      baseURL = reader.result.replace("data:", "").replace(/^.+,/, "");
      resolve(baseURL);
    };
  });
};

export const getColorCode = (type: string, id: number) => {
  let colorCode: any = "#2AE251";
  if (type === "common") {
    let data = commonColorsData.find((i) => i.id === id);
    if (data) {
      colorCode = data?.color_code;
    }
  } else if (type === "domain") {
    let data = domainColorsData.find((i) => i.id === id);
    if (data) {
      colorCode = data?.color_code;
    }
  } else if (type === "subDomain") {
    let data = subDomainColorsData.find((i) => i.id === id);
    if (data) {
      colorCode = data?.color_code;
    }
  } else if (type === "brainHealthScore") {
    let data = brainHealthScoreColorsData.find((i) => i.id === id);
    if (data) {
      colorCode = data?.color_code;
    }
  } else if (type === "emotional") {
    let data = emotionalColorsData.find((i) => i.id === id);
    if (data) {
      colorCode = data?.color_code;
    }
  } else if (type === "currentSentiment") {
    let data = currentSentimentColorsData.find((i) => i.id === id);
    if (data) {
      colorCode = data?.color_code;
    }
  }
  return colorCode;
};

export const CheckIfStringsIsEmpty = (value: any) => {
  if (value === "") return 0;
  else return value;
};

export const getFilterDateLabel = (filterStartDate, filterEndDate) => {
  let newStartDate = moment(new Date(filterStartDate))
    .format("D MMM")
    .split("T")[0];
  let newEndDate = moment(new Date(filterEndDate))
    .format("D MMM, YY")
    .split("T")[0];
  const finalDate = newStartDate + " - " + newEndDate;
  return finalDate;
};

export const compareDates = (
  filterStartDate: string,
  filterEndDate: string
) => {
  return (
    moment(filterEndDate).isAfter(filterStartDate) ||
    moment(filterEndDate).isSame(filterStartDate)
  );
};

export const showInvalidDateMessge = (
  filterStartDate: string,
  filterEndDate: string
) => {
  if (!compareDates(filterStartDate, filterEndDate)) {
    toast.error(strings.invalidDateMessage, {
      position: "top-right",
      autoClose: 1000,
    });
  }
};

export const getBarPercentage = (graphArraylength: number) => {
  switch (graphArraylength || 0) {
    case 1 || 2:
      return 0.1;
    case 3:
      return 0.2;
    default:
      return 0.3;
  }
};

export const getGroupBarPercentage = (graphArraylength: number) => {
  switch (graphArraylength || 0) {
    case 1:
      return 0.2;
    case 2:
      return 0.5;
    case 3:
      return 0.5;
    default:
      return 0.7;
  }
};

export const showStartDateEmptyMessge = () => {
  toast.error(strings.invalidStartDateMessage, {
    position: "top-right",
    autoClose: 1000,
  });
};

export const getDepartmentIds = (departmentObjectArray: any[]) => {
  const departmentStringArray: string[] = [];
  if (departmentObjectArray.forEach)
    departmentObjectArray.forEach((item) => {
      departmentStringArray.push(item?.id);
    });
  return departmentStringArray;
};

export const getDepartmentParams = (departmentObjectArray: any[]) => {
  const departmentStringArray: string[] = [];
  if (departmentObjectArray.forEach)
    departmentObjectArray.forEach((item) => {
      departmentStringArray.push(item?.id);
    });
  return departmentStringArray;
};

export const getDepartmentNames = (departmentObjectArray: any[]) => {
  let departmentString: string = "";
  if (departmentObjectArray.forEach)
    departmentObjectArray.forEach((item, index) => {
      departmentString =
        departmentString +
        item.id +
        (departmentObjectArray.length - 1 == index ? "" : " ,");
    });
  return departmentString;
};
export const getPronounsIds = (array: any[]) => {
  const pronounsIds: number[] = [];
  array.forEach((item) => {
    pronounsIds.push(item.id);
  });
  return pronounsIds;

  
};

export const isEmptyOrNull = (value: string) =>{
    if(value==null || !value  || value==='')
    return true;
    return false;
}
export const getEmotionalStateData = () => {
  return [
    {
      label: strings.happy,
      data: ["0"],
      backgroundColor: getColorCode("emotional", 5),
      borderRadius: 8,
      barPercentage: 0.7,
      categoryPercentage: 1.0,
    },
    {
      label: strings.disappointed,
      data: ["0"],
      backgroundColor: getColorCode("emotional", 3),
      borderRadius: 8,
      barPercentage: 0.7,
      categoryPercentage: 1.0,
    },
    {
      label: strings.fearful,
      data: ["0"],
      backgroundColor: getColorCode("emotional", 4),
      borderRadius: 8,
      barPercentage: 0.7,
      categoryPercentage: 1.0,
    },
    {
      label: strings.angry,
      data: ["0"],
      backgroundColor: getColorCode("emotional", 1),
      borderRadius: 8,
      barPercentage: 0.7,
      categoryPercentage: 1.0,
    },
    {
      label: strings.sad,
      data: ["0"],
      backgroundColor: getColorCode("emotional", 6),
      borderRadius: 8,
      barPercentage: 0.7,
      categoryPercentage: 1.0,
    },
    {
      label: strings.surprise,
      data: ["0"],
      backgroundColor: getColorCode("emotional", 7),
      borderRadius: 8,
      barPercentage: 0.7,
      categoryPercentage: 1.0,
    },
    {
      label: strings.contempt,
      data: ["0"],
      backgroundColor: getColorCode("emotional", 2),
      borderRadius: 8,
      barPercentage: 0.7,
      categoryPercentage: 1.0,
    },
  ];
};
export const getFilterType= ( startDate: string,
  endDate: string) =>{
 if(isEmptyOrNull(startDate) && isEmptyOrNull(endDate))
 return 0

 return 1;
}