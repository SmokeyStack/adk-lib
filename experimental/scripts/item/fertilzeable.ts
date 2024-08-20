import {
    Dimension,
    Vector3,
    BlockPermutation,
    BlockStates,
    Block,
    ItemStack
} from '@minecraft/server';
import { areVectorsEqual } from '../utils/math';

interface Fertilizable {
    isFertilizable(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean;
    canGrow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean;
    grow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): void;
}

class CropBlock implements Fertilizable {
    block: string;
    constructor(block: string) {
        this.block = block;
    }
    isFertilizable(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        let maxGrowth: number = BlockStates.get('growth').validValues[
            BlockStates.get('growth').validValues.length - 1
        ] as number;
        let currentGrowth: number = blockPermutation.getState(
            'growth'
        ) as number;

        return maxGrowth != currentGrowth;
    }
    canGrow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): void {
        let maxGrowth: number = BlockStates.get('growth').validValues[
            BlockStates.get('growth').validValues.length - 1
        ] as number;
        let nextGrowth: number =
            (blockPermutation.getState('growth') as number) +
            (Math.random() * 4 + 2);

        if (nextGrowth > maxGrowth) nextGrowth = maxGrowth;

        dimension.setBlockPermutation(
            blockPosition,
            BlockPermutation.resolve(this.block, { growth: nextGrowth })
        );
        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: blockPosition.x + 0.5,
            y: blockPosition.y + 0.5,
            z: blockPosition.z + 0.5
        });
    }
}

