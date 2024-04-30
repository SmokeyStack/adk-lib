import {
    Block,
    Container,
    Dimension,
    Direction,
    ItemComponentUseOnEvent,
    ItemStack,
    Player,
    Vector3
} from '@minecraft/server';

export function onUseOnBucket(componentData: ItemComponentUseOnEvent) {
    let tags: string[] = componentData.itemStack.getTags();
    const REGEX_FLUID: RegExp = new RegExp(
        'adk-lib:fluid_([a-z]\\w+:[a-z]\\w+)_([a-z]\\w+:[a-z]\\w+)'
    );
    const REGEX_TURN_INTO: RegExp = new RegExp(
        'adk-lib:fluid_([a-z]\\w+:[a-z]\\w+)_turn_into_([a-z]\\w+:[a-z]\\w+)'
    );
    let player: Player = componentData.source as Player;
    let inventory: Container = player.getComponent('inventory').container;
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
        for (let [source, turnInto] of sourceIntoItem) {
            let block: Block = componentData.block;

            if (componentData.usedOnBlockPermutation.type.id != source) {
                const OFFSET: Vector3 = directionToVector3(
                    componentData.blockFace
                );
                block = componentData.block.offset(OFFSET);
            }

            if (block.type.id != source) continue;

            player.dimension.setBlockType(block.location, 'minecraft:air');
            let itemStack: ItemStack = new ItemStack(turnInto);

            if (
                inventory.emptySlotsCount == 0 &&
                componentData.itemStack.amount != 1
            ) {
                player.dimension.spawnItem(itemStack, player.location);
                return;
            }

            inventory.setItem(player.selectedSlotIndex, itemStack);

            break;
        }

        return;
    }

    let blockLocation: Vector3 = componentData.block.offset(
        directionToVector3(componentData.blockFace)
    );
    componentData.source.dimension.setBlockType(
        blockLocation,
        REGEX_FLUID.exec(fluid)[1]
    );
    let itemStack: ItemStack = new ItemStack(REGEX_FLUID.exec(fluid)[2]);
    inventory.setItem(player.selectedSlotIndex, itemStack);
    let checkBlockAbove: Block = componentData.source.dimension
        .getBlock(blockLocation)
        .above();
    let checkBlockBelow: Block = componentData.source.dimension
        .getBlock(blockLocation)
        .below();
    let checkBlockNorth: Block = componentData.source.dimension
        .getBlock(blockLocation)
        .north();
    let checkBlockEast: Block = componentData.source.dimension
        .getBlock(blockLocation)
        .east();
    let checkBlockSouth: Block = componentData.source.dimension
        .getBlock(blockLocation)
        .south();
    let checkBlockWest: Block = componentData.source.dimension
        .getBlock(blockLocation)
        .west();

    if (checkBlockAbove.typeId == 'minecraft:air') {
        updateLiquidBlock(componentData.source.dimension, {
            x: blockLocation.x,
            y: blockLocation.y + 1,
            z: blockLocation.z
        });
    }
    if (checkBlockBelow.typeId == 'minecraft:air') {
        updateLiquidBlock(componentData.source.dimension, {
            x: blockLocation.x,
            y: blockLocation.y - 1,
            z: blockLocation.z
        });
    }
    if (checkBlockNorth.typeId == 'minecraft:air') {
        updateLiquidBlock(componentData.source.dimension, {
            x: blockLocation.x,
            y: blockLocation.y,
            z: blockLocation.z - 1
        });
    }
    if (checkBlockSouth.typeId == 'minecraft:air') {
        updateLiquidBlock(componentData.source.dimension, {
            x: blockLocation.x,
            y: blockLocation.y,
            z: blockLocation.z + 1
        });
    }
    if (checkBlockWest.typeId == 'minecraft:air') {
        updateLiquidBlock(componentData.source.dimension, {
            x: blockLocation.x - 1,
            y: blockLocation.y,
            z: blockLocation.z
        });
    }
    if (checkBlockEast.typeId == 'minecraft:air') {
        updateLiquidBlock(componentData.source.dimension, {
            x: blockLocation.x + 1,
            y: blockLocation.y,
            z: blockLocation.z
        });
    }
}

/**
 * @brief This is needed because faceLocation returns a relative position, not world position.
 * @param direction North, South, East, West, Up, Down
 * @returns Vector3
 */
function directionToVector3(direction: Direction): Vector3 {
    switch (direction) {
        case Direction.Down:
            return { x: 0, y: -1, z: 0 };
        case Direction.Up:
            return { x: 0, y: 1, z: 0 };
        case Direction.North:
            return { x: 0, y: 0, z: -1 };
        case Direction.South:
            return { x: 0, y: 0, z: 1 };
        case Direction.West:
            return { x: -1, y: 0, z: 0 };
        case Direction.East:
            return { x: 1, y: 0, z: 0 };
    }
}

/**
 * @brief Updates the liquid block since placing a liquid by itself won't make it flow.
 * @param dimension The dimension to execute in
 * @param location The world location
 */
function updateLiquidBlock(dimension: Dimension, location: Vector3) {
    dimension.setBlockType(location, 'minecraft:bedrock');
    dimension.setBlockType(location, 'minecraft:air');
}
