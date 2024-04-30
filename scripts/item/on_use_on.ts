import {
    ItemComponentUseOnEvent,
    ItemCustomComponent,
    ItemStack,
    Player,
    world
} from '@minecraft/server';

import { BLOCK_MAP } from './fertilzeable';
import { onUseOnBucket } from './item_bucket';
import { onUseOnDye } from './item_dye';

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
export class bucket extends onUseOn {
    onUseOn(componentData: ItemComponentUseOnEvent) {
        onUseOnBucket(componentData);
    }
}

export class dye extends onUseOn {
    onUseOn(componentData: ItemComponentUseOnEvent): void {
        onUseOnDye(componentData);
    }
}
