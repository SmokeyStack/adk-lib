import {
    Dimension,
    Vector3,
    BlockPermutation,
    BlockStates,
    Block,
    ItemStack,
    BlockStateType
} from '@minecraft/server';
import * as adk from 'adk-scripts-server';
import type * as minecraftvanilladata from '@minecraft/vanilla-data';

interface Fertilizable {
    isFertilizable(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean;
    canGrow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
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
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        const block_state: BlockStateType | undefined =
            BlockStates.get('growth');
        if (!block_state) return false;

        const max_growth: number = block_state.validValues[
            block_state.validValues.length - 1
        ] as number;
        const current_growth: number = block_permutation.getState(
            'growth'
        ) as number;

        return max_growth != current_growth;
    }
    canGrow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }
    grow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): void {
        const block_state: BlockStateType | undefined =
            BlockStates.get('growth');
        if (!block_state) return;
        const max_growth: number = block_state.validValues[
            block_state.validValues.length - 1
        ] as number;
        let next_growth: number =
            (block_permutation.getState('growth') as number) +
            (Math.random() * 4 + 2);

        if (next_growth > max_growth) next_growth = max_growth;

        dimension.setBlockPermutation(
            block_location,
            BlockPermutation.resolve(this.block, { growth: next_growth })
        );
        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: block_location.x + 0.5,
            y: block_location.y + 0.5,
            z: block_location.z + 0.5
        });
    }
}

class TorchFlowerCrop extends CropBlock {
    grow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): void {
        const block_state: BlockStateType | undefined =
            BlockStates.get('growth');
        if (!block_state) return;
        const max_growth: number = block_state.validValues[
            block_state.validValues.length - 1
        ] as number;
        let current_growth: number =
            (block_permutation.getState('growth') as number) + 1;

        if (block_permutation.getState('growth') == 1) {
            dimension.setBlockType(block_location, 'minecraft:torchflower');
            return;
        }

        if (current_growth > max_growth) current_growth = max_growth;

        dimension.setBlockPermutation(
            block_location,
            BlockPermutation.resolve(this.block, { growth: current_growth })
        );
        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: block_location.x + 0.5,
            y: block_location.y + 0.5,
            z: block_location.z + 0.5
        });
    }
}

class BambooBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        const bamboos_above: number = this.countBambooInRange(
            dimension,
            block_location,
            {
                x: 0,
                y: 1,
                z: 0
            }
        );

        return (
            bamboos_above +
                this.countBambooInRange(dimension, block_location, {
                    x: 0,
                    y: -1,
                    z: 0
                }) +
                1 <
                16 &&
            dimension
                .getBlock(block_location)
                ?.above(bamboos_above)
                ?.permutation.getState(
                    'age_bit' as keyof minecraftvanilladata.BlockStateSuperset
                ) != 1
        );
    }

    canGrow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): void {
        let bamboos_above: number = this.countBambooInRange(
            dimension,
            block_location,
            {
                x: 0,
                y: 1,
                z: 0
            }
        );
        const bamboos_below: number = this.countBambooInRange(
            dimension,
            block_location,
            {
                x: 0,
                y: -1,
                z: 0
            }
        );
        let total_bamboo: number = bamboos_above + bamboos_below + 1;
        let amount_to_grow: number = 1 + Math.random() * 2;

        for (let a: number = 0; a < amount_to_grow; ++a) {
            const block: Block | undefined = dimension.getBlock(block_location);
            if (!block) return;
            const block_above: Block | undefined = block.above(bamboos_above);
            if (!block_above) return;

            const block_state: BlockPermutation = block_above.permutation;

            if (
                total_bamboo >= 16 ||
                block_state.getState(
                    'age_bit' as keyof minecraftvanilladata.BlockStateSuperset
                ) == 1 ||
                !block_above.above()?.isAir
            )
                return;

            this.updateLeaves(
                block_state,
                dimension,
                block_above,
                total_bamboo
            );
            ++bamboos_above;
            ++total_bamboo;
        }

        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: block_location.x + 0.5,
            y: block_location.y + 0.5,
            z: block_location.z + 0.5
        });
    }

    updateLeaves(
        block_permutation: BlockPermutation,
        dimension: Dimension,
        block: Block,
        height: number
    ) {
        const block_below: Block | undefined = block.below();
        if (!block_below) return;
        const block_below_permutation: BlockPermutation =
            block_below.permutation;
        const block_below_2: Block | undefined = block.below(2);
        if (!block_below_2) return;
        const block_below_permutation_2: BlockPermutation =
            block_below_2.permutation;
        let bamboo_leaves: string = 'no_leaves';

        if (height >= 1) {
            if (
                block_below_permutation.type.id != 'minecraft:bamboo' ||
                block_below_permutation.getState('bamboo_leaf_size') ==
                    'no_leaves'
            )
                bamboo_leaves = 'small_leaves';
            else if (
                block_below_permutation.type.id == 'minecraft:bamboo' &&
                block_below_permutation.getState('bamboo_leaf_size') !=
                    'no_leaves'
            ) {
                bamboo_leaves = 'large_leaves';

                if (block_below_permutation_2.type.id == 'minecraft:bamboo') {
                    dimension.setBlockPermutation(
                        block_below,
                        block_below_permutation.withState(
                            'bamboo_leaf_size',
                            'small_leaves'
                        )
                    );
                    dimension.setBlockPermutation(
                        block_below_2,
                        block_below_permutation_2.withState(
                            'bamboo_leaf_size',
                            'no_leaves'
                        )
                    );
                }
            }
        }

        const new_bamboo_leaves: string =
            block_permutation.getState('bamboo_stalk_thickness') == 'thick' ||
            block_below_permutation_2.type.id == 'minecraft:bamboo'
                ? 'thick'
                : 'thin';
        const age_bit: boolean =
            (height >= 11 && Math.random() < 0.25) || height == 15
                ? true
                : false;
        const block_above: Block | undefined = block.above();
        if (!block_above) return;
        dimension.setBlockPermutation(
            block_above,
            BlockPermutation.resolve('minecraft:bamboo', {
                bamboo_stalk_thickness: new_bamboo_leaves,
                bamboo_leaf_size: bamboo_leaves,
                age_bit: age_bit
            })
        );
    }

    countBambooInRange(
        dimension: Dimension,
        block_location: Vector3,
        direction: Vector3
    ) {
        let a: number;

        for (
            a = 0;
            a < 16 &&
            (() => {
                const block: Block | undefined = dimension.getBlock({
                    x: block_location.x + direction.x * (a + 1),
                    y: block_location.y + direction.y * (a + 1),
                    z: block_location.z + direction.z * (a + 1)
                });
                return block != undefined && block.typeId == 'minecraft:bamboo';
            });
            ++a
        ) {}

        return a;
    }
}

class BambooSapling implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        const block: Block | undefined = dimension.getBlock(block_location);
        if (!block) return false;
        const block_above: Block | undefined = block.above();
        if (!block_above) return false;

        return block_above.isAir;
    }

    canGrow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): void {
        const block: Block | undefined = dimension.getBlock(block_location);
        if (!block) return;
        const block_above: Block | undefined = block.above();
        if (!block_above) return;

        block_above.setType('minecraft:bamboo');
        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: block_location.x + 0.5,
            y: block_location.y + 0.5,
            z: block_location.z + 0.5
        });
    }
}

class CocoaBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return (block_permutation.getState('age') as number) < 2;
    }

    canGrow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): void {
        const block_state: BlockPermutation = block_permutation.withState(
            'age',
            (block_permutation.getState('age') as number) + 1
        );
        dimension.setBlockPermutation(block_location, block_state);
        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: block_location.x + 0.5,
            y: block_location.y + 0.5,
            z: block_location.z + 0.5
        });
    }
}

class FlowerBedBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    canGrow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): void {
        const current_growth: number = block_permutation.getState(
            'growth'
        ) as number;

