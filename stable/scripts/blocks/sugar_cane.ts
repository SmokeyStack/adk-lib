import {
    Block,
    BlockComponentPlayerPlaceBeforeEvent,
    BlockPermutation
} from '@minecraft/server';
import { DirectionHelper, DirectionType } from 'adk-scripts-server';

export function beforeOnPlayerPlaceSugarCane(
    data: BlockComponentPlayerPlaceBeforeEvent
): void {
    const block: Block = data.block;
    const blockToPlace: BlockPermutation = data.permutationToPlace;
    const blockToCheck: Block = block.below();

    if (blockToCheck.typeId === blockToPlace.type.id) return;
    if (
        blockToCheck.getTags().includes('dirt') ||
        blockToCheck.getTags().includes('sand')
    ) {
        for (const direction of DirectionType.Horizontal) {
            let block2: Block = blockToCheck.offset(
                DirectionHelper.toVector3(direction)
            );

            if (
                !block2.getTags().includes('water') &&
                block2.typeId != 'minecraft:frosted_ice'
            )
                continue;

            return;
        }
    }

    data.cancel = true;
}
