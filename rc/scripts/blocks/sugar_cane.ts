import {
    Block,
    BlockComponentPlayerPlaceBeforeEvent,
    BlockPermutation
} from '@minecraft/server';
import * as adk from 'adk-scripts-server';

export function beforeOnPlayerPlaceSugarCane(
    data: BlockComponentPlayerPlaceBeforeEvent
): void {
    const block: Block = data.block;
    const block_to_place: BlockPermutation = data.permutationToPlace;
    const block_to_check: Block | undefined = block.below();

    if (!block_to_check || block_to_check.typeId === block_to_place.type.id)
        return;
    if (
        block_to_check.getTags().includes('dirt') ||
        block_to_check.getTags().includes('sand')
    ) {
        adk.DirectionType.Horizontal.forEach((direction) => {
            const block_2: Block | undefined = block_to_check.offset(
                adk.DirectionHelper.toVector3(direction)
            );

            if (
                !block_2 ||
                block_2.getTags().includes('water') ||
                block_2.typeId == 'minecraft:frosted_ice'
            )
                return;
        });
    }

    data.cancel = true;
}
