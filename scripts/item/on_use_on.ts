import {
    Block,
    BlockPermutation,
    ItemComponentUseOnEvent,
    ItemCustomComponent,
    Player,
    Vector3,
    world
} from '@minecraft/server';

import { BLOCK_MAP } from './fertilzeable';
import { onUseOnBucket } from './item_bucket';
import { onUseOnDye } from './item_dye';
import { decrementStack } from '../utils/decrement_stack';
import { directionToVector3 } from 'utils/math';

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
            decrementStack(player);
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

export class fireCharge extends onUseOn {
    onUseOn(componentData: ItemComponentUseOnEvent): void {
        let block: Block = componentData.block;
        let blockPermutation: BlockPermutation =
            componentData.usedOnBlockPermutation;

        if (block.typeId.endsWith('campfire')) {
            block.setPermutation(
                blockPermutation.withState('extinguished', false)
            );
        } else if (block.typeId.endsWith('candle')) {
            block.setPermutation(blockPermutation.withState('lit', true));
        } else {
            let location: Vector3 = directionToVector3(componentData.blockFace);
            let blockOffset: Block = block.offset(location);
            let blockBelow: Block = blockOffset.below();

            if (!blockBelow.isSolid || !blockOffset.isAir) return;

            blockOffset.setType('minecraft:fire');
        }

        decrementStack(componentData.source as Player);
    }
}
