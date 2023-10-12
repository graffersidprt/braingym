import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import eyeIconImg from "../../assets/images/icon-eye.svg";
import eyeCloseIconImg from "../../assets/images/icon-close-eye.svg";
import hamburgerIconImg from "../../assets/images/icon-hamburger.svg";
import { BRAIN_HEALTH_WIDGET_ID, SUMMARY_WIDGET_ID } from "../../constants/values";
export const Card = ({ item, id, index, moveCard, updateVisibility, widgetCards }: any) => {
  const ref = useRef<any>(null);
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: any, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset() || {x:0, y:0};
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  const isNotShowEye = () =>{
    return item?.id===SUMMARY_WIDGET_ID || item?.id===BRAIN_HEALTH_WIDGET_ID
  }
  return (
    <div ref={ref} className="dnd-card" style={{ opacity }} data-handler-id={handlerId}>
      <div>
        <img
          src={hamburgerIconImg}
          className="hamburger-icon"
          alt=""
        />
        <span className="widget-list-text">{item?.name}</span>
      </div>
      {!isNotShowEye() && <img
        src={item?.visibility==1?eyeIconImg: eyeCloseIconImg}
        className="eye-icon"
        alt=""
        onClick={() => {
          updateVisibility(index, widgetCards)
        }}
      />}
    </div>
  );
};
