import React, { useRef, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import { useDraggable } from "./use-draggable";
import "pepjs";
import "./styles.css";

function App() {
  return (
    <div className="App">
      <h1>useDraggable based on RxJS</h1>
      <DraggableComponent />
    </div>
  );
}

function DraggableComponent() {
  const draggableDivRef = useRef<HTMLDivElement>();
  const drag$ = useDraggable(draggableDivRef);

  useLayoutEffect(() => {
    if (!drag$.current) {
      return () => {};
    }

    const dragSubscription = drag$.current.subscribe(e => {
      if (!draggableDivRef.current) {
        return;
      }

      draggableDivRef.current.style.transform = `translateY(${e.y}px)`;
    });
    return () => {
      dragSubscription.unsubscribe();
    };
  }, [drag$]);

  return (
    <div
      ref={draggableDivRef}
      touch-action="none"
      style={{ userSelect: "none", padding: "8px", backgroundColor: "#eee" }}
    >
      drag me
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