        if (current_growth < 4)
            dimension.setBlockPermutation(
                block_location,
                BlockPermutation.resolve('minecraft:pink_petals', {
                    growth: current_growth + 1
                })
            );
        else
            dimension.spawnItem(
                new ItemStack('minecraft:pink_petals', 1),
                block_location
            );

        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: block_location.x + 0.5,
            y: block_location.y + 0.5,
            z: block_location.z + 0.5
        });
    }
}

class MangroveLeavesBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        const block: Block | undefined = dimension.getBlock(block_location);
        if (!block) return false;
        const block_below: Block | undefined = block.below();
        if (!block_below) return false;

        return block_below.isAir;
    }

    canGrow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): void {
        const block: Block | undefined = dimension.getBlock(block_location);
        if (!block) return;
        const block_below: Block | undefined = block.below();
        if (!block_below) return;

        block_below.setPermutation(
            BlockPermutation.resolve('mangrove_propagule', {
                hanging: true
            })
        );
        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: block_location.x + 0.5,
            y: block_location.y + 0.5,
            z: block_location.z + 0.5
        });
    }
}

class NetherrackBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        for (let a: number = -1; a <= 1; a++) {
            for (let b: number = -1; b <= 1; b++) {
                for (let c: number = -1; c <= 1; c++) {
                    const block: Block | undefined = dimension.getBlock({
                        x: block_location.x + a,
                        y: block_location.y + c,
                        z: block_location.z + b
                    });
                    if (!block) continue;
                    const id: string = block.typeId;
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
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): void {
        let block1: boolean = false;
        let block2: boolean = false;

        for (let a: number = -1; a <= 1; a++) {
            for (let b: number = -1; b <= 1; b++) {
                for (let c: number = -1; c <= 1; c++) {
                    const block: Block | undefined = dimension.getBlock({
                        x: block_location.x + a,
                        y: block_location.y + c,
                        z: block_location.z + b
                    });
                    if (!block) continue;
                    let id: string = block.typeId;

                    if (id == 'minecraft:warped_nylium') block2 = true;
                    if (id == 'minecraft:crimson_nylium') block1 = true;
                    if (!block2 || !block1) continue;
                    break;
                }
            }
        }

        if (block2 && block1)
            dimension.setBlockType(
                block_location,
                Math.random() < 0.5
                    ? 'minecraft:warped_nylium'
                    : 'minecraft:crimson_nylium'
            );
        else if (block2)
            dimension.setBlockType(block_location, 'minecraft:warped_nylium');
        else if (block1)
            dimension.setBlockType(block_location, 'minecraft:crimson_nylium');

        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: block_location.x + 0.5,
            y: block_location.y + 1.5,
            z: block_location.z + 0.5
        });
    }
}

class RootedDirtBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        const block: Block | undefined = dimension.getBlock(block_location);
        if (!block) return false;
        const block_below: Block | undefined = block.below();
        if (!block_below) return false;

        return block_below.isAir;
    }

    canGrow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): void {
        block_location.y--;
        dimension.setBlockType(block_location, 'minecraft:hanging_roots');
        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: block_location.x + 0.5,
            y: block_location.y + 0.5,
            z: block_location.z + 0.5
        });
    }
}

class PitcherCropBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        if (block_permutation.getState('upper_block_bit')) return false;

        return this.canGrow2(
            dimension,
            block_location,
            block_permutation,
            (block_permutation.getState('growth') as number) + 1
        );
    }

    canGrow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): void {
        const amount_to_grow: number = Math.min(
            (block_permutation.getState('growth') as number) + 1,
            4
        );

        if (this.isFullyGrown(block_permutation)) return;

        const block_state: BlockPermutation = block_permutation.withState(
            'growth',
            amount_to_grow
        );
        dimension.setBlockPermutation(block_location, block_state);

        if (this.isDoubleTallAtAge(amount_to_grow)) {
            const block: Block | undefined = dimension.getBlock(block_location);
            if (!block) return;
            const block_above: Block | undefined = block.above();
            if (!block_above) return;

            block_above.setPermutation(
                block_state.withState('upper_block_bit', true)
            );
        }

        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: block_location.x + 0.5,
            y: block_location.y + 0.5,
            z: block_location.z + 0.5
        });
    }

    isFullyGrown(block_permutation: BlockPermutation): boolean {
        return block_permutation.getState('growth') == 4;
    }

    isDoubleTallAtAge(age: number): boolean {
        return age >= 3;
    }

    canGrowAt(dimension: Dimension, block_location: Vector3): boolean {
        const block: Block | undefined = dimension.getBlock(block_location);
        if (!block) return false;

        return block.isAir || block.typeId == 'minecraft:pitcher_crop';
    }

    canGrow2(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation,
        age: number
    ): boolean {
        block_location.y++;
        return (
            !this.isFullyGrown(block_permutation) &&
            (!this.isDoubleTallAtAge(age) ||
                this.canGrowAt(dimension, block_location))
        );
    }
}

class SeagrassBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    canGrow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): void {
        const block_state: BlockPermutation = block_permutation.withState(
            'sea_grass_type',
            'double_bot'
        );
        const block_state_2: BlockPermutation = block_permutation.withState(
            'sea_grass_type',
            'double_top'
        );
        const block: Block | undefined = dimension.getBlock(block_location);
        if (!block) return;
        const block_above: Block | undefined = block.above();
        if (!block_above) return;

        if (block_above.typeId == 'minecraft:water') {
            dimension.setBlockPermutation(block_location, block_state);
            dimension.setBlockPermutation(block_above, block_state_2);
            dimension.spawnParticle('minecraft:crop_growth_emitter', {
                x: block_location.x + 0.5,
                y: block_location.y + 0.5,
                z: block_location.z + 0.5
            });
        }
    }
}

class SeaPickleBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    canGrow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): void {
        const regex = new RegExp('^minecraft:(?!dead_).*_coral_block$');
        const block: Block | undefined = dimension.getBlock(block_location);
        if (!block) return;
        const block_below: Block | undefined = block.below();
        if (!block_below) return;

        if (
            !block_permutation.getState('dead_bit') &&
            regex.exec(block_below.typeId)
        ) {
            let a: number = 1;
            let b: number = 0;
            const c: number = block_location.x - 2;
            let d: number = 0;
            for (let e: number = 0; e < 5; ++e) {
                for (let f: number = 0; f < a; ++f) {
                    let g: number = 2 + block_location.y - 1;

                    for (let h: number = g - 2; h < g; ++h) {
                        const new_block_location: Vector3 = {
                            x: c + e,
                            y: h,
                            z: block_location.z - d + f
                        };
                        const new_block: Block | undefined =
                            dimension.getBlock(new_block_location);
                        if (!new_block) continue;
                        const new_block_below: Block | undefined =
                            new_block.below();
                        if (!new_block_below) continue;

                        if (
                            adk.Vector3Helper.equals(
                                new_block_location,
                                block_location
                            ) ||
                            Math.floor(Math.random() * 6) != 0 ||
                            new_block.typeId != 'minecraft:water' ||
                            !regex.exec(new_block_below.typeId)
                        )
                            continue;

                        dimension.setBlockPermutation(
                            new_block_location,
                            block_permutation.withState(
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
                block_location,
                block_permutation.withState('cluster_count', 3)
            );
            dimension.spawnParticle('minecraft:crop_growth_emitter', {
                x: block_location.x + 0.5,
                y: block_location.y + 0.5,
                z: block_location.z + 0.5
            });
        }
    }
}

class GrassBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    canGrow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): void {
        const block: Block | undefined = dimension.getBlock(block_location);
        if (!block) return;
        const block_above: Block | undefined = block.above();
        if (!block_above) return;
        if (!block_above.isAir) return;
        if (block.typeId == 'minecraft:short_grass')
            dimension.setBlockType(block_location, 'minecraft:tall_grass');
        if (block.typeId == 'minecraft:fern')
            dimension.setBlockType(block_location, 'minecraft:large_fern');

        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: block_location.x + 0.5,
            y: block_location.y + 0.5,
            z: block_location.z + 0.5
        });
    }
}

class SmallDripLeafBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    canGrow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): void {
        if (block_permutation.getState('upper_block_bit') == false)
            this.bigDripleafBlockGrow(
                dimension,
                block_location,
                block_permutation.getState(
                    'minecraft:cardinal_direction'
                ) as string
            );
        else {
            block_location.y--;
            this.bigDripleafBlockGrow(
                dimension,
                block_location,
                block_permutation.getState(
                    'minecraft:cardinal_direction'
                ) as string
            );
        }

        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: block_location.x + 0.5,
            y: block_location.y + 0.5,
            z: block_location.z + 0.5
        });
    }

    bigDripleafBlockGrow(
        dimension: Dimension,
        block_location: Vector3,
        direction: string
    ): void {
        let a: number;
        const b: number = Math.floor(Math.random() * 4) + 2;
        const block_location_copy: adk.Vector3Builder = new adk.Vector3Builder(
            block_location
        );

        for (
            a = 0;
            a < b &&
            (() => {
                const block: Block | undefined =
                    dimension.getBlock(block_location_copy);
                return (
                    block != undefined &&
                    this.bigDripleafBlockCanGrowInto(
                        dimension,
                        block_location_copy,
                        block
                    )
                );
            });
            ++a
        )
            block_location_copy.y++;

        const c: number = block_location.y + a - 1;
        block_location_copy.y = block_location.y;

        while (block_location_copy.y < c) {
            this.bigDripleafStemBlockPlaceStemAt(
                dimension,
                block_location_copy,
                direction
            );
            block_location_copy.y++;
        }

        this.bigDripleafBlockPlaceDripleafAt(
            dimension,
            block_location_copy,
            direction
        );
    }

    bigDripleafBlockCanGrowInto(
        dimension: Dimension,
        block_location: Vector3,
        block: Block
    ): boolean {
        return (
            !(dimension.heightRange.max < block_location.y) &&
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
        block_location: Vector3,
        direction: string
    ): void {
        dimension.setBlockPermutation(
            block_location,
            BlockPermutation.resolve('minecraft:big_dripleaf', {
                'minecraft:cardinal_direction': direction,
                big_dripleaf_head: false
            })
        );
    }

    bigDripleafBlockPlaceDripleafAt(
        dimension: Dimension,
        block_location: Vector3,
        direction: string
    ): void {
        dimension.setBlockPermutation(
            block_location,
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
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        const block: Block | undefined = dimension.getBlock(block_location);
        if (!block) return false;
        const block_above: Block | undefined = block.above();
        if (!block_above) return false;

        if (block_permutation.getState('big_dripleaf_head'))
            return this.bigDripleafBlockCanGrowInto2(block_above);
        else {
            let head_location: Vector3 | null = this.findColumnEnd(
                dimension,
                block_location,
                block_permutation,
                1,
                'minecraft:big_dripleaf'
            );

            if (head_location == null) return false;

            const block_location_copy: adk.Vector3Builder =
                new adk.Vector3Builder(head_location);
            block_location_copy.y++;
            const block_copy: Block | undefined =
                dimension.getBlock(block_location_copy);
            if (!block_copy) return false;

            return this.bigDripleafBlockCanGrowInto(
                dimension,
                block_location_copy,
                block_copy
            );
        }
    }

    canGrow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): void {
        if (block_permutation.getState('big_dripleaf_head')) {
            const block_location_copy: adk.Vector3Builder =
                new adk.Vector3Builder(block_location);
            block_location_copy.y++;
            const block: Block | undefined =
                dimension.getBlock(block_location_copy);
            if (!block) return;

            if (
                this.bigDripleafBlockCanGrowInto(
                    dimension,
                    block_location_copy,
                    block
                )
            ) {
                let direction: string = block_permutation.getState(
                    'minecraft:cardinal_direction'
                ) as string;
                this.bigDripleafStemBlockPlaceStemAt(
                    dimension,
                    block_location,
                    direction
                );
                this.bigDripleafBlockPlaceDripleafAt(
                    dimension,
                    block_location_copy,
                    direction
                );
            }
        } else {
            let head_location: Vector3 | null = this.findColumnEnd(
                dimension,
                block_location,
                block_permutation,
                1,
                'minecraft:big_dripleaf'
            );

            if (head_location == null) return;

            const block_location_copy: adk.Vector3Builder =
                new adk.Vector3Builder(head_location);
            block_location_copy.y++;
            const block: Block | undefined =
                dimension.getBlock(block_location_copy);
            if (!block) return;
            const block_location_copy_2: adk.Vector3Builder =
                new adk.Vector3Builder(block_location_copy);
            block_location_copy_2.y++;
            const block_2: Block | undefined = dimension.getBlock(
                block_location_copy_2
            );
            if (!block_2) return;
            let direction: string = block_permutation.getState(
                'minecraft:cardinal_direction'
            ) as string;
            this.bigDripleafStemBlockPlaceStemAt(
                dimension,
                block_location_copy,
                direction
            );
            this.bigDripleafBlockPlaceDripleafAt(
                dimension,
                block_location_copy_2,
                direction
            );
        }

        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: block_location.x + 0.5,
            y: block_location.y + 0.5,
            z: block_location.z + 0.5
        });
    }

    bigDripleafBlockCanGrowInto(
        dimension: Dimension,
        block_location: Vector3,
        block: Block
    ): boolean {
        return (
            !(dimension.heightRange.max < block_location.y) &&
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
        block_location: Vector3,
        direction: string
    ): void {
        dimension.setBlockPermutation(
            block_location,
            BlockPermutation.resolve('minecraft:big_dripleaf', {
                'minecraft:cardinal_direction': direction,
                big_dripleaf_head: false
            })
        );
    }

    bigDripleafBlockPlaceDripleafAt(
        dimension: Dimension,
        block_location: Vector3,
        direction: string
    ): void {
        dimension.setBlockPermutation(
            block_location,
            BlockPermutation.resolve('minecraft:big_dripleaf', {
                'minecraft:cardinal_direction': direction,
                big_dripleaf_head: true
            })
        );
    }

    findColumnEnd(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation,
        direction: number,
        end_block: string
    ): Vector3 | null {
        const block_location_copy: adk.Vector3Builder = new adk.Vector3Builder(
            block_location
        );
        block_location_copy.y++;
        const block: Block | undefined =
            dimension.getBlock(block_location_copy);
        if (!block) return null;

        do {
            block_location_copy.y += direction;
        } while (block.permutation == block_permutation);
        if (block.typeId == end_block) return block_location_copy;

        return null;
    }
}

class StemBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return block_permutation.getState('growth') != 7;
    }

    canGrow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): void {
        const amount_to_grow: number = Math.min(
            7,
            (block_permutation.getState('growth') as number) +
                Math.floor(Math.random() * 4 + 2)
        );
        const block_state: BlockPermutation = block_permutation.withState(
            'growth',
            amount_to_grow
        );
        dimension.setBlockPermutation(block_location, block_state);
        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: block_location.x + 0.5,
            y: block_location.y + 0.5,
            z: block_location.z + 0.5
        });
    }
}

class SweetBerryBush implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return (block_permutation.getState('growth') as number) < 3;
    }

    canGrow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): void {
        const amount_to_grow: number = Math.min(
            3,
            (block_permutation.getState('growth') as number) + 1
        );
        const block_state: BlockPermutation = block_permutation.withState(
            'growth',
            amount_to_grow
        );
        dimension.setBlockPermutation(block_location, block_state);
        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: block_location.x + 0.5,
            y: block_location.y + 0.5,
            z: block_location.z + 0.5
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
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    canGrow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        block_location: Vector3,
        block_permutation: BlockPermutation
    ): void {
        dimension.spawnItem(new ItemStack(this.block), block_location);
        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: block_location.x + 0.5,
            y: block_location.y + 0.5,
            z: block_location.z + 0.5
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
