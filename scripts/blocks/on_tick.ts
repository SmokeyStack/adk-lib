import {
    BlockComponentTickEvent,
    BlockCustomComponent,
    Dimension,
    Direction,
    Vector3,
    world
} from '@minecraft/server';
import { logEventData } from 'utils/debug';
import { directionToVector3 } from 'utils/math';

class onTick implements BlockCustomComponent {
    constructor() {
        this.onTick = this.onTick.bind(this);
    }
    onTick(_componentData: BlockComponentTickEvent) {}
}

export class debug extends onTick {
    onTick(componentData: BlockComponentTickEvent) {
        let data: Object = logEventData(
            componentData,
            componentData.constructor.name
        );
        let result: string = JSON.stringify(
            Object.keys(data)
                .sort()
                .reduce((result, key) => {
                    result[key] = data[key];
                    return result;
                }, {}),
            null,
            4
        );
        console.log(result);
    }
}

export class torchParticles extends onTick {
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
