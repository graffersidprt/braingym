import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authApi } from "./api/authApi";
import { userApi } from "./api/userApi";
import { coachApi } from "./api/coachApi";
import { orgDetailsApi } from "./api/orgDetailsApi";
import userReducer from "./features/userSlice";
import { userSummaryApi } from "./api/userSummaryApi";
import { brainHealthProgressApi } from "./api/brainHealthProgressApi";
import { coachRatingGraphApi } from "./api/coachRatingGraphApi";
import { commonApi } from './api/commonApi';
import { currentSentimentApi } from "./api/currentSentimentApi";
import { currentEmotionsApi } from "./api/currentEmotionsApi";
import { currentBrainHealthScoreApi } from "./api/currentBrainHealthScoreApi";
import { getMostSharedResourcesApi } from "./api/getMostSharedResourcesApi";
import { getMostAddedEventApi } from "./api/getMostAddedEventApi";
import { emotionalStateApi } from "./api/emotionalStateApi";
import { getDomainsNameApi } from "./api/getDomainsNameApi";
import { getCorporateDomainComparisonApi } from "./api/getCorporateDomainComparisonApi";
import { messagesCallsApi } from "./api/messagesCallsApi";
import { widgetApi } from "./api/widgetApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [orgDetailsApi.reducerPath]: orgDetailsApi.reducer,
    [coachApi.reducerPath]: coachApi.reducer,
    [userSummaryApi.reducerPath]: userSummaryApi.reducer,
    [brainHealthProgressApi.reducerPath]: brainHealthProgressApi.reducer,
    [coachRatingGraphApi.reducerPath]: coachRatingGraphApi.reducer,
    [commonApi.reducerPath]: commonApi.reducer,
    [currentSentimentApi.reducerPath]: currentSentimentApi.reducer,
    [currentEmotionsApi.reducerPath]: currentEmotionsApi.reducer,
    [currentBrainHealthScoreApi.reducerPath]: currentBrainHealthScoreApi.reducer,
    [getMostSharedResourcesApi.reducerPath]: getMostSharedResourcesApi.reducer,
    [getMostAddedEventApi.reducerPath]: getMostAddedEventApi.reducer,
    [emotionalStateApi.reducerPath]: emotionalStateApi.reducer,
    [getDomainsNameApi.reducerPath]: getDomainsNameApi.reducer,
    [getCorporateDomainComparisonApi.reducerPath]: getCorporateDomainComparisonApi.reducer,
    [messagesCallsApi.reducerPath]: messagesCallsApi.reducer,
    [widgetApi.reducerPath]: widgetApi.reducer,
    userState: userReducer,
  },
  devTools: process.env.NODE_ENV === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([
      authApi.middleware,
      userApi.middleware,
      coachApi.middleware,
      orgDetailsApi.middleware,
      userSummaryApi.middleware,
      brainHealthProgressApi.middleware,
      coachRatingGraphApi.middleware,
      commonApi.middleware,      
      currentSentimentApi.middleware,
      currentEmotionsApi.middleware,
      currentBrainHealthScoreApi.middleware,
      getMostSharedResourcesApi.middleware,
      getMostAddedEventApi.middleware,
      emotionalStateApi.middleware,
      getDomainsNameApi.middleware,
      getCorporateDomainComparisonApi.middleware,
      messagesCallsApi.middleware,
      widgetApi.middleware
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


