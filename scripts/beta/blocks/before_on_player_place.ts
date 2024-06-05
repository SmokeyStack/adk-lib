import {
    Block,
    BlockComponentPlayerPlaceBeforeEvent,
    BlockCustomComponent,
    BlockPermutation,
    Direction,
    EquipmentSlot,
    ItemStack,
    Player
} from '@minecraft/server';
import { logEventData } from 'utils/debug';
import { DirectionType, decrementStack } from 'utils/helper';
import { directionToVector3 } from 'utils/math';

class beforeOnPlayerPlace implements BlockCustomComponent {
    constructor() {
        this.beforeOnPlayerPlace = this.beforeOnPlayerPlace.bind(this);
    }
    beforeOnPlayerPlace(_componentData: BlockComponentPlayerPlaceBeforeEvent) {}
}

export class debug extends beforeOnPlayerPlace {
    beforeOnPlayerPlace(componentData: BlockComponentPlayerPlaceBeforeEvent) {
        let data: Object = logEventData(
            componentData,
            componentData.constructor.name
        );
        let result: string = JSON.stringify(
            Object.keys(data)
                .sort()
                .reduce((result, key) => {
                    result[key] = data[key];
                    return result;
                }, {}),
            null,
            4
        );
        console.log(result);
    }
}

export class cancel extends beforeOnPlayerPlace {
    beforeOnPlayerPlace(componentData: BlockComponentPlayerPlaceBeforeEvent) {
        componentData.cancel = true;
    }
}

export class changeIntoBedrock extends beforeOnPlayerPlace {
    beforeOnPlayerPlace(componentData: BlockComponentPlayerPlaceBeforeEvent) {
        componentData.permutationToPlace =
            BlockPermutation.resolve('minecraft:bedrock');
    }
}

export class doubleSlab extends beforeOnPlayerPlace {
    beforeOnPlayerPlace(
        componentData: BlockComponentPlayerPlaceBeforeEvent
    ): void {
        let block: Block = componentData.block;
        let player: Player = componentData.player;
        let playerEquipment: ItemStack = player
            .getComponent('equippable')
            .getEquipment(EquipmentSlot.Mainhand);

        if (playerEquipment === undefined) return;

        let face: Direction = componentData.face;

        switch (face) {
            case Direction.Up:
                face = Direction.Down;
                break;
            case Direction.Down:
                face = Direction.Up;
                break;
            case Direction.North:
                face = Direction.South;
                break;
            case Direction.East:
                face = Direction.West;
                break;
            case Direction.South:
                face = Direction.North;
                break;
            case Direction.West:
                face = Direction.East;
                break;
            default:
                break;
        }

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
                componentData.cancel = true;
                decrementStack(player);
            }
        }
    }
}

export class sugarCane extends beforeOnPlayerPlace {
    beforeOnPlayerPlace(
        componentData: BlockComponentPlayerPlaceBeforeEvent
    ): void {
        let block: Block = componentData.block;
        const blockToPlace: BlockPermutation = componentData.permutationToPlace;
        let face: Direction = componentData.face;

        switch (face) {
            case Direction.Up:
                face = Direction.Down;
                break;
            case Direction.Down:
                face = Direction.Up;
                break;
            case Direction.North:
                face = Direction.South;
                break;
            case Direction.East:
                face = Direction.West;
                break;
            case Direction.South:
                face = Direction.North;
                break;
            case Direction.West:
                face = Direction.East;
                break;
            default:
                break;
        }

        let blockToCheck: Block = block.below();

        if (blockToCheck.typeId === blockToPlace.type.id) return;
        if (
            blockToCheck.getTags().includes('dirt') ||
            blockToCheck.getTags().includes('sand')
        ) {
            for (const direction of DirectionType.HORIZONTAL) {
                let block2: Block = blockToCheck.offset(
                    directionToVector3(direction)
                );

                if (
                    !block2.getTags().includes('water') &&
                    block2.typeId != 'minecraft:frosted_ice'
                )
                    continue;

                return;
            }
        }

        componentData.cancel = true;
    }
}

