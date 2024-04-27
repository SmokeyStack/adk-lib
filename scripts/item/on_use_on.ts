import {
    Dimension,
    Direction,
    ItemComponentUseOnEvent,
    ItemCustomComponent,
    ItemStack,
    Player,
    Vector3,
    world
} from '@minecraft/server';

import { BLOCK_MAP } from './fertilzeable';

class onUseOn implements ItemCustomComponent {
    constructor() {
        this.onUseOn = this.onUseOn.bind(this);
    }
    onUseOn(_componentData: ItemComponentUseOnEvent) {}
}

export class debug extends onUseOn {
    onUseOn(componentData: ItemComponentUseOnEvent) {
        world.sendMessage(`Source: ${componentData.source.typeId}`);
        world.sendMessage(
            `Used On Block Permutation: ${componentData.usedOnBlockPermutation.type.id}`
        );
        world.sendMessage(
            `Block: ${componentData.block.typeId} at (${componentData.block.location.x}, ${componentData.block.location.y}, ${componentData.block.location.z})`
        );
        world.sendMessage(`Block Face: ${componentData.blockFace}`);
        world.sendMessage(
            `Face Location: (${componentData.faceLocation.x}, ${componentData.faceLocation.y}, ${componentData.faceLocation.z})`
        );
        world.sendMessage(`Item: ${componentData.itemStack.typeId}`);
    }
}

export class useOnFertilizable extends onUseOn {
    onUseOn(componentData: ItemComponentUseOnEvent) {
        if (
            BLOCK_MAP.get(componentData.block.typeId)?.canGrow(
                componentData.block.dimension,
                componentData.block.location,
                componentData.usedOnBlockPermutation
            ) &&
            BLOCK_MAP.get(componentData.block.typeId)?.isFertilizable(
                componentData.block.dimension,
                componentData.block.location,
                componentData.usedOnBlockPermutation
            )
        ) {
            BLOCK_MAP.get(componentData.block.typeId)?.grow(
                componentData.block.dimension,
                componentData.block.location,
                componentData.usedOnBlockPermutation
            );
            let player: Player = componentData.source as Player;
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
    }
}

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

function setLiquidBlock(type: string, dimension: Dimension, location: Vector3) {
    dimension.setBlockType(location, type);
}

export class useOnBucket extends onUseOn {
    onUseOn(componentData: ItemComponentUseOnEvent) {
        let block_location: Vector3 = componentData.block.offset(
            directionToVector3(componentData.blockFace)
        );

        componentData.source.dimension.setBlockType(
            block_location,
            'minecraft:water'
        );

        if (
            componentData.source.dimension.getBlock(block_location).above()
                .typeId == 'minecraft:air'
        ) {
            setLiquidBlock('minecraft:water', componentData.source.dimension, {
                x: block_location.x,
                y: block_location.y + 1,
                z: block_location.z
            });
            setLiquidBlock('minecraft:air', componentData.source.dimension, {
                x: block_location.x,
                y: block_location.y + 1,
                z: block_location.z
            });
        }

        if (
            componentData.source.dimension.getBlock(block_location).below()
                .typeId == 'minecraft:air'
        ) {
            setLiquidBlock('minecraft:water', componentData.source.dimension, {
                x: block_location.x,
                y: block_location.y - 1,
                z: block_location.z
            });
            setLiquidBlock('minecraft:air', componentData.source.dimension, {
                x: block_location.x,
                y: block_location.y - 1,
                z: block_location.z
            });
        }

        if (
            componentData.source.dimension.getBlock(block_location).north()
                .typeId == 'minecraft:air'
        ) {
            setLiquidBlock('minecraft:water', componentData.source.dimension, {
                x: block_location.x,
                y: block_location.y,
                z: block_location.z - 1
            });
            setLiquidBlock('minecraft:air', componentData.source.dimension, {
                x: block_location.x,
                y: block_location.y,
                z: block_location.z - 1
            });
        }

        if (
            componentData.source.dimension.getBlock(block_location).south()
                .typeId == 'minecraft:air'
        ) {
            setLiquidBlock('minecraft:water', componentData.source.dimension, {
                x: block_location.x,
                y: block_location.y,
                z: block_location.z + 1
            });
            setLiquidBlock('minecraft:air', componentData.source.dimension, {
                x: block_location.x,
                y: block_location.y,
                z: block_location.z + 1
            });
        }

        if (
            componentData.source.dimension.getBlock(block_location).west()
                .typeId == 'minecraft:air'
        ) {
            setLiquidBlock('minecraft:water', componentData.source.dimension, {
                x: block_location.x - 1,
                y: block_location.y,
                z: block_location.z
            });
            setLiquidBlock('minecraft:air', componentData.source.dimension, {
                x: block_location.x - 1,
                y: block_location.y,
                z: block_location.z
            });
        }

        if (
            componentData.source.dimension.getBlock(block_location).east()
                .typeId == 'minecraft:air'
        ) {
            setLiquidBlock('minecraft:water', componentData.source.dimension, {
                x: block_location.x + 1,
                y: block_location.y,
                z: block_location.z
            });
            setLiquidBlock('minecraft:air', componentData.source.dimension, {
                x: block_location.x + 1,
                y: block_location.y,
                z: block_location.z
            });
        }
    }
}
