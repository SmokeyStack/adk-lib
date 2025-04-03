import { Dimension, Entity, Block, MolangVariableMap } from '@minecraft/server';
import { Cache, Vector3Builder } from 'adk-scripts-server';
import { lerp, nextDouble } from 'utils/math';

export function teleportEntity(
    entity: Entity,
    x: number,
    y: number,
    z: number
): boolean {
    let new_y: number = y;
    const block_location: Vector3Builder = new Vector3Builder(x, new_y, z);
    const dimension: Dimension = Cache.getDimension(entity.dimension.id);
    const dimension_min_height: number = Cache.getDimensionHeightRange(
        dimension.id
    )[0];

    while (new_y > dimension_min_height) {
        const block: Block = dimension.getBlock(block_location);

        if (block.isLiquid || block.typeId === 'minecraft:air') new_y--;
        else break;
    }

    const target_block: Block = dimension.getBlock(block_location);
    const target_block_air: Block = dimension.getBlock(
        block_location.add(0, 1, 0)
    );

    if (
        target_block.isLiquid ||
        target_block.typeId === 'minecraft:air' ||
        !target_block_air.isAir
    )
        return false;

    for (let a: number = 0; a < 128; ++a) {
        let delta: number = a / 127.0;
        let velocity_x: number = (Math.random() - 0.5) * 0.2;
        let velocity_y: number = (Math.random() - 0.5) * 0.2;
        let velocity_z: number = (Math.random() - 0.5) * 0.2;
        let entity_location: Vector3Builder = new Vector3Builder(
            entity.location
        );
        let e: number =
            lerp(delta, entity_location.x, x) + (nextDouble(0, 1) - 0.5) * 1.0;
        let k: number =
            lerp(delta, entity_location.y, new_y + 1) + nextDouble(0, 1) * 2.0;
        let l: number =
            lerp(delta, entity_location.z, z) + (nextDouble(0, 1) - 0.5) * 1.0;
        let molang: MolangVariableMap = new MolangVariableMap();
        molang.setVector3(
            'variable.direction',
            new Vector3Builder(velocity_x, velocity_y, velocity_z)
        );
        molang.setFloat('variable.particle_random_1', Math.random());
        molang.setFloat('variable.particle_random_2', Math.random());
        entity.dimension.spawnParticle(
            'minecraft:portal_directional',
            new Vector3Builder(e, k, l),
            molang
        );
    }

    // componentData.source.dimension.spawnParticle(
    //     'minecraft:portal_directional',
    //     componentData.source.location
    // );

    entity.teleport(new Vector3Builder(x, new_y + 1, z));

    return true;
}
