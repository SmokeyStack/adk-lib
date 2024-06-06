import {
    BlockComponentPlayerPlaceBeforeEvent,
    Block,
    Player,
    ItemStack,
    EquipmentSlot,
    Direction,
    BlockPermutation
} from '@minecraft/server';
import { decrementStack, getOppositeDirection } from 'utils/helper';
import { directionToVector3 } from 'utils/math';

export function beforeOnPlayerPlaceDoubleSlab(
    data: BlockComponentPlayerPlaceBeforeEvent
): void {
    let block: Block = data.block;
    let player: Player = data.player;
    let playerEquipment: ItemStack = player
        .getComponent('equippable')
        .getEquipment(EquipmentSlot.Mainhand);

    if (playerEquipment === undefined) return;

    let face: Direction = getOppositeDirection(data.face);
    let blockToCheck: Block = block.offset(directionToVector3(face));
    const namespace: string = blockToCheck.typeId.split(':')[0];
    const blockStateDouble: string = namespace + ':is_double';
    const blockStateHalf: string = 'minecraft:vertical_half';

    if (blockToCheck.permutation.getState(blockStateDouble)) return;
    if (blockToCheck.typeId !== playerEquipment.typeId) return;
    if (face === 'Up' || face === 'Down') {
        const state = blockToCheck.permutation.getState(blockStateHalf);
        if (
            (face === 'Up' && state === 'top') ||
            (face === 'Down' && state === 'bottom')
        ) {
            blockToCheck.setPermutation(
                BlockPermutation.resolve(blockToCheck.typeId, {
                    [blockStateDouble]: true
                })
            );
            data.cancel = true;
            decrementStack(player);
        }
    }
}
