import {
    BlockPermutation,
    BlockSignComponent,
    DyeColor,
    ItemComponentUseOnEvent,
    ItemCustomComponent,
    ItemStack,
    Player,
    SignSide,
    Vector3,
    world
} from '@minecraft/server';

import { BLOCK_MAP } from './fertilzeable';
import { onUseOnBucket } from './item_bucket';
import { areVectorsEqual } from '../utils/vector';

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
        const REGEX: RegExp = new RegExp(
            'minecraft:(?:[a-z]\\w+_)?(?:standing|wall|hanging)_sign'
        );

        if (!REGEX.test(componentData.block.typeId)) return;

        let signComponent: BlockSignComponent =
            componentData.block.getComponent('sign');
        let blockPermutation: BlockPermutation =
            componentData.usedOnBlockPermutation;
        let playerLocation: Vector3 = componentData.source.location;
        let blockLocation: Vector3 = componentData.block.location;

        if (componentData.block.typeId.endsWith('wall_sign')) {
            let flooredX: number, flooredZ: number;

            if (playerLocation.x > 0) flooredX = Math.floor(playerLocation.x);
            else flooredX = signedFloor(playerLocation.x);
            if (playerLocation.z > 0) flooredZ = Math.floor(playerLocation.z);
            else flooredZ = signedFloor(playerLocation.z);
            switch (blockPermutation.getState('facing_direction')) {
                case 2:
                    {
                        if (playerLocation.z < blockLocation.z)
                            flooredZ = blockLocation.z;
                        dyeSign(
                            signComponent,
                            {
                                x: blockLocation.x,
                                y: blockLocation.y,
                                z: flooredZ
                            },
                            blockLocation,
                            DyeColor.Blue
                        );
                    }
                    break;
                case 3:
                    {
                        if (playerLocation.z > blockLocation.z)
                            flooredZ = blockLocation.z;
                        dyeSign(
                            signComponent,
                            {
                                x: blockLocation.x,
                                y: blockLocation.y,
                                z: flooredZ
                            },
                            blockLocation,
                            DyeColor.Blue
                        );
                    }
                    break;
                case 4:
                    {
                        if (playerLocation.x < blockLocation.x)
                            flooredX = blockLocation.x;
                        dyeSign(
                            signComponent,
                            {
                                x: flooredX,
                                y: blockLocation.y,
                                z: blockLocation.z
                            },
                            blockLocation,
                            DyeColor.Blue
                        );
                    }
                    break;
                case 5:
                    {
                        if (playerLocation.x > blockLocation.x)
                            flooredX = blockLocation.x;
                        dyeSign(
                            signComponent,
                            {
                                x: flooredX,
                                y: blockLocation.y,
                                z: blockLocation.z
                            },
                            blockLocation,
                            DyeColor.Blue
                        );
                    }
                    break;
                default:
                    break;
            }
        }
    }
}

function dyeSign(
    signComponent: BlockSignComponent,
    playerLocation: Vector3,
    blockLocation: Vector3,
    color: DyeColor
): void {
    if (areVectorsEqual(playerLocation, blockLocation))
        signComponent.setTextDyeColor(color, SignSide.Front);
    else signComponent.setTextDyeColor(color, SignSide.Back);
}

function signedFloor(value: number): number {
    return Math.sign(value) * Math.ceil(Math.abs(value));
}
