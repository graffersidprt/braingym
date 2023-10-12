export interface IUser {
  name: string;
  email: string;
  role: string;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  data: any;
}

export interface IBrainHealthSResponse {
  data: IBrainHealthSData;
  success: boolean;
  message: any;
  status: number;
}

export interface IBrainHealthSData {
  overAllScore: number;
  domainData: DomainItem[];
}

export interface DomainItem {
  score: number;
  date: string;
  domainId: number;
  childDomainId: number;
  surveyNameId: number;
  name: string;
  color?: string;
  id: number;
}
export interface ISummaryResponseData {
  totalUsers: number;
  employee: number;
  coaches: number;
  corporates: number;
  active: number;
  engaged: number;
  inActive: number;
  neverEngaged: number;
  employeeAnalysis: EmployeeAnalysis;
  coachAnalysis: CoachAnalysis;
  callsAndMessages: CallsAndMessages;
}

export interface EmployeeAnalysis {
  poor: number;
  ok: number;
  great: number;
}

export interface CoachAnalysis {
  average: number;
  good: number;
  great: number;
}

export interface CallsAndMessages {
  calls: number;
  messages: number;
}

export interface ICoachRatingResponse {
  data: ICoachRatingData;
  success: boolean;
  message: any;
  status: number;
}

export interface ICoachRatingData {
  filter: Filter;
  selectedFilter: any;
  star1: number;
  star2: number;
  star3: number;
  star4: number;
  star5: number;
  ids: any;
}

export interface Filter {
  date: string;
  star: any;
  filterName: string;
  resourceFilter: any[];
  userFilter: UserFilter;
}

export interface UserFilter {
  roleId: number;
  startDate: any;
  endDate: any;
  countryId: number;
  staetId: number;
  cityId: number;
  isfilter: boolean;
  countryName: any;
  stateName: any;
  cityName: any;
  country: any[];
  availableDepartment: any[];
  departmentId: any;
  departmentName: any;
  dateFilter: any;
  filterName: any;
}

export interface BarChartItem {
  label: string;
  data: number[];
  backgroundColor: string;
  borderRadius: number;
}
export interface IGenericResponse {
  status: string;
  message: string;
}

export interface ISummaryRequestPayload {
  filterType: number;
  startDate: string;
  endDate: string;
  day: string;
  week: string;
  month: string;
  year: string;
  domainId: number;
  childDomainId: number[];
  coachFilterType: number;
  countryId: number;
  stateId: number;
  cityId: number;
  genderId: number;
  userId: number;
}

export interface IBrainHealthSResponse {
  data: IBrainHealthSData;
  success: boolean;
  message: any;
  status: number;
}

export interface IBrainHealthSData {
  overAllScore: number;
  domainData: DomainItem[];
}

export interface DomainItem {
  score: number;
  date: string;
  domainId: number;
  childDomainId: number;
  surveyNameId: number;
  name: string;
  color?: string;
  graphDBDatas: any[];
  id: number;
}

export interface ISummaryResponseData {
  totalUsers: number;
  employee: number;
  coaches: number;
  corporates: number;
  active: number;
  engaged: number;
  inActive: number;
  neverEngaged: number;
  employeeAnalysis: EmployeeAnalysis;
  coachAnalysis: CoachAnalysis;
  callsAndMessages: CallsAndMessages;
}

export interface EmployeeAnalysis {
  poor: number;
  ok: number;
  great: number;
}

export interface CoachAnalysis {
  average: number;
  good: number;
  great: number;
}

export interface CallsAndMessages {
  calls: number;
  messages: number;
}

export interface BarChartItem {
  label: string;
  data: number[];
  backgroundColor: string;
  borderRadius: number;
}

export interface IMostSharedResourcePayload {
  fromDate: string;
  toDate: string;
  externalResource: string[];
  date: string;
  resourceFilter: string[];
  availableExternalResource: string[];
}

export interface IMostAddedEventPayload{
  availableEvent: string[];
  startDate: string;
  endDate: string;
  eventType: number;
  countryId: number;
  stateId: number;
  cityId: number;
}

export interface IDomainName {
  domainId:      number;
  childDomainId: number;
  surveyNameId:  number;
  name:          string;
  selected: boolean;
}