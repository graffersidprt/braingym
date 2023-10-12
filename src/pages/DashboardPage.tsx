import { useEffect, useRef, useState } from "react";
import "../assets/css/dashboard.css"; //Dasboard CSS
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import iconCalendarSarkImg from "../assets/images/icon-calendar-dark.svg";
import Header from "../components/Header";
import BrainHealthSummary from "../components/graphs/BrainHealthSummaryGraph";
import UserSummary from "../components/UserSummary";
import CurrentSentiment from "../components/graphs/CurrentSentimentGraph";
import CurrentEmotions from "../components/graphs/CurrentEmotionsGraph";
import EmotionalState from "../components/graphs/EmotionalStateGraph";
import CoachRatingGraph from "../components/graphs/CoachRatingGraph";
import MessagesAndCallsGraph from "../components/graphs/MessagesAndCallsGraph";
import MostSharedResourcesGraph from "../components/graphs/MostSharedResourcesGraph";
import MostAddedEventsGraph from "../components/graphs/MostAddedEventsGraph";
import ManageWidget from "../components/ManageWidget";
import { useGetWidgetPositionMutation } from "../redux/api/widgetApi";
import { showServerError } from "../constants/utils";
import {
  BRAIN_HEALTH_WIDGET_ID,
  COACH_WIDGET_ID,
  MOST_SHARED_EVENT_WIDGET_ID,
  SENTIMENT_ANALYSIS_WIDGET_ID,
  SUMMARY_WIDGET_ID,
} from "../constants/values";
import PageLoader from "../components/PageLoader";

const DashboardPage = () => {
  const [getWidgetPosition, { isLoading, isError, error, isSuccess, data }] =
    useGetWidgetPositionMutation();
  const [widgetPositionRecord, setWidgetPositionRecord] = useState<any>();
  const [manageStateChange, setManageStateChange] = useState<boolean>(false);

  Chart.register(...registerables);
  // Register the plugin to all charts:
  Chart.register(ChartDataLabels);

  const childCompRef = useRef<any>();
  const currentSentimentRef = useRef<any>();
  const currentEmotionsRef = useRef<any>();
  const emotionalStateRef = useRef<any>();
  const manageWidgetRef = useRef<any>();

  window.onload = (event) => {
    if (childCompRef && childCompRef.current) childCompRef.current.onLoad();
    if (currentSentimentRef && currentSentimentRef.current)
      currentSentimentRef.current.onLoad();
    if (currentEmotionsRef && currentEmotionsRef.current)
      currentEmotionsRef.current.onLoad();
    if (emotionalStateRef && emotionalStateRef.current)
      emotionalStateRef.current.onLoad();
  };

  useEffect(() => {
    if (isError) {
      showServerError(error);
    }
    if (isSuccess) {
      setWidgetPositionRecord(data);
    }
  }, [isLoading]);

  useEffect(() => {
    getWidgetPosition(null);
  }, []);

  const EmotionalSentimentWidget = () => (
    <section className="Users-section">
      <div className="row">
        <EmotionalState ref={emotionalStateRef} />
        <CurrentSentiment ref={currentSentimentRef} />
        <CurrentEmotions ref={currentEmotionsRef} />
      </div>
    </section>
  );
  const MostSharedAndEventWidget = () => (
    <section className="Users-section">
      <div className="row">
        <MostSharedResourcesGraph />
        <MostAddedEventsGraph />
      </div>
    </section>
  );
  const CoachRatingMessagesAndCallsWidget = () => (
    <section className="Users-section">
      <div className="row">
        <div className="col-lg-12">
          <div className="row">
            <CoachRatingGraph />
            <MessagesAndCallsGraph />
          </div>
        </div>
      </div>
    </section>
  );

  const AllWidget = () => {
    if (widgetPositionRecord && widgetPositionRecord?.data?.tilesPosition) {
      const widgetArray: any = [];
      const tilesPositionArray: string[] =
        widgetPositionRecord?.data?.tilesPosition.split(",");
      if (tilesPositionArray.forEach) {
        tilesPositionArray.forEach((item) => {
          const tile: string = item.split("-")[0];
          const visibility: string = item.split("-")[1];
          switch (tile) {
            case SUMMARY_WIDGET_ID:
              widgetArray.push(<UserSummary />);
              break;
            case BRAIN_HEALTH_WIDGET_ID:
              widgetArray.push(<BrainHealthSummary ref={childCompRef} />);
              break;
            case SENTIMENT_ANALYSIS_WIDGET_ID:
              if (visibility === "1")
                widgetArray.push(<EmotionalSentimentWidget />);
              break;
            case COACH_WIDGET_ID:
              if (visibility === "1")
                widgetArray.push(<CoachRatingMessagesAndCallsWidget />);
              break;
            case MOST_SHARED_EVENT_WIDGET_ID:
              if (visibility === "1")
                widgetArray.push(<MostSharedAndEventWidget />);
              break;
          }
        });
      }

      return widgetArray;
    }
  };

  return (
    <>
      <div className="bg-white">
        {isLoading && (
          <div className="bg-loader-dashboard">
            <PageLoader />
          </div>
        )}
        <div>
          <div className="toasts-alert">
            <div id="liveAlert" className="live-alert"></div>
          </div>
          <Header handleManageWidgetClick ={()=>{manageWidgetRef?.current?.onHandleChange();}}/>
          <ManageWidget ref={manageWidgetRef}/>
          <main className=" ms-sm-auto after-login">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12 pd-b-32 mr-b-12">
                  <AllWidget />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
