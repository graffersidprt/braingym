import { strings } from "./strings";

export const eventTypes = [
  {
    id: 2,
    type: "Virtual",
    checked: false,
  },
  {
    id: 1,
    type: "In-Person",
    checked: false,
  },
];
export const recurrenceTypes = [
  {
    id: 2,
    type: "Ongoing",
    checked: false,
  },
  {
    id: 3,
    type: "Completed",
    checked: false,
  },
];

export const defaultLocationState = {
  countryId: 0,
  countryName: "",
  stateId: 0,
  stateName: "",
  cityId: 0,
  cityName: "",
};

export const defaultGenderState = {
  genderId: 0,
  genderName: "",
};

export const defaultResourcesTypes = [
  {
    id: 3,
    type: "App",
    checked: false,
  },
  {
    id: 4,
    type: "Article",
    checked: false,
  },
  {
    id: 2,
    type: "Audio",
    checked: false,
  },
  {
    id: 1,
    type: "Video",
    checked: false,
  },
];
export const ratingType = [
  {
    star: 1,
    checked: false,
  },
  {
    star: 2,
    checked: false,
  },
  {
    star: 3,
    checked: false,
  },
  {
    star: 4,
    checked: false,
  },
  {
    star: 5,
    checked: false,
  },
];
export const SUMMARY_WIDGET_ID='21';
export const BRAIN_HEALTH_WIDGET_ID='22';
export const SENTIMENT_ANALYSIS_WIDGET_ID='23';
export const COACH_WIDGET_ID='24';
export const MOST_SHARED_EVENT_WIDGET_ID='25';

export const widgetEnumList = [
  {
    id: SUMMARY_WIDGET_ID,
    name: strings.summary,
    visibility: 1,
  },
  {
    id: BRAIN_HEALTH_WIDGET_ID,
    name: strings.brain_health,
    visibility: 1,
  },
  {
    id: SENTIMENT_ANALYSIS_WIDGET_ID,
    name: strings.sentiment_analysis,
    visibility: 1,
  },
  {
    id: COACH_WIDGET_ID,
    name: strings.coach,
    visibility: 1,
  },
  {
    id: MOST_SHARED_EVENT_WIDGET_ID,
    name: strings.events_and_external_resources,
    visibility: 1,
  },
];


export const ALERT_DISMISS_TIME= 3000;
export const SELF_DESCRIBE_ID= 100;