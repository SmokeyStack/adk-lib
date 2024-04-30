import {
    Dimension,
    Entity,
    ItemComponentConsumeEvent,
    ItemCustomComponent,
    world
} from '@minecraft/server';

class onConsume implements ItemCustomComponent {
    constructor() {
        this.onConsume = this.onConsume.bind(this);
    }
    onConsume(_componentData: ItemComponentConsumeEvent) {}
}

let dimensionMap: Map<Dimension, number> = new Map();
dimensionMap.set(world.getDimension('minecraft:overworld'), 384);
dimensionMap.set(world.getDimension('minecraft:nether'), 256);
dimensionMap.set(world.getDimension('minecraft:the_end'), 256);

function clamp(number: number, min: number, max: number): number {
    return Math.max(min, Math.min(number, max));
}

function teleportEntity(
    entity: Entity,
    x: number,
    y: number,
    z: number
): boolean {
    let new_y = y;

    while (new_y > entity.dimension.heightRange.min) {
        const block = entity.dimension.getBlock({ x, y: new_y, z });

        if (block.isLiquid || block.typeId === 'minecraft:air') new_y--;
        else break;
    }

    const targetBlock = entity.dimension.getBlock({ x, y: new_y, z });
    const targetBlockAir = entity.dimension.getBlock({ x, y: new_y + 1, z });

    if (
        targetBlock.isLiquid ||
        targetBlock.typeId === 'minecraft:air' ||
        !targetBlockAir.isAir
    )
        return false;

    entity.teleport({ x, y: new_y + 1, z });

    return true;
}

export class teleport extends onConsume {
    onCompleteUse(componentData: ItemComponentConsumeEvent) {
        for (let i = 0; i < 16; ++i) {
            const d =
                componentData.source.location.x + (Math.random() - 0.5) * 16.0;
            const e = clamp(
                componentData.source.location.y + (Math.random() * 16 - 8),
                componentData.source.dimension.heightRange.min,
                dimensionMap.get(componentData.source.dimension)
            );
            const f =
                componentData.source.location.z + (Math.random() - 0.5) * 16.0;

            if (teleportEntity(componentData.source, d, e, f)) break;
        }
    }
}
