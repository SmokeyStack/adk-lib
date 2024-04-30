import { Dimension, world, Entity, Block } from '@minecraft/server';

export const dimensionMap: Map<Dimension, number> = new Map();
dimensionMap.set(world.getDimension('minecraft:overworld'), 384);
dimensionMap.set(world.getDimension('minecraft:nether'), 256);
dimensionMap.set(world.getDimension('minecraft:the_end'), 256);

export function teleportEntity(
    entity: Entity,
    x: number,
    y: number,
    z: number
): boolean {
    let newY: number = y;

    while (newY > entity.dimension.heightRange.min) {
        const block: Block = entity.dimension.getBlock({ x, y: newY, z });

        if (block.isLiquid || block.typeId === 'minecraft:air') newY--;
        else break;
    }

    const targetBlock: Block = entity.dimension.getBlock({ x, y: newY, z });
    const targetBlockAir: Block = entity.dimension.getBlock({
        x,
        y: newY + 1,
        z
    });

    if (
        targetBlock.isLiquid ||
        targetBlock.typeId === 'minecraft:air' ||
        !targetBlockAir.isAir
    )
        return false;

    entity.teleport({ x, y: newY + 1, z });

    return true;
}
