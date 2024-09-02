import React from "react";
import "./AdCard.css";
import userLogo from "../../assets/Vector.svg";

function AdCard({
  id,
  date,
  login,
  title,
  description,
  imgsArr,
  isActive,
  adOnClickHandler,
  index,
}) {
  return (
    <div
      tabIndex={-1}
      onClick={event => {
        event.preventDefault();
        adOnClickHandler(index);
      }}
      className={isActive ? "adCard active" : "adCard"}
    >
      <div className="adCardHeader">
        <div>
          <a className="adCardHeaderIdLink" href="#">
            {id}
          </a>
          <span>—</span>
          <span className="adCardHeaderDate">{date}</span>
        </div>
        <div>
          <img
            src={userLogo}
            alt="user-logo"
            className="adCardHeaderUserLogo"
          />
          <a href="#">{login}</a>
        </div>
      </div>
      <div className=" adCardTitle">
        <h1>{title}</h1>
      </div>
      <div className="adCardContent">
        <p className="adCardContentText">{description}</p>
        <div className="adCardContentImg">
          <ul>
            {imgsArr.map((img, index) => (
              <li key={index}>
                <img className="adImg" src={img} alt="ad-image" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdCard;
