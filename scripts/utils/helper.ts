import {
    Player,
    ItemStack,
    Dimension,
    Vector3,
    Block,
    Direction
} from '@minecraft/server';

/**
 * Decrements the stack of the player.
 * @param player The player
 */
export function decrementStack(player: Player): void {
    if (player.getGameMode() == 'creative') return;

    let item = player
        .getComponent('inventory')
        .container.getItem(player.selectedSlotIndex);

    if (item.amount == 1)
        player
            .getComponent('inventory')
            .container.setItem(player.selectedSlotIndex, undefined);
    else
        player
            .getComponent('inventory')
            .container.setItem(
                player.selectedSlotIndex,
                new ItemStack(item.typeId, item.amount - 1)
            );
}

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

/**
 * Structure to hold the direction types that can be iterable.
 */
export const DirectionType = {
    HORIZONTAL: [
        Direction.North,
        Direction.South,
        Direction.West,
        Direction.East
    ]
};

export function doesBlockBlockkMovement(block: Block): boolean {
    return (
        block.typeId != 'minecraft:cobweb' &&
        block.typeId != 'minecraft:bamboo_sapling' &&
        block.isSolid
    );
}
