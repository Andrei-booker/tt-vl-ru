import React from "react";
import "./Actions.css";

function Actions() {
  return (
    <div className="actions">
      <ul className="actionsTitles">
        <li>Одобрить</li>
        <li>Отклонить</li>
        <li>Эскалация</li>
        <li>Сохранить</li>
      </ul>
      <ul className="actionsKeys">
        <li>
          <span className="action actionSpace">Пробел</span>
        </li>
        <li>
          <span className="action actionDel">Del</span>
        </li>
        <li>
          <span className="action actionShiftEnter">Shift+Enter</span>
        </li>
        <li>
          <span>F7</span>
        </li>
      </ul>
    </div>
  );
}

export default Actions;
