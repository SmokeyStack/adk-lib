import {
    ItemComponentConsumeEvent,
    ItemCustomComponent
} from '@minecraft/server';
import { clamp } from '../../utils/math';
import { dimensionMap, teleportEntity } from '../teleport';
import { giveFoodEffect } from '../item_food';
import { Debug } from 'adk-scripts-server';

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
            const x: number =
                componentData.source.location.x + (Math.random() - 0.5) * 16.0;
            const y: number = clamp(
                componentData.source.location.y + (Math.random() * 16 - 8),
                componentData.source.dimension.heightRange.min,
                dimensionMap.get(componentData.source.dimension)
            );
            const z: number =
                componentData.source.location.z + (Math.random() - 0.5) * 16.0;

            if (teleportEntity(componentData.source, x, y, z)) break;
        }
    }
}

export class foodEffect extends onConsume {
    onConsume(componentData: ItemComponentConsumeEvent) {
        giveFoodEffect(componentData);
    }
}
