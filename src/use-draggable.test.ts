import { marbles } from "rxjs-marbles/jest";
import { createDragObservable } from "./use-draggable";

const data = {
  d: new PointerEvent('mousedown'),
  m: new PointerEvent('mousedown'),
  u: new PointerEvent('mousedown'),
}

describe("useDraggable", () => {
  it(
    "emits drag events only after mousedown and end after mouseup",
    marbles(m => {
      const down$ =        m.hot("-d--------", data);
      const move$ =        m.hot("mmmmm-mmmm", data);
      const up$ =          m.hot("-------u--", data);
      const expectedDrag$ = m.hot("-eeee-ee--", {e: {x: 0, y: 0}});

      const drag$ = createDragObservable(up$, down$, move$);
      m.expect(drag$).toBeObservable(expectedDrag$);
    })
  );
});
