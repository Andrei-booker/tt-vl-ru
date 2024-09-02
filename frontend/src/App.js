import { useCallback, useEffect, useState } from "react";
import "./App.css";
import AdCard from "./components/AdCard/ AdCard";
import Actions from "./components/Actions/Actions";

function App() {
  const [data, setData] = useState([]);
  const [isLoad, setIsLoad] = useState(false);
  const [activeAdIndex, setActiveAdIndex] = useState(0);
  const [report, setReport] = useState([]);
  const [reasonMessage, setReasonMessage] = useState("");
  const [reason, setReason] = useState("");
  const [isActiveInput, setIsActiveInput] = useState(false);

  const adDecision = useCallback(
    (approved = true, reason = "", reasonMessage = "") => {
      const newReport = [...report];
      newReport[activeAdIndex] = {
        id: data[activeAdIndex].id,
        approved,
        reason,
        reasonMessage,
      };
      setReport(newReport);
      setActiveAdIndex(prev => (prev + 1 < data.length ? prev + 1 : prev));
    },
    [activeAdIndex, data, report]
  );

  useEffect(() => {
    const enterKeyHandler = event => {
      if (event.code === "Enter") {
        fetch("http://localhost:8000")
          .then(res => res.json())
          .then(res => setData(res.data))
          .catch(error => {});
        setIsLoad(true);
      }
    };
    window.addEventListener("keyup", enterKeyHandler);
    return () => window.removeEventListener("keyup", enterKeyHandler);
  }, []);

  useEffect(() => {
    const f7KeyHandler = event => {
      if (event.code === "F7" && report.length === 10) {
        fetch("http://localhost:8000", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(report),
        })
          .then(res => res.json())
          .then(res => {
            setData(res.data);
            setActiveAdIndex(0);
            setReport([]);
          })
          .catch(err => console.error("Ошибка при отправке:", err));
      }
    };
    window.addEventListener("keyup", f7KeyHandler);
    return () => window.removeEventListener("keyup", f7KeyHandler);
  }, [report]);

  useEffect(() => {
    const spaceKeyHandler = event => {
      if (
        event.code === "Space" &&
        activeAdIndex < data.length &&
        !isActiveInput
      ) {
        adDecision();
      }
    };
    window.addEventListener("keyup", spaceKeyHandler);
    return () => window.removeEventListener("keyup", spaceKeyHandler);
  }, [activeAdIndex, data, adDecision, isActiveInput]);

  useEffect(() => {
    const delKeyHandler = event => {
      if (
        (event.key === "Delete" ||
          (event.key === "Backspace" && event.getModifierState("Fn"))) &&
        activeAdIndex < data.length
      ) {
        setReason("reject");
        setIsActiveInput(true);
      }
    };
    window.addEventListener("keyup", delKeyHandler);
    return () => window.removeEventListener("keyup", delKeyHandler);
  }, [activeAdIndex, data, report, reasonMessage]);

  useEffect(() => {
    const shiftEnterKeyHandler = event => {
      if (
        event.shiftKey &&
        event.code === "Enter" &&
        activeAdIndex < data.length
      ) {
        setReason("escalate");
        setIsActiveInput(true);
      }
    };
    window.addEventListener("keyup", shiftEnterKeyHandler);
    return () => window.removeEventListener("keyup", shiftEnterKeyHandler);
  }, [activeAdIndex, data, report, reasonMessage]);

  useEffect(() => {
    const escKeyHandler = event => {
      if (event.code === "Escape" && reason.length) {
        setIsActiveInput(false);
        setReason("");
      }
    };
    window.addEventListener("keyup", escKeyHandler);
    return () => window.removeEventListener("keyup", escKeyHandler);
  }, [reason]);

  const adOnClickHandler = index => {
    setActiveAdIndex(index);
  };
  const onTextareaHandler = event => {
    if (event.code === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmitHandler(event);
    }
  };
  const onSubmitHandler = event => {
    event.preventDefault();
    adDecision(false, reason, reasonMessage);
    setReasonMessage("");
    setReason("");
    setIsActiveInput(false);
  };

  if (!isLoad) return;
  if (!data.length) return <div>Новых объявлений пока нет :)</div>;

  return (
    <div className="App">
      {!!reason.length && (
        <div className="reasonFormWrapper">
          <div className="reasonForm">
            <form onSubmit={onSubmitHandler}>
              <textarea
                autoFocus
                value={reasonMessage}
                onChange={event => setReasonMessage(event.target.value)}
                placeholder="Укажите причину"
                onKeyDown={onTextareaHandler}
              ></textarea>
              <button type="submit">Подтвердить</button>
            </form>
          </div>
        </div>
      )}
      {report.length === 10 && (
        <div className="successfulMessage">
          Объявления обработаны, можно отправлять
        </div>
      )}
      <ul className="adsList">
        {data.map((item, index) => {
          return (
            <li key={item.id}>
              <AdCard
                id={item.id}
                date={item.publishDateString}
                login={item.ownerLogin}
                title={item.bulletinSubject}
                description={item.bulletinText}
                imgsArr={item.bulletinImages}
                isActive={activeAdIndex === index}
                adOnClickHandler={index => adOnClickHandler(index)}
                index={index}
              />
            </li>
          );
        })}
      </ul>
      <Actions />
    </div>
  );
}

export default App;
