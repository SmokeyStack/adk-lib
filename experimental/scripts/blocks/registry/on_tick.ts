import {
    BlockComponentTickEvent,
    BlockCustomComponent,
    CustomComponentParameters,
    Dimension,
    Direction,
    Vector3
} from '@minecraft/server';
import { onTickCandle } from 'blocks/candle';
import { directionToVector3 } from 'utils/math';
import * as adk from 'adk-scripts-server';

abstract class OnTick implements BlockCustomComponent {
    abstract onTick(
        componentData: BlockComponentTickEvent,
        paramData?: CustomComponentParameters
    ): void;
}

class Debug extends OnTick {
    onTick(componentData: BlockComponentTickEvent) {
        console.log(adk.Debug.logEventData(componentData));
    }
}

class TorchParticles extends OnTick {
    onTick(componentData: BlockComponentTickEvent): void {
        if (Math.floor(Math.random() * 10) != 0) return;

        let face: string = componentData.block.permutation.getState(
            'minecraft:block_face'
        ) as string;
        let location: Vector3 = componentData.block.location;
        let dimension: Dimension = componentData.block.dimension;
        location.x += 0.5;
        location.y += 0.7;
        location.z += 0.5;

        if (face === 'up') {
            dimension.spawnParticle('minecraft:basic_smoke_particle', location);
            dimension.spawnParticle('minecraft:basic_flame_particle', location);
        } else {
            let direction: Direction =
                Direction[face.charAt(0).toUpperCase() + face.slice(1)];
            const xzOffset: number = 0.22;
            const yOffset: number = 0.27;

            switch (direction) {
                case Direction.North:
                    direction = Direction.South;
                    break;
                case Direction.East:
                    direction = Direction.West;
                    break;
                case Direction.South:
                    direction = Direction.North;
                    break;
                case Direction.West:
                    direction = Direction.East;
                    break;
                default:
                    break;
            }

            dimension.spawnParticle('minecraft:basic_smoke_particle', {
                x: location.x + xzOffset * directionToVector3(direction).x,
                y: location.y + yOffset,
                z: location.z + xzOffset * directionToVector3(direction).z
            });
            dimension.spawnParticle('minecraft:basic_flame_particle', {
                x: location.x + xzOffset * directionToVector3(direction).x,
                y: location.y + yOffset,
                z: location.z + xzOffset * directionToVector3(direction).z
            });
        }
    }
}

class CandleParticles extends OnTick {
    onTick(componentData: BlockComponentTickEvent): void {
        onTickCandle(componentData);
    }
}

enum OnTickKey {
    Debug = 'debug',
    TorchParticles = 'torch_particles',
    CandleParticles = 'candle_particles'
}

export const ON_TICK_REGISTRY: Map<OnTickKey, OnTick> = new Map([
    [OnTickKey.Debug, new Debug()],
    [OnTickKey.TorchParticles, new TorchParticles()],
    [OnTickKey.CandleParticles, new CandleParticles()]
]);
