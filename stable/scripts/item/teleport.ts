import {
    Dimension,
    world,
    Entity,
    Block,
    MolangVariableMap
} from '@minecraft/server';
import { lerp, nextDouble } from 'utils/math';

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

    for (let a: number = 0; a < 128; ++a) {
        let delta: number = a / 127.0;
        let velocityX: number = (Math.random() - 0.5) * 0.2;
        let velocityY: number = (Math.random() - 0.5) * 0.2;
        let velocityZ: number = (Math.random() - 0.5) * 0.2;
        let e: number =
            lerp(delta, entity.location.x, x) + (nextDouble(0, 1) - 0.5) * 1.0;
        let k: number =
            lerp(delta, entity.location.y, newY + 1) + nextDouble(0, 1) * 2.0;
        let l: number =
            lerp(delta, entity.location.z, z) + (nextDouble(0, 1) - 0.5) * 1.0;
        let molang: MolangVariableMap = new MolangVariableMap();
        molang.setVector3('variable.direction', {
            x: velocityX,
            y: velocityY,
            z: velocityZ
        });
        molang.setFloat('variable.particle_random_1', Math.random());
        molang.setFloat('variable.particle_random_2', Math.random());
        entity.dimension.spawnParticle(
            'minecraft:portal_directional',
            {
                x: e,
                y: k,
                z: l
            },
            molang
        );
    }

    // componentData.source.dimension.spawnParticle(
    //     'minecraft:portal_directional',
    //     componentData.source.location
    // );

    entity.teleport({ x, y: newY + 1, z });

    return true;
}
