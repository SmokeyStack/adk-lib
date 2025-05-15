import { Dimension, Vector3, Block } from '@minecraft/server';

/**
 * @brief Updates the liquid block since placing a liquid by itself won't make it flow.
 * @param dimension The dimension to execute in
 * @param location The world location
 */
export function updateLiquidBlock(
    dimension: Dimension,
    location: Vector3
): void {
    dimension.setBlockType(location, 'minecraft:bedrock');
    dimension.setBlockType(location, 'minecraft:air');
}

/**
 * @brief Updates the block if it is air.
 * @param dimension Dimension to execute in
 * @param block Block to check
 * @param blockLocation Block location
 */
export function updateIfAir(
    dimension: Dimension,
    block: Block,
    blockLocation: Vector3
): void {
    if (block.typeId == 'minecraft:air')
        updateLiquidBlock(dimension, blockLocation);
}

export function doesBlockBlockkMovement(block: Block): boolean {
    return (
        block.typeId != 'minecraft:cobweb' &&
        block.typeId != 'minecraft:bamboo_sapling' &&
        block.isSolid
    );
}
