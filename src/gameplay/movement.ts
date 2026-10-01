export interface Position {
  x: number;
  y: number;
}

/** Positions are world pixels, speed is pixels/second, delta is seconds. */
export function moveTowards(
  position: Position,
  target: Position,
  speed: number,
  deltaSeconds: number,
): Position {
  const dx = target.x - position.x;
  const dy = target.y - position.y;
  const distance = Math.hypot(dx, dy);
  const step = speed * deltaSeconds;

  if (distance === 0) return { ...target };
  if (step <= 0) return { ...position };
  if (step >= distance) return { ...target };

  return {
    x: position.x + (dx / distance) * step,
    y: position.y + (dy / distance) * step,
  };
}
