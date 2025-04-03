import {
    Block,
    BlockPermutation,
    Container,
    Dimension,
    Direction,
    EntityInventoryComponent,
    ItemComponentUseOnEvent,
    ItemStack,
    Player,
    Vector3
} from '@minecraft/server';
import { updateIfAir } from 'utils/helper';
import {
    Cache,
    DirectionHelper,
    PlayerHelper,
    Vector3Builder
} from 'adk-scripts-server';

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
    let source_into_item: Map<string, string> = new Map();
    const block: Block = componentData.block;
    const block_face: Direction = componentData.blockFace;
    const dimension: Dimension = Cache.getDimension(player.dimension.id);

    for (let tag of tags) {
        if (REGEX_FLUID.test(tag) || tag == 'adk-lib:fluid_empty') {
            fluid = tag;

            break;
        }
    }
    for (let tag of tags) {
        const match = REGEX_TURN_INTO.exec(tag);

        if (match) source_into_item.set(match[1], match[2]);
    }

    if (fluid == 'adk-lib:fluid_empty') {
        pickupLiquid(
            source_into_item,
            block,
            componentData.usedOnBlockPermutation,
            block_face,
            player,
            inventory,
            componentData.itemStack,
            true
        );

        return;
    }

    let block_location: Vector3Builder = new Vector3Builder(block).add(
        DirectionHelper.toVector3(block_face)
    );
    dimension.setBlockType(block_location, REGEX_FLUID.exec(fluid)[1]);
    let itemStack: ItemStack = new ItemStack(REGEX_FLUID.exec(fluid)[2]);
    inventory.setItem(player.selectedSlotIndex, itemStack);
    updateIfAir(dimension, dimension.getBlock(block_location).above(), {
        x: block_location.x,
        y: block_location.y + 1,
        z: block_location.z
    });
    updateIfAir(dimension, dimension.getBlock(block_location).below(), {
        x: block_location.x,
        y: block_location.y - 1,
        z: block_location.z
    });
    updateIfAir(dimension, dimension.getBlock(block_location).north(), {
        x: block_location.x,
        y: block_location.y,
        z: block_location.z - 1
    });
    updateIfAir(dimension, dimension.getBlock(block_location).east(), {
        x: block_location.x + 1,
        y: block_location.y,
        z: block_location.z
    });
    updateIfAir(dimension, dimension.getBlock(block_location).south(), {
        x: block_location.x,
        y: block_location.y,
        z: block_location.z + 1
    });
    updateIfAir(dimension, dimension.getBlock(block_location).west(), {
        x: block_location.x - 1,
        y: block_location.y,
        z: block_location.z
    });
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
