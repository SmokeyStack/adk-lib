import { Entity, Block, MolangVariableMap } from '@minecraft/server';
import * as adk from 'adk-scripts-server';
import { nextDouble } from 'utils/math';

export function teleportEntity(
    entity: Entity,
    location: adk.Vector3Builder,
    dimension_height_range: { min: number; max: number }
): boolean {
    while (location.y > dimension_height_range.min) {
        const block: Block | undefined = entity.dimension.getBlock(location);

        if (!block) break;
        if (block.isLiquid || block.typeId === 'minecraft:air') location.y--;
        else break;
    }

    const target_block: Block | undefined = entity.dimension.getBlock(location);
    if (!target_block) return false;
    const target_block_above: Block | undefined = target_block.above();
    if (!target_block_above) return false;

    if (
        target_block.isLiquid ||
        target_block.typeId === 'minecraft:air' ||
        !target_block_above.isAir
    )
        return false;

    for (let a: number = 0; a < 128; ++a) {
        let delta: number = a / 127.0;
        let velocity_x: number = (Math.random() - 0.5) * 0.2;
        let velocity_y: number = (Math.random() - 0.5) * 0.2;
        let velocity_z: number = (Math.random() - 0.5) * 0.2;
        let e: number =
            adk.MathHelper.lerp(entity.location.x, location.x, delta) +
            (nextDouble(0, 1) - 0.5) * 1.0;
        let k: number =
            adk.MathHelper.lerp(entity.location.y, location.y + 1, delta) +
            nextDouble(0, 1) * 2.0;
        let l: number =
            adk.MathHelper.lerp(entity.location.z, location.z, delta) +
            (nextDouble(0, 1) - 0.5) * 1.0;
        let molang: MolangVariableMap = new MolangVariableMap();
        molang.setVector3('variable.direction', {
            x: velocity_x,
            y: velocity_y,
            z: velocity_z
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

    entity.teleport(location.add(0, 1, 0));

    return true;
}
