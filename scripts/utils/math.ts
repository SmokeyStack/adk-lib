import { Direction, Vector3 } from '@minecraft/server';

export function areVectorsEqual(vector1: Vector3, vector2: Vector3): boolean {
    return (
        vector1.x === vector2.x &&
        vector1.y === vector2.y &&
        vector1.z === vector2.z
    );
}

export function clamp(number: number, min: number, max: number): number {
    return Math.max(min, Math.min(number, max));
}

/**
 * @brief This is needed because faceLocation returns a relative position, not world position.
 * @param direction North, South, East, West, Up, Down
 * @returns Vector3
 */
export function directionToVector3(direction: Direction): Vector3 {
    switch (direction) {
        case Direction.Down:
            return { x: 0, y: -1, z: 0 };
        case Direction.Up:
            return { x: 0, y: 1, z: 0 };
        case Direction.North:
            return { x: 0, y: 0, z: -1 };
        case Direction.South:
            return { x: 0, y: 0, z: 1 };
        case Direction.West:
            return { x: -1, y: 0, z: 0 };
        case Direction.East:
            return { x: 1, y: 0, z: 0 };
    }
}
