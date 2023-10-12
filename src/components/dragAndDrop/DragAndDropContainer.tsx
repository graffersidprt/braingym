import update, { Spec } from "immutability-helper";
import { useCallback, useState, useEffect, Key } from "react";
import { Card } from "./Card";
import { widgetEnumList } from "../../constants/values";
import { showServerError } from "../../constants/utils";
import PageLoader from "../PageLoader";

interface Props {
  updateArray: any;
  isLoading: boolean;
  isError: boolean;
  error: any;
  isSuccess: boolean;
  data: any;
}
const DragAndDropContainer: React.FC<Props> = (props: Props) => {
  const { updateArray } = props;
  const { isLoading, isError, error, isSuccess, data } = props;
  const [widgetCards, setWidgetCards] = useState<any[]>();

  const updateWidgetList = () => {
    if (data && data?.data?.tilesPosition) {
      const tilesPositionArray: string[] = data?.data?.tilesPosition.split(",");
      const widgetUpdatedArray: any[] = [];
      if (tilesPositionArray.forEach) {
        tilesPositionArray.forEach((item) => {
          const widgetId: string = item.split("-")[0];
          const widgetVisility: string = item.split("-")[1];
          const widgetArray = widgetEnumList?.filter(
            (data: { id: any }) => data.id === widgetId
          );
          if (widgetArray.length > 0) {
            widgetUpdatedArray.push({
              id: widgetId,
              name: widgetArray[0].name,
              visibility: widgetVisility || "0",
            });
          }
        });
      }
      setWidgetCards(widgetUpdatedArray);
    }
  };
  useEffect(() => {
    updateArray(widgetCards);
  }, [widgetCards]);
  useEffect(() => {
    if (isSuccess) {
      updateWidgetList();
    }
    if (isError) {
      showServerError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const updateVisibility = (index: number, widgetCards: any[]) => {
    const newState = widgetCards?.map((obj: any, newIndex: number) => {
      if (newIndex === index) {
        return { ...obj, visibility: obj.visibility == 0 ? 1 : 0 };
      } else {
        return { ...obj, visibility: obj.visibility };
      }
    });
    setWidgetCards(newState);
  };
  const moveCard = useCallback((dragIndex: number, hoverIndex: any) => {
    setWidgetCards((prevCards: any) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      })
    );
  }, []);
  const renderCard = useCallback(
    (card: { id: Key | null | undefined; visibility: number }, index: any) => {
      return (
        <Card
          key={card.id}
          id={card.id}
          index={index}
          item={card}
          moveCard={moveCard}
          updateVisibility={updateVisibility}
          widgetCards={widgetCards}
        />
      );
    },
    [moveCard, updateVisibility]
  );
  return (
    <>
      {isLoading && <PageLoader />}

      <div className="dnd-container">
        {widgetCards &&
          widgetCards.map((card: { id: Key | null | undefined }, i: any) =>
            renderCard(card, i)
          )}
      </div>
    </>
  );
};

export default DragAndDropContainer;
