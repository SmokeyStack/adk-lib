import {
    BlockComponentPlayerPlaceBeforeEvent,
    BlockPermutation
} from '@minecraft/server';

export function beforeOnPlayerPlaceTurnInto(
    data: BlockComponentPlayerPlaceBeforeEvent
): void {
    let blockPermutation: BlockPermutation = data.permutationToPlace;
    const tags: string[] = blockPermutation.getTags();
    const REGEX: RegExp = new RegExp(
        'adk-lib:before_on_player_place_turn_into_([a-z]\\w+:[a-z]\\w+)'
    );

    for (let tag of tags)
        if (REGEX.exec(tag)) {
            data.permutationToPlace = BlockPermutation.resolve(
                REGEX.exec(tag)[1]
            );
            return;
        }
}
