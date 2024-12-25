import {
    Block,
    BlockPermutation,
    Container,
    Direction,
    EntityInventoryComponent,
    ItemComponentUseOnEvent,
    ItemStack,
    Player,
    Vector3
} from '@minecraft/server';
import { updateIfAir } from 'utils/helper';
import { DirectionHelper, PlayerHelper } from 'adk-scripts-server';

export function onUseOnBucket(componentData: ItemComponentUseOnEvent) {
    let tags: string[] = componentData.itemStack.getTags();
    const REGEX_FLUID: RegExp = new RegExp(
        'adk-lib:fluid_([a-z]\\w+:[a-z]\\w+)_([a-z]\\w+:[a-z]\\w+)'
    );
    const REGEX_TURN_INTO: RegExp = new RegExp(
        'adk-lib:fluid_([a-z]\\w+:[a-z]\\w+)_turn_into_([a-z]\\w+:[a-z]\\w+)'
    );
    let player: Player = componentData.source as Player;
    let inventory: Container = (
        player.getComponent('inventory') as EntityInventoryComponent
    ).container;
    let fluid: string;
    let sourceIntoItem: Map<string, string> = new Map();

    for (let tag of tags) {
        if (REGEX_FLUID.test(tag) || tag == 'adk-lib:fluid_empty') {
            fluid = tag;

            break;
        }
    }
    for (let tag of tags) {
        const match = REGEX_TURN_INTO.exec(tag);

        if (match) sourceIntoItem.set(match[1], match[2]);
    }

    if (fluid == 'adk-lib:fluid_empty') {
        pickupLiquid(
            sourceIntoItem,
            componentData.block,
            componentData.usedOnBlockPermutation,
            componentData.blockFace,
            player,
            inventory,
            componentData.itemStack,
            true
        );

        return;
    }

    let blockLocation: Vector3 = componentData.block.offset(
        DirectionHelper.toVector3(componentData.blockFace)
    );
    componentData.source.dimension.setBlockType(
        blockLocation,
        REGEX_FLUID.exec(fluid)[1]
    );
    let itemStack: ItemStack = new ItemStack(REGEX_FLUID.exec(fluid)[2]);
    inventory.setItem(player.selectedSlotIndex, itemStack);
    updateIfAir(
        componentData.source.dimension,
        componentData.source.dimension.getBlock(blockLocation).above(),
        { x: blockLocation.x, y: blockLocation.y + 1, z: blockLocation.z }
    );
    updateIfAir(
        componentData.source.dimension,
        componentData.source.dimension.getBlock(blockLocation).below(),
        { x: blockLocation.x, y: blockLocation.y - 1, z: blockLocation.z }
    );
    updateIfAir(
        componentData.source.dimension,
        componentData.source.dimension.getBlock(blockLocation).north(),
        { x: blockLocation.x, y: blockLocation.y, z: blockLocation.z - 1 }
    );
    updateIfAir(
        componentData.source.dimension,
        componentData.source.dimension.getBlock(blockLocation).east(),
        { x: blockLocation.x + 1, y: blockLocation.y, z: blockLocation.z }
    );
    updateIfAir(
        componentData.source.dimension,
        componentData.source.dimension.getBlock(blockLocation).south(),
        { x: blockLocation.x, y: blockLocation.y, z: blockLocation.z + 1 }
    );
    updateIfAir(
        componentData.source.dimension,
        componentData.source.dimension.getBlock(blockLocation).west(),
        { x: blockLocation.x - 1, y: blockLocation.y, z: blockLocation.z }
    );
}

/**
 * @brief Picks up the liquid and replaces it with the item.
 * @param sourceIntoItem A map of the source liquid to the item it turns into
 * @param block The block to check
 * @param blockPermutation The block permutation
 * @param blockFace The block face
 * @param player The player
 * @param inventory The player's inventory
 * @param item The item stack
 * @param turnToAir Whether to turn the block into air
 * @returns
 */
export function pickupLiquid(
    sourceIntoItem: Map<string, string>,
    block: Block,
    blockPermutation: BlockPermutation,
    blockFace: Direction,
    player: Player,
    inventory: Container,
    item: ItemStack,
    turnToAir: boolean
): void {
    for (let [source, turnInto] of sourceIntoItem) {
        if (blockPermutation.type.id != source) {
            const OFFSET: Vector3 = DirectionHelper.toVector3(blockFace);
            block = block.offset(OFFSET);
        }

        if (block.type.id != source) continue;
        if (turnToAir)
            player.dimension.setBlockType(block.location, 'minecraft:air');

        let itemStack: ItemStack = new ItemStack(turnInto);

        if (inventory.emptySlotsCount == 0 || item.amount != 1) {
            player.dimension.spawnItem(itemStack, player.location);
            PlayerHelper.decrementStack(player);
            return;
        }

        inventory.setItem(player.selectedSlotIndex, itemStack);

        break;
    }
}
