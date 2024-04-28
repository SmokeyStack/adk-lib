import {
    Block,
    Direction,
    ItemComponentUseOnEvent,
    ItemStack,
    Player,
    Vector3
} from '@minecraft/server';

export function onUseOnBucket(componentData: ItemComponentUseOnEvent) {
    let tags: string[] = componentData.itemStack.getTags();
    const REGEX_FLUID: RegExp = new RegExp('adk-lib:fluid_[a-z]\\w+');
    const REGEX_TURN_INTO: RegExp = new RegExp(
        'adk-lib:fluid_([a-z]\\w+:[a-z]\\w+)_turn_into_([a-z]\\w+:[a-z]\\w+)'
    );
    let player: Player = componentData.source as Player;
    let fluid: string;
    let sourceIntoItem: Map<string, string> = new Map();

    for (let tag of tags) {
        if (REGEX_FLUID.test(tag)) {
            fluid = tag;
            break;
        }
    }

    for (let tag of tags) {
        const match = REGEX_TURN_INTO.exec(tag);
        if (match) {
            sourceIntoItem.set(match[1], match[2]);
        }
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
            player
                .getComponent('inventory')
                .container.setItem(player.selectedSlotIndex, itemStack);

            break;
        }

        return;
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
