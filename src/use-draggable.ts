import React, { useRef, useLayoutEffect } from "react";
import { fromEvent, Observable } from "rxjs";
import { takeUntil, mergeMap, map } from "rxjs/operators";

export type DragEvent = { x: number; y: number };
export function createDragObservable<T extends PointerEvent>(
  up$: Observable<T>,
  down$: Observable<T>,
  move$: Observable<T>
): Observable<DragEvent> {
  let startPosition: DragEvent;
  return down$.pipe(
    mergeMap(e => {
      startPosition = startPosition || { x: e.pageX, y: e.pageY };
      return move$.pipe(
        takeUntil(up$),
        map(e => ({
          x: e.pageX - startPosition.x,
          y: e.pageY - startPosition.y
        }))
      );
    })
  );
}

export function useDraggable(draggableRef: React.RefObject<HTMLElement>) {
  const drag$ = useRef<Observable<DragEvent>>();
  useLayoutEffect(() => {
    if (!draggableRef.current) {
      return () => {};
    }
    const down$ = fromEvent<PointerEvent>(draggableRef.current, "pointerdown");
    const move$ = fromEvent<PointerEvent>(document, "pointermove");
    const up$ = fromEvent<PointerEvent>(document, "pointerup");
    drag$.current = createDragObservable(up$, down$, move$);
  }, [draggableRef]);

  return drag$;
}
