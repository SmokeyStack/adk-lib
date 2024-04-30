import { Vector3 } from '@minecraft/server';

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
