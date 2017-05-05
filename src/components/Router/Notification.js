import React from 'react';
import '../../css/animations.css';

const style = {
  display: "inlineBlock",
  padding: "0px 20px",
  backgroundColor: "green",
  position: "absolute",
  top: "10px",
  right: "10px",
  color: "#fff",
  animation: "fadeInLeft 0.5s"
}

function Notification (props) {
  return (
    <div className="notification" style={style}>
      <p>{props.notification}</p>
    </div>
  )
}

export default Notification;