export class stairs extends beforeOnPlayerPlace {
    beforeOnPlayerPlace(
        componentData: BlockComponentPlayerPlaceBeforeEvent
    ): void {
        let face: string = componentData.permutationToPlace.getState(
            'minecraft:cardinal_direction'
        ) as string;
        let half: string = componentData.permutationToPlace.getState(
            'minecraft:vertical_half'
        ) as string;
        const namespace: string =
            componentData.permutationToPlace.type.id.split(':')[0];
        let blockPermutation: BlockPermutation =
            componentData.permutationToPlace;
        let blockToCheck: Block;
        switch (face) {
            case 'north':
                {
                    for (const direction of DirectionType.HORIZONTAL) {
                        blockToCheck = componentData.block.offset(
                            directionToVector3(direction)
                        );

                        if (blockToCheck.typeId !== blockPermutation.type.id)
                            continue;

                        const blockToCheckHalf =
                            blockToCheck.permutation.getState(
                                'minecraft:vertical_half'
                            );

                        if (blockToCheckHalf !== half) continue;

                        const blockToCheckDirection =
                            blockToCheck.permutation.getState(
                                'minecraft:cardinal_direction'
                            );

                        switch (direction) {
                            case Direction.North:
                                {
                                    if (blockToCheckDirection === 'west') {
                                        blockPermutation =
                                            blockPermutation.withState(
                                                namespace + ':shape',
                                                'outer_left'
                                            );
                                    }
                                    if (blockToCheckDirection === 'east') {
                                        blockPermutation =
                                            blockPermutation.withState(
                                                namespace + ':shape',
                                                'outer_right'
                                            );
                                    }
                                }
                                break;
                            case Direction.South:
                                {
                                    if (blockToCheckDirection === 'east') {
                                        blockPermutation =
                                            blockPermutation.withState(
                                                namespace + ':shape',
                                                'inner_left'
                                            );
                                    }
                                    if (blockToCheckDirection === 'west') {
                                        blockPermutation =
                                            blockPermutation.withState(
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
                    blockPermutation = blockPermutation.withState(
                        namespace + ':south',
                        true
                    );
                    for (const direction of DirectionType.HORIZONTAL) {
                        blockToCheck = componentData.block.offset(
                            directionToVector3(direction)
                        );

                        if (blockToCheck.typeId !== blockPermutation.type.id)
                            continue;

                        const blockToCheckHalf =
                            blockToCheck.permutation.getState(
                                'minecraft:vertical_half'
                            );

                        if (blockToCheckHalf !== half) continue;

                        const blockToCheckDirection =
                            blockToCheck.permutation.getState(
                                'minecraft:cardinal_direction'
                            );

                        switch (direction) {
                            case Direction.North:
                                {
                                    if (blockToCheckDirection === 'west') {
                                        blockPermutation =
                                            blockPermutation.withState(
                                                namespace + ':shape',
                                                'inner_left'
                                            );
                                    }
                                    if (blockToCheckDirection === 'east') {
                                        blockPermutation =
                                            blockPermutation.withState(
                                                namespace + ':shape',
                                                'inner_right'
                                            );
                                    }
                                }
                                break;
                            case Direction.South:
                                {
                                    if (blockToCheckDirection === 'east') {
                                        blockPermutation =
                                            blockPermutation.withState(
                                                namespace + ':shape',
                                                'outer_left'
                                            );
                                    }
                                    if (blockToCheckDirection === 'west') {
                                        blockPermutation =
                                            blockPermutation.withState(
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
                        blockToCheck = componentData.block.offset(
                            directionToVector3(direction)
                        );

                        if (blockToCheck.typeId !== blockPermutation.type.id)
                            continue;

                        const blockToCheckHalf =
                            blockToCheck.permutation.getState(
                                'minecraft:vertical_half'
                            );

                        if (blockToCheckHalf !== half) continue;

                        const blockToCheckDirection =
                            blockToCheck.permutation.getState(
                                'minecraft:cardinal_direction'
                            );

                        switch (direction) {
                            case Direction.East:
                                {
                                    if (blockToCheckDirection === 'north') {
                                        blockPermutation =
                                            blockPermutation.withState(
                                                namespace + ':shape',
                                                'outer_left'
                                            );
                                    }
                                    if (blockToCheckDirection === 'south') {
                                        blockPermutation =
                                            blockPermutation.withState(
                                                namespace + ':shape',
                                                'outer_right'
                                            );
                                    }
                                }
                                break;
                            case Direction.West:
                                {
                                    if (blockToCheckDirection === 'south') {
                                        blockPermutation =
                                            blockPermutation.withState(
                                                namespace + ':shape',
                                                'inner_left'
                                            );
                                    }
                                    if (blockToCheckDirection === 'north') {
                                        blockPermutation =
                                            blockPermutation.withState(
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
                        blockToCheck = componentData.block.offset(
                            directionToVector3(direction)
                        );

                        if (blockToCheck.typeId !== blockPermutation.type.id)
                            continue;

                        const blockToCheckHalf =
                            blockToCheck.permutation.getState(
                                'minecraft:vertical_half'
                            );

                        if (blockToCheckHalf !== half) continue;

                        const blockToCheckDirection =
                            blockToCheck.permutation.getState(
                                'minecraft:cardinal_direction'
                            );

                        switch (direction) {
                            case Direction.East:
                                {
                                    if (blockToCheckDirection === 'north') {
                                        blockPermutation =
                                            blockPermutation.withState(
                                                namespace + ':shape',
                                                'inner_left'
                                            );
                                    }
                                    if (blockToCheckDirection === 'south') {
                                        blockPermutation =
                                            blockPermutation.withState(
                                                namespace + ':shape',
                                                'inner_right'
                                            );
                                    }
                                }
                                break;
                            case Direction.West:
                                {
                                    if (blockToCheckDirection === 'south') {
                                        blockPermutation =
                                            blockPermutation.withState(
                                                namespace + ':shape',
                                                'outer_left'
                                            );
                                    }
                                    if (blockToCheckDirection === 'north') {
                                        blockPermutation =
                                            blockPermutation.withState(
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

        componentData.permutationToPlace = blockPermutation;
    }
}
