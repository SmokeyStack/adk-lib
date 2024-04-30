import {
    ItemComponentUseOnEvent,
    BlockSignComponent,
    Player,
    Block,
    BlockPermutation
} from '@minecraft/server';
import { decrementStack } from '../utils/decrement_stack';

export function onUseOnWax(componentData: ItemComponentUseOnEvent) {
    const REGEX: RegExp = new RegExp(
        'minecraft:(?:[a-z]\\w+_)?(?:standing|wall|hanging)_sign'
    );
    let signComponent: BlockSignComponent =
        componentData.block.getComponent('sign');
    let player: Player = componentData.source as Player;
    let block: Block = componentData.block;

    if (REGEX.test(block.typeId)) {
        signComponent.setWaxed(true);
        decrementStack(player);

        return;
    }
    if (block.typeId.includes('copper') && !block.typeId.includes('waxed')) {
        decrementStack(player);
        let newBlock: string = 'minecraft:waxed_' + block.typeId.substring(10);

        if (block.typeId.includes('door')) {
            if (!block.permutation.getState('upper_block_bit'))
                player.runCommand(
                    `setblock ${block.location.x} ${block.location.y} ${
                        block.location.z
                    } ${newBlock}["direction"=${block.permutation.getState(
                        'direction'
                    )}, "door_hinge_bit"=${block.permutation.getState(
                        'door_hinge_bit'
                    )}, "open_bit"=${block.permutation.getState('open_bit')}]`
                );
            else
                player.runCommand(
                    `setblock ${block.location.x} ${block.location.y - 1} ${
                        block.location.z
                    } ${newBlock}["direction"=${block
                        .below()
                        .permutation.getState(
                            'direction'
                        )}, "door_hinge_bit"=${block
                        .below()
                        .permutation.getState(
                            'door_hinge_bit'
                        )}, "open_bit"=${block
                        .below()
                        .permutation.getState('open_bit')}]`
                );

            return;
        }

        block.setPermutation(
            BlockPermutation.resolve(newBlock, block.permutation.getAllStates())
        );

        return;
    }
}