class TorchFlowerCrop extends CropBlock {
    grow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): void {
        let maxGrowth: number = BlockStates.get('growth').validValues[
            BlockStates.get('growth').validValues.length - 1
        ] as number;
        let currentGrowth: number =
            (blockPermutation.getState('growth') as number) + 1;

        if (blockPermutation.getState('growth') == 1) {
            dimension.setBlockType(blockPosition, 'minecraft:torchflower');
            return;
        }

        if (currentGrowth > maxGrowth) currentGrowth = maxGrowth;

        dimension.setBlockPermutation(
            blockPosition,
            BlockPermutation.resolve(this.block, { growth: currentGrowth })
        );
        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: blockPosition.x + 0.5,
            y: blockPosition.y + 0.5,
            z: blockPosition.z + 0.5
        });
    }
}
class BambooBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        let amountOfBamboosAbove: number = this.countBambooInRange(
            dimension,
            blockPosition,
            {
                x: 0,
                y: 1,
                z: 0
            }
        );

        return (
            amountOfBamboosAbove +
                this.countBambooInRange(dimension, blockPosition, {
                    x: 0,
                    y: -1,
                    z: 0
                }) +
                1 <
                16 &&
            dimension
                .getBlock(blockPosition)
                .above(amountOfBamboosAbove)
                .permutation.getState('age_bit') != 1
        );
    }

    canGrow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): void {
        let amountOfBambooAbove: number = this.countBambooInRange(
            dimension,
            blockPosition,
            {
                x: 0,
                y: 1,
                z: 0
            }
        );
        let amountOfBambooBelow: number = this.countBambooInRange(
            dimension,
            blockPosition,
            {
                x: 0,
                y: -1,
                z: 0
            }
        );
        let totalBambooInColumn: number =
            amountOfBambooAbove + amountOfBambooBelow + 1;
        let amountToGrow: number = 1 + Math.random() * 2;

        for (let a: number = 0; a < amountToGrow; ++a) {
            let blockPos: Block = dimension
                .getBlock(blockPosition)
                .above(amountOfBambooAbove);
            let blockState: BlockPermutation = blockPos.permutation;

            if (
                totalBambooInColumn >= 16 ||
                blockState.getState('age_bit') == 1 ||
                !blockPos.above().isAir
            )
                return;

            this.updateLeaves(
                blockState,
                dimension,
                blockPos,
                totalBambooInColumn
            );
            ++amountOfBambooAbove;
            ++totalBambooInColumn;
        }

        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: blockPosition.x + 0.5,
            y: blockPosition.y + 0.5,
            z: blockPosition.z + 0.5
        });
    }

    updateLeaves(
        blockPermutation: BlockPermutation,
        dimension: Dimension,
        block: Block,
        height: number
    ) {
        let blockPermutationBelow: BlockPermutation = block.below().permutation;
        let blockPermutationBelow2: BlockPermutation =
            block.below(2).permutation;
        let bambooLeaves: string = 'no_leaves';

        if (height >= 1) {
            if (
                blockPermutationBelow.type.id != 'minecraft:bamboo' ||
                blockPermutationBelow.getState('bamboo_leaf_size') ==
                    'no_leaves'
            )
                bambooLeaves = 'small_leaves';
            else if (
                blockPermutationBelow.type.id == 'minecraft:bamboo' &&
                blockPermutationBelow.getState('bamboo_leaf_size') !=
                    'no_leaves'
            ) {
                bambooLeaves = 'large_leaves';

                if (blockPermutationBelow2.type.id == 'minecraft:bamboo') {
                    dimension.setBlockPermutation(
                        block.below(),
                        blockPermutationBelow.withState(
                            'bamboo_leaf_size',
                            'small_leaves'
                        )
                    );
                    dimension.setBlockPermutation(
                        block.below(2),
                        blockPermutationBelow2.withState(
                            'bamboo_leaf_size',
                            'no_leaves'
                        )
                    );
                }
            }
        }

        let newBambooLeaves: string =
            blockPermutation.getState('bamboo_stalk_thickness') == 'thick' ||
            blockPermutationBelow2.type.id == 'minecraft:bamboo'
                ? 'thick'
                : 'thin';
        let ageBit: number =
            (height >= 11 && Math.random() < 0.25) || height == 15 ? 1 : 0;
        dimension.setBlockPermutation(
            block.above(),
            BlockPermutation.resolve('minecraft:bamboo', {
                bamboo_stalk_thickness: newBambooLeaves,
                bamboo_leaf_size: bambooLeaves,
                age_bit: ageBit
            })
        );
    }

    countBambooInRange(
        dimension: Dimension,
        blockPosition: Vector3,
        direction: Vector3
    ) {
        let a: number;

        for (
            a = 0;
            a < 16 &&
            dimension.getBlock({
                x: blockPosition.x + direction.x * (a + 1),
                y: blockPosition.y + direction.y * (a + 1),
                z: blockPosition.z + direction.z * (a + 1)
            }).typeId == 'minecraft:bamboo';
            ++a
        ) {}

        return a;
    }
}

class BambooSapling implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        return dimension.getBlock(blockPosition).above().isAir;
    }

    canGrow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): void {
        dimension.getBlock(blockPosition).above().setType('minecraft:bamboo');
        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: blockPosition.x + 0.5,
            y: blockPosition.y + 0.5,
            z: blockPosition.z + 0.5
        });
    }
}

class CocoaBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        return (blockPermutation.getState('age') as number) < 2;
    }

    canGrow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): void {
        let blockState: BlockPermutation = blockPermutation.withState(
            'age',
            (blockPermutation.getState('age') as number) + 1
        );
        dimension.setBlockPermutation(blockPosition, blockState);
        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: blockPosition.x + 0.5,
            y: blockPosition.y + 0.5,
            z: blockPosition.z + 0.5
        });
    }
}

class FlowerBedBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        return true;
    }

    canGrow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): void {
        let currentGrowth: number = blockPermutation.getState(
            'growth'
        ) as number;

        if (currentGrowth < 4)
            dimension.setBlockPermutation(
                blockPosition,
                BlockPermutation.resolve('minecraft:pink_petals', {
                    growth: currentGrowth + 1
                })
            );
        else
            dimension.spawnItem(
                new ItemStack('minecraft:pink_petals', 1),
                blockPosition
            );

        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: blockPosition.x + 0.5,
            y: blockPosition.y + 0.5,
            z: blockPosition.z + 0.5
        });
    }
}

class MangroveLeavesBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        return dimension.getBlock(blockPosition).below().isAir;
    }

    canGrow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): void {
        dimension
            .getBlock(blockPosition)
            .below()
            .setPermutation(
                BlockPermutation.resolve('mangrove_propagule', {
                    hanging: true
                })
            );
        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: blockPosition.x + 0.5,
            y: blockPosition.y + 0.5,
            z: blockPosition.z + 0.5
        });
    }
}

class NetherrackBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        for (let a: number = -1; a <= 1; a++) {
            for (let b: number = -1; b <= 1; b++) {
                for (let c: number = -1; c <= 1; c++) {
                    let id: string = dimension.getBlock({
                        x: blockPosition.x + a,
                        y: blockPosition.y + c,
                        z: blockPosition.z + b
                    }).typeId;
                    if (
                        id == 'minecraft:warped_nylium' ||
                        id == 'minecraft:crimson_nylium'
                    )
                        return true;
                }
            }
        }

        return false;
    }

    canGrow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): void {
        let block1: boolean = false;
        let block2: boolean = false;

        for (let a: number = -1; a <= 1; a++) {
            for (let b: number = -1; b <= 1; b++) {
                for (let c: number = -1; c <= 1; c++) {
                    let id: string = dimension.getBlock({
                        x: blockPosition.x + a,
                        y: blockPosition.y + c,
                        z: blockPosition.z + b
                    }).typeId;

                    if (id == 'minecraft:warped_nylium') block2 = true;
                    if (id == 'minecraft:crimson_nylium') block1 = true;
                    if (!block2 || !block1) continue;
                    break;
                }
            }
        }

        if (block2 && block1)
            dimension.setBlockType(
                blockPosition,
                Math.random() < 0.5
                    ? 'minecraft:warped_nylium'
                    : 'minecraft:crimson_nylium'
            );
        else if (block2)
            dimension.setBlockType(blockPosition, 'minecraft:warped_nylium');
        else if (block1)
            dimension.setBlockType(blockPosition, 'minecraft:crimson_nylium');

        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: blockPosition.x + 0.5,
            y: blockPosition.y + 1.5,
            z: blockPosition.z + 0.5
        });
    }
}

class RootedDirtBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        return dimension.getBlock(blockPosition).below().isAir;
    }

    canGrow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): void {
        blockPosition.y--;
        dimension.setBlockType(blockPosition, 'minecraft:hanging_roots');
        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: blockPosition.x + 0.5,
            y: blockPosition.y + 0.5,
            z: blockPosition.z + 0.5
        });
    }
}

class PitcherCropBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        if (blockPermutation.getState('upper_block_bit')) return false;

        return this.canGrow2(
            dimension,
            blockPosition,
            blockPermutation,
            (blockPermutation.getState('growth') as number) + 1
        );
    }

    canGrow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): void {
        let amountToGrow: number = Math.min(
            (blockPermutation.getState('growth') as number) + 1,
            4
        );

        if (this.isFullyGrown(blockPermutation)) return;

        let blockState: BlockPermutation = blockPermutation.withState(
            'growth',
            amountToGrow
        );
        dimension.setBlockPermutation(blockPosition, blockState);
        if (this.isDoubleTallAtAge(amountToGrow))
            dimension
                .getBlock(blockPosition)
                .above()
                .setPermutation(blockState.withState('upper_block_bit', true));

        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: blockPosition.x + 0.5,
            y: blockPosition.y + 0.5,
            z: blockPosition.z + 0.5
        });
    }

    isFullyGrown(blockPermutation: BlockPermutation): boolean {
        return blockPermutation.getState('growth') == 4;
    }

    isDoubleTallAtAge(age: number): boolean {
        return age >= 3;
    }

    canGrowAt(dimension: Dimension, blockPosition: Vector3): boolean {
        return (
            dimension.getBlock(blockPosition).isAir ||
            dimension.getBlock(blockPosition).typeId == 'minecraft:pitcher_crop'
        );
    }

    canGrow2(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation,
        age: number
    ): boolean {
        blockPosition.y++;
        return (
            !this.isFullyGrown(blockPermutation) &&
            (!this.isDoubleTallAtAge(age) ||
                this.canGrowAt(dimension, blockPosition))
        );
    }
}

class SeagrassBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        return true;
    }

    canGrow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): void {
        let blockState: BlockPermutation = blockPermutation.withState(
            'sea_grass_type',
            'double_bot'
        );
        let blockState2: BlockPermutation = blockPermutation.withState(
            'sea_grass_type',
            'double_top'
        );

        if (
            dimension.getBlock(blockPosition).above().typeId ==
            'minecraft:water'
        ) {
            dimension.setBlockPermutation(blockPosition, blockState);
            dimension.setBlockPermutation(
                dimension.getBlock(blockPosition).above(),
                blockState2
            );
            dimension.spawnParticle('minecraft:crop_growth_emitter', {
                x: blockPosition.x + 0.5,
                y: blockPosition.y + 0.5,
                z: blockPosition.z + 0.5
            });
        }
    }
}

class SeaPickleBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        return true;
    }

    canGrow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): void {
        let regex = new RegExp('^minecraft:(?!dead_).*_coral_block$');

        if (
            !blockPermutation.getState('dead_bit') &&
            regex.exec(dimension.getBlock(blockPosition).below().typeId)
        ) {
            let a: number = 1;
            let b: number = 0;
            let c: number = blockPosition.x - 2;
            let d: number = 0;
            for (let e: number = 0; e < 5; ++e) {
                for (let f: number = 0; f < a; ++f) {
                    let g: number = 2 + blockPosition.y - 1;

                    for (let h: number = g - 2; h < g; ++h) {
                        let newBlockPosition: Vector3 = {
                            x: c + e,
                            y: h,
                            z: blockPosition.z - d + f
                        };

                        if (
                            areVectorsEqual(newBlockPosition, blockPosition) ||
                            Math.floor(Math.random() * 6) != 0 ||
                            dimension.getBlock(newBlockPosition).typeId !=
                                'minecraft:water' ||
                            !regex.exec(
                                dimension.getBlock(newBlockPosition).below()
                                    .typeId
                            )
                        )
                            continue;

                        dimension.setBlockPermutation(
                            newBlockPosition,
                            blockPermutation.withState(
                                'cluster_count',
                                Math.random() * 3
                            )
                        );
                    }
                }

                if (b < 2) {
                    a += 2;
                    ++d;
                } else {
                    a -= 2;
                    --d;
                }

                ++b;
            }

            dimension.setBlockPermutation(
                blockPosition,
                blockPermutation.withState('cluster_count', 3)
            );
            dimension.spawnParticle('minecraft:crop_growth_emitter', {
                x: blockPosition.x + 0.5,
                y: blockPosition.y + 0.5,
                z: blockPosition.z + 0.5
            });
        }
    }
}

class GrassBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        return true;
    }

    canGrow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): void {
        if (!dimension.getBlock(blockPosition).above().isAir) return;
        if (dimension.getBlock(blockPosition).typeId == 'minecraft:short_grass')
            dimension.setBlockType(blockPosition, 'minecraft:tall_grass');
        if (dimension.getBlock(blockPosition).typeId == 'minecraft:fern')
            dimension.setBlockType(blockPosition, 'minecraft:large_fern');

        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: blockPosition.x + 0.5,
            y: blockPosition.y + 0.5,
            z: blockPosition.z + 0.5
        });
    }
}

class SmallDripLeafBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        return true;
    }

    canGrow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): void {
        if (blockPermutation.getState('upper_block_bit') == false)
            this.bigDripleafBlockGrow(
                dimension,
                blockPosition,
                blockPermutation.getState(
                    'minecraft:cardinal_direction'
                ) as string
            );
        else {
            blockPosition.y--;
            this.bigDripleafBlockGrow(
                dimension,
                blockPosition,
                blockPermutation.getState(
                    'minecraft:cardinal_direction'
                ) as string
            );
        }

        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: blockPosition.x + 0.5,
            y: blockPosition.y + 0.5,
            z: blockPosition.z + 0.5
        });
    }

    bigDripleafBlockGrow(
        dimension: Dimension,
        blockPosition: Vector3,
        direction: string
    ): void {
        let a: number;
        let b: number = Math.floor(Math.random() * 4) + 2;
        let blockPositionCopy: Vector3 = { ...blockPosition };

        for (
            a = 0;
            a < b &&
            this.bigDripleafBlockCanGrowInto(
                dimension,
                blockPositionCopy,
                dimension.getBlock(blockPositionCopy)
            );
            ++a
        )
            blockPositionCopy.y++;

        let c: number = blockPosition.y + a - 1;
        blockPositionCopy.y = blockPosition.y;

        while (blockPositionCopy.y < c) {
            this.bigDripleafStemBlockPlaceStemAt(
                dimension,
                blockPositionCopy,
                direction
            );
            blockPositionCopy.y++;
        }

        this.bigDripleafBlockPlaceDripleafAt(
            dimension,
            blockPositionCopy,
            direction
        );
    }

    bigDripleafBlockCanGrowInto(
        dimension: Dimension,
        blockPosition: Vector3,
        block: Block
    ): boolean {
        return (
            !(dimension.heightRange.max < blockPosition.y) &&
            this.bigDripleafBlockCanGrowInto2(block)
        );
    }

    bigDripleafBlockCanGrowInto2(block: Block) {
        return (
            block.isAir ||
            block.typeId == 'minecraft:water' ||
            block.typeId == 'minecraft:small_dripleaf_block'
        );
    }

    bigDripleafStemBlockPlaceStemAt(
        dimension: Dimension,
        blockPosition: Vector3,
        direction: string
    ): void {
        dimension.setBlockPermutation(
            blockPosition,
            BlockPermutation.resolve('minecraft:big_dripleaf', {
                'minecraft:cardinal_direction': direction,
                big_dripleaf_head: false
            })
        );
    }

    bigDripleafBlockPlaceDripleafAt(
        dimension: Dimension,
        blockPosition: Vector3,
        direction: string
    ): void {
        dimension.setBlockPermutation(
            blockPosition,
            BlockPermutation.resolve('minecraft:big_dripleaf', {
                'minecraft:cardinal_direction': direction,
                big_dripleaf_head: true
            })
        );
    }
}

class BigDripLeafBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        if (blockPermutation.getState('big_dripleaf_head'))
            return this.bigDripleafBlockCanGrowInto2(
                dimension.getBlock(blockPosition).above()
            );
        else {
            let headPosition: Vector3 = this.findColumnEnd(
                dimension,
                blockPosition,
                blockPermutation,
                1,
                'minecraft:big_dripleaf'
            );

            if (headPosition == null) return false;

            let blockPositionCopy: Vector3 = { ...headPosition };
            blockPositionCopy.y++;

            return this.bigDripleafBlockCanGrowInto(
                dimension,
                blockPositionCopy,
                dimension.getBlock(blockPositionCopy)
            );
        }
    }

    canGrow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): void {
        if (blockPermutation.getState('big_dripleaf_head')) {
            let blockPositionCopy: Vector3 = { ...blockPosition };
            blockPositionCopy.y++;

            if (
                this.bigDripleafBlockCanGrowInto(
                    dimension,
                    blockPositionCopy,
                    dimension.getBlock(blockPositionCopy)
                )
            ) {
                let direction: string = blockPermutation.getState(
                    'minecraft:cardinal_direction'
                ) as string;
                this.bigDripleafStemBlockPlaceStemAt(
                    dimension,
                    blockPosition,
                    direction
                );
                this.bigDripleafBlockPlaceDripleafAt(
                    dimension,
                    blockPositionCopy,
                    direction
                );
            }
        } else {
            let headPosition: Vector3 = this.findColumnEnd(
                dimension,
                blockPosition,
                blockPermutation,
                1,
                'minecraft:big_dripleaf'
            );

            if (headPosition == null) return;

            let blockPositionCopy: Vector3 = { ...headPosition };
            let blockPositionCopy2: Vector3 = { ...blockPositionCopy };
            blockPositionCopy2.y++;
            let direction: string = blockPermutation.getState(
                'minecraft:cardinal_direction'
            ) as string;
            this.bigDripleafStemBlockPlaceStemAt(
                dimension,
                blockPositionCopy,
                direction
            );
            this.bigDripleafBlockPlaceDripleafAt(
                dimension,
                blockPositionCopy2,
                direction
            );
        }

        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: blockPosition.x + 0.5,
            y: blockPosition.y + 0.5,
            z: blockPosition.z + 0.5
        });
    }

    bigDripleafBlockCanGrowInto(
        dimension: Dimension,
        blockPosition: Vector3,
        block: Block
    ): boolean {
        return (
            !(dimension.heightRange.max < blockPosition.y) &&
            this.bigDripleafBlockCanGrowInto2(block)
        );
    }

    bigDripleafBlockCanGrowInto2(block: Block) {
        return (
            block.isAir ||
            block.typeId == 'minecraft:water' ||
            block.typeId == 'minecraft:small_dripleaf_block'
        );
    }

    bigDripleafStemBlockPlaceStemAt(
        dimension: Dimension,
        blockPosition: Vector3,
        direction: string
    ): void {
        dimension.setBlockPermutation(
            blockPosition,
            BlockPermutation.resolve('minecraft:big_dripleaf', {
                'minecraft:cardinal_direction': direction,
                big_dripleaf_head: false
            })
        );
    }

    bigDripleafBlockPlaceDripleafAt(
        dimension: Dimension,
        blockPosition: Vector3,
        direction: string
    ): void {
        dimension.setBlockPermutation(
            blockPosition,
            BlockPermutation.resolve('minecraft:big_dripleaf', {
                'minecraft:cardinal_direction': direction,
                big_dripleaf_head: true
            })
        );
    }

    findColumnEnd(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation,
        direction: number,
        endBlock: string
    ): Vector3 {
        let blockPositionCopy: Vector3 = { ...blockPosition };

        do {
            blockPositionCopy.y += direction;
        } while (
            dimension.getBlock(blockPositionCopy).permutation ==
            blockPermutation
        );
        if (dimension.getBlock(blockPositionCopy).typeId == endBlock)
            return blockPositionCopy;

        return null;
    }
}

class StemBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        return blockPermutation.getState('growth') != 7;
    }

    canGrow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): void {
        let amountToGrow: number = Math.min(
            7,
            (blockPermutation.getState('growth') as number) +
                Math.floor(Math.random() * 4 + 2)
        );
        let blockState: BlockPermutation = blockPermutation.withState(
            'growth',
            amountToGrow
        );
        dimension.setBlockPermutation(blockPosition, blockState);
        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: blockPosition.x + 0.5,
            y: blockPosition.y + 0.5,
            z: blockPosition.z + 0.5
        });
    }
}

class SweetBerryBush implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        return (blockPermutation.getState('growth') as number) < 3;
    }

    canGrow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): void {
        let amountToGrow: number = Math.min(
            3,
            (blockPermutation.getState('growth') as number) + 1
        );
        let block_state: BlockPermutation = blockPermutation.withState(
            'growth',
            amountToGrow
        );
        dimension.setBlockPermutation(blockPosition, block_state);
        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: blockPosition.x + 0.5,
            y: blockPosition.y + 0.5,
            z: blockPosition.z + 0.5
        });
    }
}

class TallFlowerBlock implements Fertilizable {
    block: string;
    constructor(block: string) {
        this.block = block;
    }

    isFertilizable(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        return true;
    }

    canGrow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        blockPosition: Vector3,
        blockPermutation: BlockPermutation
    ): void {
        dimension.spawnItem(new ItemStack(this.block), blockPosition);
        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: blockPosition.x + 0.5,
            y: blockPosition.y + 0.5,
            z: blockPosition.z + 0.5
        });
    }
}

