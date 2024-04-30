import {
    Block,
    Dimension,
    Entity,
    ItemComponentConsumeEvent,
    ItemCustomComponent,
    world
} from '@minecraft/server';
import { clamp } from '../utils/math';
import { dimensionMap, teleportEntity } from './teleport';
import { giveFoodEffect } from './item_food';

class onConsume implements ItemCustomComponent {
    constructor() {
        this.onConsume = this.onConsume.bind(this);
    }
    onConsume(_componentData: ItemComponentConsumeEvent) {}
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
