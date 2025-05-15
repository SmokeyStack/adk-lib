import {
    Block,
    Container,
    Direction,
    EntityInventoryComponent,
    EquipmentSlot,
    ItemStack,
    Player,
    Vector3
} from '@minecraft/server';
import * as adk from 'adk-scripts-server';

/**
 * Pickup a liquid block and convert it to an item.
 *
 * @param transform_to The item to transform the liquid into.
 * @param block The block that was interacted with.
 * @param block_face The face of the block that was interacted with.
 * @param player The player who interacted with the block.
 * @param item The item stack that was used to interact with the block.
 * @param turn_to_air Whether to turn the block into air after pickup.
 */
export function pickupLiquid(
    transform_to: string,
    block: Block,
    block_face: Direction,
    player: Player,
    item: ItemStack,
    turn_to_air: boolean
): void {
    const offset: Vector3 = adk.DirectionHelper.toVector3(block_face);
    const block_offset: Block | undefined = block.offset(offset);
    if (!block_offset) return;
    if (turn_to_air) block_offset.setType('minecraft:air');
    const converted_item: ItemStack = new ItemStack(transform_to);
    const inventory: EntityInventoryComponent | undefined =
        player.getComponent('inventory');
    if (!inventory) return;
    const container: Container = inventory.container;
    if (!container) return;
    if (container.emptySlotsCount == 0 || item.amount != 1) {
        player.dimension.spawnItem(converted_item, player.location);
        adk.PlayerHelper.decrementStack(player);
        return;
    }

    adk.PlayerHelper.setItemToEquippable(
        player,
        EquipmentSlot.Mainhand,
        converted_item
    );
}
