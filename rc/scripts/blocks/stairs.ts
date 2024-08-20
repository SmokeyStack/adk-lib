import {
    Block,
    BlockComponentPlayerPlaceBeforeEvent,
    BlockPermutation,
    Direction
} from '@minecraft/server';
import { DirectionType } from 'utils/helper';
import { directionToVector3 } from 'utils/math';

export function beforeOnPlayerPlaceStairs(
    data: BlockComponentPlayerPlaceBeforeEvent
): void {
    let permutationToPlace: BlockPermutation = data.permutationToPlace;
    let cardinalDirection: string = permutationToPlace.getState(
        'minecraft:cardinal_direction'
    ) as string;
    let verticalHalf: string = permutationToPlace.getState(
        'minecraft:vertical_half'
    ) as string;
    const namespace: string = permutationToPlace.type.id.split(':')[0];
    let blockToCheck: Block;

    switch (cardinalDirection) {
        case 'north':
            {
                for (const direction of DirectionType.HORIZONTAL) {
                    blockToCheck = data.block.offset(
                        directionToVector3(direction)
                    );

                    if (blockToCheck.typeId !== permutationToPlace.type.id)
                        continue;

                    const blockToCheckVerticalHalf =
                        blockToCheck.permutation.getState(
                            'minecraft:vertical_half'
                        );

                    if (blockToCheckVerticalHalf !== verticalHalf) continue;

                    const blockToCheckDirection =
                        blockToCheck.permutation.getState(
                            'minecraft:cardinal_direction'
                        );

                    switch (direction) {
                        case Direction.North:
                            {
                                if (blockToCheckDirection === 'west') {
                                    permutationToPlace =
                                        permutationToPlace.withState(
                                            namespace + ':shape',
                                            'outer_left'
                                        );
                                }
                                if (blockToCheckDirection === 'east') {
                                    permutationToPlace =
                                        permutationToPlace.withState(
                                            namespace + ':shape',
                                            'outer_right'
                                        );
                                }
                            }
                            break;
                        case Direction.South:
                            {
                                if (blockToCheckDirection === 'east') {
                                    permutationToPlace =
                                        permutationToPlace.withState(
                                            namespace + ':shape',
                                            'inner_left'
                                        );
                                }
                                if (blockToCheckDirection === 'west') {
                                    permutationToPlace =
                                        permutationToPlace.withState(
                                            namespace + ':shape',
                                            'inner_right'
                                        );
                                }
                            }
                            break;
                        case Direction.East:
                            {
                                if (blockToCheckDirection === 'east') {
                                    blockToCheck.setPermutation(
                                        blockToCheck.permutation.withState(
                                            namespace + ':shape',
                                            'inner_right'
                                        )
                                    );
                                }
                                if (blockToCheckDirection === 'west') {
                                    blockToCheck.setPermutation(
                                        blockToCheck.permutation.withState(
                                            namespace + ':shape',
                                            'outer_right'
                                        )
                                    );
                                }
                            }
                            break;
                        case Direction.West:
                            {
                                if (blockToCheckDirection === 'west') {
                                    blockToCheck.setPermutation(
                                        blockToCheck.permutation.withState(
                                            namespace + ':shape',
                                            'inner_left'
                                        )
                                    );
                                }
                                if (blockToCheckDirection === 'east') {
                                    blockToCheck.setPermutation(
                                        blockToCheck.permutation.withState(
                                            namespace + ':shape',
                                            'outer_left'
                                        )
                                    );
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
            break;
        case 'south':
            {
                for (const direction of DirectionType.HORIZONTAL) {
                    blockToCheck = data.block.offset(
                        directionToVector3(direction)
                    );

                    if (blockToCheck.typeId !== permutationToPlace.type.id)
                        continue;

                    const blockToCheckHalf = blockToCheck.permutation.getState(
                        'minecraft:vertical_half'
                    );

                    if (blockToCheckHalf !== verticalHalf) continue;

                    const blockToCheckDirection =
                        blockToCheck.permutation.getState(
                            'minecraft:cardinal_direction'
                        );

                    switch (direction) {
                        case Direction.North:
                            {
                                if (blockToCheckDirection === 'west') {
                                    permutationToPlace =
                                        permutationToPlace.withState(
                                            namespace + ':shape',
                                            'inner_left'
                                        );
                                }
                                if (blockToCheckDirection === 'east') {
                                    permutationToPlace =
                                        permutationToPlace.withState(
                                            namespace + ':shape',
                                            'inner_right'
                                        );
                                }
                            }
                            break;
                        case Direction.South:
                            {
                                if (blockToCheckDirection === 'east') {
                                    permutationToPlace =
                                        permutationToPlace.withState(
                                            namespace + ':shape',
                                            'outer_left'
                                        );
                                }
                                if (blockToCheckDirection === 'west') {
                                    permutationToPlace =
                                        permutationToPlace.withState(
                                            namespace + ':shape',
                                            'outer_right'
                                        );
                                }
                            }
                            break;
                        case Direction.East:
                            {
                                if (blockToCheckDirection === 'east') {
                                    blockToCheck.setPermutation(
                                        blockToCheck.permutation.withState(
                                            namespace + ':shape',
                                            'inner_left'
                                        )
                                    );
                                }
                                if (blockToCheckDirection === 'west') {
                                    blockToCheck.setPermutation(
                                        blockToCheck.permutation.withState(
                                            namespace + ':shape',
                                            'outer_left'
                                        )
                                    );
                                }
                            }
                            break;
                        case Direction.West:
                            {
                                if (blockToCheckDirection === 'west') {
                                    blockToCheck.setPermutation(
                                        blockToCheck.permutation.withState(
                                            namespace + ':shape',
                                            'inner_right'
                                        )
                                    );
                                }
                                if (blockToCheckDirection === 'east') {
                                    blockToCheck.setPermutation(
                                        blockToCheck.permutation.withState(
                                            namespace + ':shape',
                                            'outer_right'
                                        )
                                    );
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
            break;
        case 'east':
            {
                for (const direction of DirectionType.HORIZONTAL) {
                    blockToCheck = data.block.offset(
                        directionToVector3(direction)
                    );

                    if (blockToCheck.typeId !== permutationToPlace.type.id)
                        continue;

                    const blockToCheckHalf = blockToCheck.permutation.getState(
                        'minecraft:vertical_half'
                    );

                    if (blockToCheckHalf !== verticalHalf) continue;

                    const blockToCheckDirection =
                        blockToCheck.permutation.getState(
                            'minecraft:cardinal_direction'
                        );

                    switch (direction) {
                        case Direction.East:
                            {
                                if (blockToCheckDirection === 'north') {
                                    permutationToPlace =
                                        permutationToPlace.withState(
                                            namespace + ':shape',
                                            'outer_left'
                                        );
                                }
                                if (blockToCheckDirection === 'south') {
                                    permutationToPlace =
                                        permutationToPlace.withState(
                                            namespace + ':shape',
                                            'outer_right'
                                        );
                                }
                            }
                            break;
                        case Direction.West:
                            {
                                if (blockToCheckDirection === 'south') {
                                    permutationToPlace =
                                        permutationToPlace.withState(
                                            namespace + ':shape',
                                            'inner_left'
                                        );
                                }
                                if (blockToCheckDirection === 'north') {
                                    permutationToPlace =
                                        permutationToPlace.withState(
                                            namespace + ':shape',
                                            'inner_right'
                                        );
                                }
                            }
                            break;
                        case Direction.North:
                            {
                                if (blockToCheckDirection === 'north') {
                                    blockToCheck.setPermutation(
                                        blockToCheck.permutation.withState(
                                            namespace + ':shape',
                                            'inner_left'
                                        )
                                    );
                                }
                                if (blockToCheckDirection === 'south') {
                                    blockToCheck.setPermutation(
                                        blockToCheck.permutation.withState(
                                            namespace + ':shape',
                                            'outer_left'
                                        )
                                    );
                                }
                            }
                            break;
                        case Direction.South:
                            {
                                if (blockToCheckDirection === 'north') {
                                    blockToCheck.setPermutation(
                                        blockToCheck.permutation.withState(
                                            namespace + ':shape',
                                            'outer_right'
                                        )
                                    );
                                }
                                if (blockToCheckDirection === 'south') {
                                    blockToCheck.setPermutation(
                                        blockToCheck.permutation.withState(
                                            namespace + ':shape',
                                            'inner_right'
                                        )
                                    );
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
            break;
        case 'west':
            {
                for (const direction of DirectionType.HORIZONTAL) {
                    blockToCheck = data.block.offset(
                        directionToVector3(direction)
                    );

                    if (blockToCheck.typeId !== permutationToPlace.type.id)
                        continue;

                    const blockToCheckHalf = blockToCheck.permutation.getState(
                        'minecraft:vertical_half'
                    );

                    if (blockToCheckHalf !== verticalHalf) continue;

                    const blockToCheckDirection =
                        blockToCheck.permutation.getState(
                            'minecraft:cardinal_direction'
                        );

                    switch (direction) {
                        case Direction.East:
                            {
                                if (blockToCheckDirection === 'north') {
                                    permutationToPlace =
                                        permutationToPlace.withState(
                                            namespace + ':shape',
                                            'inner_left'
                                        );
                                }
                                if (blockToCheckDirection === 'south') {
                                    permutationToPlace =
                                        permutationToPlace.withState(
                                            namespace + ':shape',
                                            'inner_right'
                                        );
                                }
                            }
                            break;
                        case Direction.West:
                            {
                                if (blockToCheckDirection === 'south') {
                                    permutationToPlace =
                                        permutationToPlace.withState(
                                            namespace + ':shape',
                                            'outer_left'
                                        );
                                }
                                if (blockToCheckDirection === 'north') {
                                    permutationToPlace =
                                        permutationToPlace.withState(
                                            namespace + ':shape',
                                            'outer_right'
                                        );
                                }
                            }
                            break;
                        case Direction.North:
                            {
                                if (blockToCheckDirection === 'north') {
                                    blockToCheck.setPermutation(
                                        blockToCheck.permutation.withState(
                                            namespace + ':shape',
                                            'inner_right'
                                        )
                                    );
                                }
                                if (blockToCheckDirection === 'south') {
                                    blockToCheck.setPermutation(
                                        blockToCheck.permutation.withState(
                                            namespace + ':shape',
                                            'outer_right'
                                        )
                                    );
                                }
                            }
                            break;
                        case Direction.South:
                            {
                                if (blockToCheckDirection === 'north') {
                                    blockToCheck.setPermutation(
                                        blockToCheck.permutation.withState(
                                            namespace + ':shape',
                                            'outer_left'
                                        )
                                    );
                                }
                                if (blockToCheckDirection === 'south') {
                                    blockToCheck.setPermutation(
                                        blockToCheck.permutation.withState(
                                            namespace + ':shape',
                                            'inner_left'
                                        )
                                    );
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
            break;
        default:
            break;
    }

    data.permutationToPlace = permutationToPlace;
}
