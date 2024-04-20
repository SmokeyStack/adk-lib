import {
    BlockPermutation,
    BlockStates,
    Dimension,
    ItemComponentUseOnEvent,
    ItemCustomComponent,
    ItemStack,
    Player,
    Vector3,
    world
} from '@minecraft/server';

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

class useOnFertilizable extends onUseOn {
    onUseOn(componentData: ItemComponentUseOnEvent) {
        if (
            blockMap
                .get(componentData.block.typeId)
                ?.canGrow(
                    componentData.block.dimension,
                    componentData.block.location,
                    componentData.usedOnBlockPermutation
                ) &&
            blockMap
                .get(componentData.block.typeId)
                ?.isFertilizable(
                    componentData.block.dimension,
                    componentData.block.location,
                    componentData.usedOnBlockPermutation
                )
        ) {
            world.sendMessage('Can grow');
            blockMap
                .get(componentData.block.typeId)
                ?.grow(
                    componentData.block.dimension,
                    componentData.block.location,
                    componentData.usedOnBlockPermutation
                );
            let player: Player = componentData.source as Player;
            let item = player
                .getComponent('inventory')
                .container.getItem(player.selectedSlot);

            if (item.amount == 1)
                player
                    .getComponent('inventory')
                    .container.setItem(
                        player.selectedSlot,
                        new ItemStack('minecraft:air')
                    );
            else
                player
                    .getComponent('inventory')
                    .container.setItem(
                        player.selectedSlot,
                        new ItemStack(item.typeId, item.amount - 1)
                    );
        }
    }
}

interface Fertilizable {
    isFertilizable(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean;
    canGrow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean;
    grow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): void;
}

class cropBlock implements Fertilizable {
    constructor() {}
    isFertilizable(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        let a: number = BlockStates.get('growth').validValues[
            BlockStates.get('growth').validValues.length - 1
        ] as number;

        let b: number = block_permutation.getState('growth') as number;

        return a != b;
    }
    canGrow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): void {
        let a: number = BlockStates.get('growth').validValues[
            BlockStates.get('growth').validValues.length - 1
        ] as number;
        let b: number =
            (block_permutation.getState('growth') as number) +
            (Math.random() * 4 + 2);
        if (b > a) {
            b = a;
        }
        dimension.setBlockPermutation(
            block_position,
            BlockPermutation.resolve('minecraft:wheat', { growth: b })
        );
        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: block_position.x + 0.5,
            y: block_position.y + 0.5,
            z: block_position.z + 0.5
        });
    }
}

const blockMap = new Map<string, Fertilizable>();

const wheat = new cropBlock();

blockMap.set('minecraft:wheat', wheat);
