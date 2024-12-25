import { Vector3 } from '@minecraft/server';

export function clamp(number: number, min: number, max: number): number {
    return Math.max(min, Math.min(number, max));
}

export function vectorOfCenter(vector: Vector3): Vector3 {
    return { x: vector.x + 0.5, y: vector.y + 0.5, z: vector.z + 0.5 };
}

export function nextDouble(min: number, max: number): number {
    if (min >= max) return min;

    return Math.random() * (max - min) + min;
}

export function getRandomVelocity(): Vector3 {
    return {
        x: nextDouble(-0.5, 0.5),
        y: nextDouble(-0.5, 0.5),
        z: nextDouble(-0.5, 0.5)
    };
}

export function lerp(delta: number, start: number, end: number) {
    return start + delta * (end - start);
}