export const BLOCK_MAP = new Map<string, Fertilizable>();

const WHEAT = new CropBlock('minecraft:wheat');
const BEETROOT = new CropBlock('minecraft:beetroot');
const CARROTS = new CropBlock('minecraft:carrots');
const POTATOES = new CropBlock('minecraft:potatoes');
const TORCHFLOWER_CROP = new TorchFlowerCrop('minecraft:torchflower_crop');
const BAMBOO = new BambooBlock();
const BAMBOO_SAPLING = new BambooSapling();
const COCOA = new CocoaBlock();
const PINK_PETALS = new FlowerBedBlock();
const MANGROVE_LEAVES = new MangroveLeavesBlock();
const NETHERRACK = new NetherrackBlock();
const ROOTED_DIRT = new RootedDirtBlock();
const PITCHER = new PitcherCropBlock();
const SEAGRASS = new SeagrassBlock();
const SEA_PICKLE = new SeaPickleBlock();
const SHORT_GRASS = new GrassBlock();
const FERN = new GrassBlock();
const SMALL_DRIPLEAF_BLOCK = new SmallDripLeafBlock();
const BIG_DRIPLEAF_BLOCK = new BigDripLeafBlock();
const MELON_STEM = new StemBlock();
const PUMPKIN_STEM = new StemBlock();
const SWEET_BERRY_BUSH = new SweetBerryBush();
const LILAC = new TallFlowerBlock('minecraft:lilac');
const PEONY = new TallFlowerBlock('minecraft:peony');
const ROSE_BUSH = new TallFlowerBlock('minecraft:rose_bush');
const SUNFLOWER = new TallFlowerBlock('minecraft:sunflower');

BLOCK_MAP.set('minecraft:wheat', WHEAT);
BLOCK_MAP.set('minecraft:beetroot', BEETROOT);
BLOCK_MAP.set('minecraft:carrots', CARROTS);
BLOCK_MAP.set('minecraft:potatoes', POTATOES);
BLOCK_MAP.set('minecraft:torchflower_crop', TORCHFLOWER_CROP);
BLOCK_MAP.set('minecraft:bamboo', BAMBOO);
BLOCK_MAP.set('minecraft:bamboo_sapling', BAMBOO_SAPLING);
BLOCK_MAP.set('minecraft:cocoa', COCOA);
BLOCK_MAP.set('minecraft:pink_petals', PINK_PETALS);
BLOCK_MAP.set('minecraft:mangrove_leaves', MANGROVE_LEAVES);
BLOCK_MAP.set('minecraft:dirt_with_roots', ROOTED_DIRT);
BLOCK_MAP.set('minecraft:netherrack', NETHERRACK);
BLOCK_MAP.set('minecraft:pitcher_crop', PITCHER);
BLOCK_MAP.set('minecraft:seagrass', SEAGRASS);
BLOCK_MAP.set('minecraft:sea_pickle', SEA_PICKLE);
BLOCK_MAP.set('minecraft:short_grass', SHORT_GRASS);
BLOCK_MAP.set('minecraft:fern', FERN);
BLOCK_MAP.set('minecraft:small_dripleaf_block', SMALL_DRIPLEAF_BLOCK);
BLOCK_MAP.set('minecraft:big_dripleaf', BIG_DRIPLEAF_BLOCK);
BLOCK_MAP.set('minecraft:pumpkin_stem', PUMPKIN_STEM);
BLOCK_MAP.set('minecraft:melon_stem', MELON_STEM);
BLOCK_MAP.set('minecraft:sweet_berry_bush', SWEET_BERRY_BUSH);
BLOCK_MAP.set('minecraft:lilac', LILAC);
BLOCK_MAP.set('minecraft:peony', PEONY);
BLOCK_MAP.set('minecraft:rose_bush', ROSE_BUSH);
BLOCK_MAP.set('minecraft:sunflower', SUNFLOWER);
