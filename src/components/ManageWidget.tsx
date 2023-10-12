import { strings } from "../constants/strings";
import { Link } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DragAndDropContainer from "./dragAndDrop/DragAndDropContainer";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  useGetWidgetPositionMutation,
  useUpdateWidgetPositionMutation,
} from "../redux/api/widgetApi";
import { showServerError } from "../constants/utils";
import PageLoader from "./PageLoader";

const ManageWidget = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    onHandleChange() {
      getWidgetPosition(null)
    },
  }));
  const [widgetCards, setWidgetCards] = useState<any[]>();
  const [updateWidgetPosition, { isLoading, isError, error, isSuccess, data }] =
    useUpdateWidgetPositionMutation();
  const [
    getWidgetPosition,
    {
      isLoading: isLoadingGetWidget,
      isError: isErrorGetWidget,
      error: errorGetWidget,
      isSuccess: isSuccessGetWidget,
      data: dataGetWidget,
    },
  ] = useGetWidgetPositionMutation();

  useEffect(() => {
    if (isSuccess) {
      window.location.reload();
    }
    if (isError) {
      showServerError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const getUpdatedWidgetOrders = () => {
    let orderString = "";
    const orderArray: string[] = [];
    widgetCards?.forEach((item) => {
      orderArray.push(item.id + "-" + item.visibility);
    });
    orderArray?.forEach((value, index) => {
      if (orderArray.length - 1 == index) orderString = orderString + value;
      else orderString = orderString + value + ",";
    });
    return orderString;
  };
  const onApply = () => {
    const params = {
      tilePosition: getUpdatedWidgetOrders(),
    };
    updateWidgetPosition(params);
  };

  return (
    <>
      <div
        className="offcanvas offcanvas-end"
        tabIndex={-1}
        id="offcanvasManageWidgets"
        aria-labelledby="offcanvasManageWidgets"
      >
        <div className="offcanvas-header">
          <h4 className="offcanvas-title">{strings.manage_widgets}</h4>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="row">
            <div className="col-md-12">
              <DndProvider backend={HTML5Backend}>
                <DragAndDropContainer
                  updateArray={(widgetCards: any) => {
                    setWidgetCards(widgetCards);
                  }}
                  isLoading={isLoadingGetWidget}
                  isError={isErrorGetWidget}
                  error={errorGetWidget}
                  isSuccess={isSuccessGetWidget}
                  data={dataGetWidget}
                />
              </DndProvider>
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
              className="btn btn-primary"
              data-bs-dismiss="offcanvas"
              to="#"
              onClick={() => {
                onApply();
              }}
            >
              {strings.apply}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
});

export default ManageWidget;
