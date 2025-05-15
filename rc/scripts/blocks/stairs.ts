import {
    Block,
    BlockComponentPlayerPlaceBeforeEvent,
    BlockPermutation,
    Direction
} from '@minecraft/server';
import type * as minecraftvanilladata from '@minecraft/vanilla-data';
import * as adk from 'adk-scripts-server';

export function beforeOnPlayerPlaceStairs(
    data: BlockComponentPlayerPlaceBeforeEvent
): void {
    let permutation_to_place: BlockPermutation = data.permutationToPlace;
    let cardinal_direction: string = permutation_to_place.getState(
        'minecraft:cardinal_direction'
    ) as string;
    let vertical_half: string = permutation_to_place.getState(
        'minecraft:vertical_half'
    ) as string;
    const namespace: string = permutation_to_place.type.id.split(':')[0];
    let block_to_check: Block | undefined;

    switch (cardinal_direction) {
        case 'north':
            {
                for (const direction of adk.DirectionType.Horizontal) {
                    block_to_check = data.block.offset(
                        adk.DirectionHelper.toVector3(direction)
                    );

                    if (
                        !block_to_check ||
                        block_to_check.typeId !== permutation_to_place.type.id
                    )
                        continue;

                    const blockToCheckVerticalHalf =
                        block_to_check.permutation.getState(
                            'minecraft:vertical_half'
                        );

                    if (blockToCheckVerticalHalf !== vertical_half) continue;

                    const blockToCheckDirection =
                        block_to_check.permutation.getState(
                            'minecraft:cardinal_direction'
                        );

                    switch (direction) {
                        case Direction.North:
                            {
                                if (blockToCheckDirection === 'west') {
                                    permutation_to_place =
                                        permutation_to_place.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
                                            'outer_left'
                                        );
                                }
                                if (blockToCheckDirection === 'east') {
                                    permutation_to_place =
                                        permutation_to_place.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
                                            'outer_right'
                                        );
                                }
                            }
                            break;
                        case Direction.South:
                            {
                                if (blockToCheckDirection === 'east') {
                                    permutation_to_place =
                                        permutation_to_place.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
                                            'inner_left'
                                        );
                                }
                                if (blockToCheckDirection === 'west') {
                                    permutation_to_place =
                                        permutation_to_place.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
                                            'inner_right'
                                        );
                                }
                            }
                            break;
                        case Direction.East:
                            {
                                if (blockToCheckDirection === 'east') {
                                    block_to_check.setPermutation(
                                        block_to_check.permutation.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
                                            'inner_right'
                                        )
                                    );
                                }
                                if (blockToCheckDirection === 'west') {
                                    block_to_check.setPermutation(
                                        block_to_check.permutation.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
                                            'outer_right'
                                        )
                                    );
                                }
                            }
                            break;
                        case Direction.West:
                            {
                                if (blockToCheckDirection === 'west') {
                                    block_to_check.setPermutation(
                                        block_to_check.permutation.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
                                            'inner_left'
                                        )
                                    );
                                }
                                if (blockToCheckDirection === 'east') {
                                    block_to_check.setPermutation(
                                        block_to_check.permutation.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
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
                for (const direction of adk.DirectionType.Horizontal) {
                    block_to_check = data.block.offset(
                        adk.DirectionHelper.toVector3(direction)
                    );

                    if (
                        !block_to_check ||
                        block_to_check.typeId !== permutation_to_place.type.id
                    )
                        continue;

                    const blockToCheckHalf =
                        block_to_check.permutation.getState(
                            'minecraft:vertical_half'
                        );

                    if (blockToCheckHalf !== vertical_half) continue;

                    const blockToCheckDirection =
                        block_to_check.permutation.getState(
                            'minecraft:cardinal_direction'
                        );

                    switch (direction) {
                        case Direction.North:
                            {
                                if (blockToCheckDirection === 'west') {
                                    permutation_to_place =
                                        permutation_to_place.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
                                            'inner_left'
                                        );
                                }
                                if (blockToCheckDirection === 'east') {
                                    permutation_to_place =
                                        permutation_to_place.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
                                            'inner_right'
                                        );
                                }
                            }
                            break;
                        case Direction.South:
                            {
                                if (blockToCheckDirection === 'east') {
                                    permutation_to_place =
                                        permutation_to_place.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
                                            'outer_left'
                                        );
                                }
                                if (blockToCheckDirection === 'west') {
                                    permutation_to_place =
                                        permutation_to_place.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
                                            'outer_right'
                                        );
                                }
                            }
                            break;
                        case Direction.East:
                            {
                                if (blockToCheckDirection === 'east') {
                                    block_to_check.setPermutation(
                                        block_to_check.permutation.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
                                            'inner_left'
                                        )
                                    );
                                }
                                if (blockToCheckDirection === 'west') {
                                    block_to_check.setPermutation(
                                        block_to_check.permutation.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
                                            'outer_left'
                                        )
                                    );
                                }
                            }
                            break;
                        case Direction.West:
                            {
                                if (blockToCheckDirection === 'west') {
                                    block_to_check.setPermutation(
                                        block_to_check.permutation.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
                                            'inner_right'
                                        )
                                    );
                                }
                                if (blockToCheckDirection === 'east') {
                                    block_to_check.setPermutation(
                                        block_to_check.permutation.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
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
                for (const direction of adk.DirectionType.Horizontal) {
                    block_to_check = data.block.offset(
                        adk.DirectionHelper.toVector3(direction)
                    );

                    if (
                        !block_to_check ||
                        block_to_check.typeId !== permutation_to_place.type.id
                    )
                        continue;

                    const blockToCheckHalf =
                        block_to_check.permutation.getState(
                            'minecraft:vertical_half'
                        );

                    if (blockToCheckHalf !== vertical_half) continue;

                    const blockToCheckDirection =
                        block_to_check.permutation.getState(
                            'minecraft:cardinal_direction'
                        );

                    switch (direction) {
                        case Direction.East:
                            {
                                if (blockToCheckDirection === 'north') {
                                    permutation_to_place =
                                        permutation_to_place.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
                                            'outer_left'
                                        );
                                }
                                if (blockToCheckDirection === 'south') {
                                    permutation_to_place =
                                        permutation_to_place.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
                                            'outer_right'
                                        );
                                }
                            }
                            break;
                        case Direction.West:
                            {
                                if (blockToCheckDirection === 'south') {
                                    permutation_to_place =
                                        permutation_to_place.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
                                            'inner_left'
                                        );
                                }
                                if (blockToCheckDirection === 'north') {
                                    permutation_to_place =
                                        permutation_to_place.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
                                            'inner_right'
                                        );
                                }
                            }
                            break;
                        case Direction.North:
                            {
                                if (blockToCheckDirection === 'north') {
                                    block_to_check.setPermutation(
                                        block_to_check.permutation.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
                                            'inner_left'
                                        )
                                    );
                                }
                                if (blockToCheckDirection === 'south') {
                                    block_to_check.setPermutation(
                                        block_to_check.permutation.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
                                            'outer_left'
                                        )
                                    );
                                }
                            }
                            break;
                        case Direction.South:
                            {
                                if (blockToCheckDirection === 'north') {
                                    block_to_check.setPermutation(
                                        block_to_check.permutation.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
                                            'outer_right'
                                        )
                                    );
                                }
                                if (blockToCheckDirection === 'south') {
                                    block_to_check.setPermutation(
                                        block_to_check.permutation.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
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
                for (const direction of adk.DirectionType.Horizontal) {
                    block_to_check = data.block.offset(
                        adk.DirectionHelper.toVector3(direction)
                    );

                    if (
                        !block_to_check ||
                        block_to_check.typeId !== permutation_to_place.type.id
                    )
                        continue;

                    const blockToCheckHalf =
                        block_to_check.permutation.getState(
                            'minecraft:vertical_half'
                        );

                    if (blockToCheckHalf !== vertical_half) continue;

                    const blockToCheckDirection =
                        block_to_check.permutation.getState(
                            'minecraft:cardinal_direction'
                        );

                    switch (direction) {
                        case Direction.East:
                            {
                                if (blockToCheckDirection === 'north') {
                                    permutation_to_place =
                                        permutation_to_place.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
                                            'inner_left'
                                        );
                                }
                                if (blockToCheckDirection === 'south') {
                                    permutation_to_place =
                                        permutation_to_place.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
                                            'inner_right'
                                        );
                                }
                            }
                            break;
                        case Direction.West:
                            {
                                if (blockToCheckDirection === 'south') {
                                    permutation_to_place =
                                        permutation_to_place.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
                                            'outer_left'
                                        );
                                }
                                if (blockToCheckDirection === 'north') {
                                    permutation_to_place =
                                        permutation_to_place.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
                                            'outer_right'
                                        );
                                }
                            }
                            break;
                        case Direction.North:
                            {
                                if (blockToCheckDirection === 'north') {
                                    block_to_check.setPermutation(
                                        block_to_check.permutation.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
                                            'inner_right'
                                        )
                                    );
                                }
                                if (blockToCheckDirection === 'south') {
                                    block_to_check.setPermutation(
                                        block_to_check.permutation.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
                                            'outer_right'
                                        )
                                    );
                                }
                            }
                            break;
                        case Direction.South:
                            {
                                if (blockToCheckDirection === 'north') {
                                    block_to_check.setPermutation(
                                        block_to_check.permutation.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
                                            'outer_left'
                                        )
                                    );
                                }
                                if (blockToCheckDirection === 'south') {
                                    block_to_check.setPermutation(
                                        block_to_check.permutation.withState(
                                            (namespace +
                                                ':shape') as keyof minecraftvanilladata.BlockStateSuperset,
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

    data.permutationToPlace = permutation_to_place;
}
