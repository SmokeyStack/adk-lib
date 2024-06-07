import {
    Player,
    ItemStack,
    Dimension,
    Vector3,
    Block,
    Direction,
    Container,
    EntityInventoryComponent
} from '@minecraft/server';

/**
 * Decrements the stack of the player.
 * @param player The player
 */
export function decrementStack(player: Player): void {
    if (player.getGameMode() == 'creative') return;

    // ==================================================
    // Workaround since stable doesn't have EntityComponentTypeMap
    let inventoryTemp: EntityInventoryComponent = player.getComponent(
        'inventory'
    ) as EntityInventoryComponent;
    // ==================================================

    let item = inventoryTemp.container.getItem(player.selectedSlotIndex);
    let inventory: Container = inventoryTemp.container;

    if (item.amount == 1)
        inventory.setItem(player.selectedSlotIndex, undefined);
    else
        inventory.setItem(
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

/**
 * @brief This function gets the direction of the direction provided.
 * @param direction Direction to get the opposite of
 * @returns The opposite direction
 */
export function getOppositeDirection(direction: Direction): Direction {
    switch (direction) {
        case Direction.Up:
            return Direction.Down;
        case Direction.Down:
            return Direction.Up;
        case Direction.North:
            return Direction.South;
        case Direction.East:
            return Direction.West;
        case Direction.South:
            return Direction.North;
        case Direction.West:
            return Direction.East;
        default:
            break;
    }
}

export function doesBlockBlockkMovement(block: Block): boolean {
    return (
        block.typeId != 'minecraft:cobweb' &&
        block.typeId != 'minecraft:bamboo_sapling' &&
        !block.isLiquid &&
        !block.isAir
    );
}
