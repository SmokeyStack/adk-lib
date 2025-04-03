import {
    Entity,
    ItemComponentConsumeEvent,
    ItemCustomComponent
} from '@minecraft/server';
import { clamp } from '../../utils/math';
import { teleportEntity } from '../teleport';
import { giveFoodEffect } from '../item_food';
import { Cache, Debug, Vector3Builder } from 'adk-scripts-server';

class onConsume implements ItemCustomComponent {
    constructor() {
        this.onConsume = this.onConsume.bind(this);
    }
    onConsume(_componentData: ItemComponentConsumeEvent) {}
}

export class debug extends onConsume {
    onConsume(componentData: ItemComponentConsumeEvent): void {
        let data: Object = Debug.logEventData(
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

export class teleport extends onConsume {
    onCompleteUse(componentData: ItemComponentConsumeEvent) {
        for (let a = 0; a < 16; ++a) {
            const source: Entity = componentData.source;
            const dimension = Cache.getDimension(source.dimension.id);
            const location: Vector3Builder = new Vector3Builder(
                source.location
            );
            const x: number = location.x + (Math.random() - 0.5) * 16.0;
            const y: number = clamp(
                location.y + (Math.random() * 16 - 8),
                Cache.getDimensionHeightRange(dimension.id)[0],
                Cache.getDimensionHeightRange(dimension.id)[1]
            );
            const z: number = location.z + (Math.random() - 0.5) * 16.0;

            if (teleportEntity(source, x, y, z)) break;
        }
    }
}

export class foodEffect extends onConsume {
    onConsume(componentData: ItemComponentConsumeEvent) {
        giveFoodEffect(componentData);
    }
}
