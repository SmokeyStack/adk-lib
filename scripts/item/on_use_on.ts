import {
    Block,
    BlockPermutation,
    BlockStates,
    Dimension,
    Direction,
    ItemComponentUseOnEvent,
    ItemCustomComponent,
    ItemStack,
    Player,
    Vector3,
    world
} from '@minecraft/server';

class onUseOn implements ItemCustomComponent {
    constructor() {
        this.onUseOn = this.onUseOn.bind(this);
    }
    onUseOn(_componentData: ItemComponentUseOnEvent) {}
}

export class debug extends onUseOn {
    onUseOn(componentData: ItemComponentUseOnEvent) {
        world.sendMessage(`Source: ${componentData.source.typeId}`);
        world.sendMessage(
            `Used On Block Permutation: ${componentData.usedOnBlockPermutation.type.id}`
        );
        world.sendMessage(
            `Block: ${componentData.block.typeId} at (${componentData.block.location.x}, ${componentData.block.location.y}, ${componentData.block.location.z})`
        );
        world.sendMessage(`Block Face: ${componentData.blockFace}`);
        world.sendMessage(
            `Face Location: (${componentData.faceLocation.x}, ${componentData.faceLocation.y}, ${componentData.faceLocation.z})`
        );
        world.sendMessage(`Item: ${componentData.itemStack.typeId}`);
    }
}

export class useOnFertilizable extends onUseOn {
    onUseOn(componentData: ItemComponentUseOnEvent) {
        if (
            blockMap
                .get(componentData.block.typeId)
                ?.canGrow(
                    componentData.block.dimension,
                    componentData.block.location,
                    componentData.usedOnBlockPermutation
                ) &&
            blockMap
                .get(componentData.block.typeId)
                ?.isFertilizable(
                    componentData.block.dimension,
                    componentData.block.location,
                    componentData.usedOnBlockPermutation
                )
        ) {
            blockMap
                .get(componentData.block.typeId)
                ?.grow(
                    componentData.block.dimension,
                    componentData.block.location,
                    componentData.usedOnBlockPermutation
                );
            let player: Player = componentData.source as Player;
            if (player.getGameMode() == 'creative') return;

            let item = player
                .getComponent('inventory')
                .container.getItem(player.selectedSlot);

            if (item.amount == 1)
                player
                    .getComponent('inventory')
                    .container.setItem(player.selectedSlot, undefined);
            else
                player
                    .getComponent('inventory')
                    .container.setItem(
                        player.selectedSlot,
                        new ItemStack(item.typeId, item.amount - 1)
                    );
        }
    }
}

interface Fertilizable {
    isFertilizable(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean;
    canGrow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean;
    grow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): void;
}

class cropBlock implements Fertilizable {
    block: string;
    constructor(block: string) {
        this.block = block;
    }
    isFertilizable(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        let a: number = BlockStates.get('growth').validValues[
            BlockStates.get('growth').validValues.length - 1
        ] as number;

        let b: number = block_permutation.getState('growth') as number;

        return a != b;
    }
    canGrow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): void {
        let a: number = BlockStates.get('growth').validValues[
            BlockStates.get('growth').validValues.length - 1
        ] as number;
        let b: number =
            (block_permutation.getState('growth') as number) +
            (Math.random() * 4 + 2);
        if (b > a) {
            b = a;
        }
        dimension.setBlockPermutation(
            block_position,
            BlockPermutation.resolve(this.block, { growth: b })
        );
        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: block_position.x + 0.5,
            y: block_position.y + 0.5,
            z: block_position.z + 0.5
        });
    }
}

class torchflowerCrop extends cropBlock {
    grow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): void {
        let a: number = BlockStates.get('growth').validValues[
            BlockStates.get('growth').validValues.length - 1
        ] as number;
        let b: number = (block_permutation.getState('growth') as number) + 1;

        world.sendMessage(`Growth: ${block_permutation.getState('growth')}`);

        if (block_permutation.getState('growth') == 1) {
            dimension.setBlockType(block_position, 'minecraft:torchflower');
            return;
        }

        if (b > a) {
            b = a;
        }
        dimension.setBlockPermutation(
            block_position,
            BlockPermutation.resolve(this.block, { growth: b })
        );
        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: block_position.x + 0.5,
            y: block_position.y + 0.5,
            z: block_position.z + 0.5
        });
    }
}
class bambooBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        let j: number;
        let i: number = this.countBambooInRange(dimension, block_position, {
            x: 0,
            y: 1,
            z: 0
        });
        return (
            i +
                (j = this.countBambooInRange(dimension, block_position, {
                    x: 0,
                    y: -1,
                    z: 0
                })) +
                1 <
                16 &&
            dimension
                .getBlock(block_position)
                .above(i)
                .permutation.getState('age_bit') != 1
        );
    }

    canGrow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): void {
        let i: number = this.countBambooInRange(dimension, block_position, {
            x: 0,
            y: 1,
            z: 0
        });
        let j: number = this.countBambooInRange(dimension, block_position, {
            x: 0,
            y: -1,
            z: 0
        });
        let k: number = i + j + 1;
        let l: number = 1 + Math.random() * 2;
        for (let m: number = 0; m < l; ++m) {
            let blockPos: Block = dimension.getBlock(block_position).above(i);
            let blockState: BlockPermutation = blockPos.permutation;
            if (
                k >= 16 ||
                blockState.getState('age_bit') == 1 ||
                !blockPos.above().isAir
            ) {
                return;
            }
            this.updateLeaves(blockState, dimension, blockPos, k);
            ++i;
            ++k;
        }
        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: block_position.x + 0.5,
            y: block_position.y + 0.5,
            z: block_position.z + 0.5
        });
    }

    updateLeaves(
        state: BlockPermutation,
        world: Dimension,
        blockPos: Block,
        height: number
    ) {
        let blockState: BlockPermutation = blockPos.below().permutation;
        let blockState2: BlockPermutation = blockPos.below(2).permutation;
        let bambooLeaves: string = 'no_leaves';
        if (height >= 1) {
            if (
                blockState.type.id != 'minecraft:bamboo' ||
                blockState.getState('bamboo_leaf_size') == 'no_leaves'
            ) {
                bambooLeaves = 'small_leaves';
            } else if (
                blockState.type.id == 'minecraft:bamboo' &&
                blockState.getState('bamboo_leaf_size') != 'no_leaves'
            ) {
                bambooLeaves = 'large_leaves';
                if (blockState2.type.id == 'minecraft:bamboo') {
                    world.setBlockPermutation(
                        blockPos.below(),
                        blockState.withState('bamboo_leaf_size', 'small_leaves')
                    );
                    world.setBlockPermutation(
                        blockPos.below(2),
                        blockState2.withState('bamboo_leaf_size', 'no_leaves')
                    );
                }
            }
        }
        let i: string =
            state.getState('bamboo_stalk_thickness') == 'thick' ||
            blockState2.type.id == 'minecraft:bamboo'
                ? 'thick'
                : 'thin';
        let j: number =
            (height >= 11 && Math.random() < 0.25) || height == 15 ? 1 : 0;
        world.setBlockPermutation(
            blockPos.above(),
            BlockPermutation.resolve('minecraft:bamboo', {
                bamboo_stalk_thickness: i,
                bamboo_leaf_size: bambooLeaves,
                age_bit: j
            })
        );
    }

    countBambooInRange(world: Dimension, pos: Vector3, direction: Vector3) {
        let i: number;

        for (
            i = 0;
            i < 16 &&
            world.getBlock({
                x: pos.x + direction.x * (i + 1),
                y: pos.y + direction.y * (i + 1),
                z: pos.z + direction.z * (i + 1)
            }).typeId == 'minecraft:bamboo';
            ++i
        ) {}

        return i;
    }
}

class bambooShoot implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return dimension.getBlock(block_position).above().isAir;
    }

    canGrow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): void {
        dimension.getBlock(block_position).above().setType('minecraft:bamboo');
        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: block_position.x + 0.5,
            y: block_position.y + 0.5,
            z: block_position.z + 0.5
        });
    }
}

class cocoaBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        let i: number = block_permutation.getState('age') as number;
        return i < 2;
    }

    canGrow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): void {
        dimension.setBlockPermutation(
            block_position,
            BlockPermutation.resolve('minecraft:cocoa', {
                age: (block_permutation.getState('age') as number) + 1
            })
        );
        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: block_position.x + 0.5,
            y: block_position.y + 0.5,
            z: block_position.z + 0.5
        });
    }
}

class flowerBed implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    canGrow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): void {
        let i: number = block_permutation.getState('growth') as number;
        if (i < 4) {
            dimension.setBlockPermutation(
                block_position,
                BlockPermutation.resolve('minecraft:pink_petals', {
                    growth: i + 1
                })
            );
        } else {
            dimension.spawnItem(
                new ItemStack('minecraft:pink_petals', 1),
                block_position
            );
        }
        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: block_position.x + 0.5,
            y: block_position.y + 0.5,
            z: block_position.z + 0.5
        });
    }
}

class mangroveLeaves implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return dimension.getBlock(block_position).below().isAir;
    }

    canGrow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): void {
        dimension
            .getBlock(block_position)
            .below()
            .setPermutation(
                BlockPermutation.resolve('mangrove_propagule', {
                    hanging: true
                })
            );
        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: block_position.x + 0.5,
            y: block_position.y + 0.5,
            z: block_position.z + 0.5
        });
    }
}

class netherrackBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        if (!dimension.getBlock(block_position).isAir) return false;

        for (let a: number = -1; a <= 1; a++) {
            for (let b: number = -1; b <= 1; b++) {
                for (let c: number = -1; c <= 1; c++) {
                    let id: string = dimension.getBlock({
                        x: block_position.x + a,
                        y: block_position.y + c,
                        z: block_position.z + b
                    }).typeId;
                    if (
                        id == 'minecraft:crimson_nylium' ||
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
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): void {
        let bl: boolean = false;
        let bl2: boolean = false;

        for (let a: number = -1; a <= 1; a++) {
            for (let b: number = -1; b <= 1; b++) {
                for (let c: number = -1; c <= 1; c++) {
                    let id: string = dimension.getBlock({
                        x: block_position.x + a,
                        y: block_position.y + c,
                        z: block_position.z + b
                    }).typeId;
                    if (id == 'minecraft:warped_nylium') {
                        bl2 = true;
                    }
                    if (id == 'minecraft:crimson_nylium') {
                        bl = true;
                    }

                    if (!bl2 || !bl) continue;
                    break;
                }
            }
        }

        if (bl2 && bl) {
            world.sendMessage('Both');
            let rand = Math.random();
            dimension.setBlockType(
                block_position,
                Math.random() < 0.5
                    ? 'minecraft:warped_nylium'
                    : 'minecraft:crimson_nylium'
            );
        } else if (bl2) {
            dimension.setBlockType(block_position, 'minecraft:warped_nylium');
        } else if (bl) {
            dimension.setBlockType(block_position, 'minecraft:crimson_nylium');
        }
        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: block_position.x + 0.5,
            y: block_position.y + 1.5,
            z: block_position.z + 0.5
        });
    }
}

class rootedDirt implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return dimension.getBlock(block_position).below().isAir;
    }

    canGrow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): void {
        dimension.setBlockType(block_position, 'minecraft:hanging_roots');
        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: block_position.x + 0.5,
            y: block_position.y + 0.5,
            z: block_position.z + 0.5
        });
    }
}

class pitcherCrop implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return !block_permutation.getState('upper_block_bit') as boolean;
    }

    canGrow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): void {
        let i: number = Math.min(
            (block_permutation.getState('growth') as number) + 1,
            4
        );
        if (this.isFullyGrown(block_permutation)) {
            return;
        }
        let blockState: BlockPermutation = block_permutation.withState(
            'growth',
            i
        );
        dimension.setBlockPermutation(block_position, blockState);
        if (this.isDoubleTallAtAge(i)) {
            dimension
                .getBlock(block_position)
                .above()
                .setPermutation(blockState.withState('upper_block_bit', true));
        }
        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: block_position.x + 0.5,
            y: block_position.y + 0.5,
            z: block_position.z + 0.5
        });
    }

    isFullyGrown(state: BlockPermutation) {
        return state.getState('age') == 4;
    }

    isDoubleTallAtAge(age: number) {
        return age >= 3;
    }
}

class seagrassBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    canGrow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): void {
        let block_state: BlockPermutation = block_permutation.withState(
            'sea_grass_type',
            'double_bot'
        );
        let block_state2: BlockPermutation = block_permutation.withState(
            'sea_grass_type',
            'double_top'
        );

        if (
            dimension.getBlock(block_position).above().typeId ==
            'minecraft:water'
        ) {
            dimension.setBlockPermutation(block_position, block_state);
            dimension.setBlockPermutation(
                dimension.getBlock(block_position).above(),
                block_state2
            );

            dimension.spawnParticle('minecraft:crop_growth_emitter', {
                x: block_position.x + 0.5,
                y: block_position.y + 0.5,
                z: block_position.z + 0.5
            });
        }
    }
}

class seaPickleBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    canGrow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): void {
        let re = new RegExp('^minecraft:(?!dead_).*_coral_block$');

        if (
            !block_permutation.getState('dead_bit') &&
            re.exec(dimension.getBlock(block_position).below().typeId)
        ) {
            let j: number = 1;
            let k: number = 2;
            let l: number = 0;
            let m: number = block_position.x - 2;
            let n: number = 0;
            for (let o: number = 0; o < 5; ++o) {
                for (let p: number = 0; p < j; ++p) {
                    let q: number = 2 + block_position.y - 1;
                    for (let r: number = q - 2; r < q; ++r) {
                        let block_pos: Vector3 = {
                            x: m + o,
                            y: r,
                            z: block_position.z - n + p
                        };

                        if (
                            areVectorsEqual(block_pos, block_position) ||
                            Math.floor(Math.random() * 6) != 0 ||
                            dimension.getBlock(block_pos).typeId !=
                                'minecraft:water' ||
                            !re.exec(
                                dimension.getBlock(block_pos).below().typeId
                            )
                        )
                            continue;

                        dimension.setBlockPermutation(
                            block_pos,
                            block_permutation.withState(
                                'cluster_count',
                                Math.random() * 3
                            )
                        );
                    }
                }
                if (l < 2) {
                    j += 2;
                    ++n;
                } else {
                    j -= 2;
                    --n;
                }
                ++l;
            }
            dimension.setBlockPermutation(
                block_position,
                block_permutation.withState('cluster_count', 3)
            );

            dimension.spawnParticle('minecraft:crop_growth_emitter', {
                x: block_position.x + 0.5,
                y: block_position.y + 0.5,
                z: block_position.z + 0.5
            });
        }
    }
}

class grassBlock implements Fertilizable {
    isFertilizable(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    canGrow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): boolean {
        return true;
    }

    grow(
        dimension: Dimension,
        block_position: Vector3,
        block_permutation: BlockPermutation
    ): void {
        if (!dimension.getBlock(block_position).above().isAir) return;

        if (
            dimension.getBlock(block_position).typeId == 'minecraft:short_grass'
        ) {
            dimension.setBlockType(block_position, 'minecraft:tall_grass');
        }

        if (dimension.getBlock(block_position).typeId == 'minecraft:fern') {
            dimension.setBlockType(block_position, 'minecraft:large_fern');
        }

        dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: block_position.x + 0.5,
            y: block_position.y + 0.5,
            z: block_position.z + 0.5
        });
    }
}

const blockMap = new Map<string, Fertilizable>();

const wheat = new cropBlock('minecraft:wheat');
const beetroot = new cropBlock('minecraft:beetroot');
const carrots = new cropBlock('minecraft:carrots');
const potatoes = new cropBlock('minecraft:potatoes');
const torchflower_crop = new torchflowerCrop('minecraft:torchflower_crop');
const bamboo = new bambooBlock();
const bamboo_sapling = new bambooShoot();
const cocoa = new cocoaBlock();
const pink_petals = new flowerBed();
const mangrove_propagule = new mangroveLeaves();
const netherrack = new netherrackBlock();
const pitcher = new pitcherCrop();
const seagrass = new seagrassBlock();
const sea_pickle = new seaPickleBlock();
const short_grass = new grassBlock();
const fern = new grassBlock();

blockMap.set('minecraft:wheat', wheat);
blockMap.set('minecraft:beetroot', beetroot);
blockMap.set('minecraft:carrots', carrots);
blockMap.set('minecraft:potatoes', potatoes);
blockMap.set('minecraft:torchflower_crop', torchflower_crop);
blockMap.set('minecraft:bamboo', bamboo);
blockMap.set('minecraft:bamboo_sapling', bamboo_sapling);
blockMap.set('minecraft:cocoa', cocoa);
blockMap.set('minecraft:pink_petals', pink_petals);
blockMap.set('minecraft:mangrove_leaves', mangrove_propagule);
blockMap.set('minecraft:netherrack', netherrack);
blockMap.set('minecraft:pitcher_crop', pitcher);
blockMap.set('minecraft:seagrass', seagrass);
blockMap.set('minecraft:sea_pickle', sea_pickle);
blockMap.set('minecraft:short_grass', short_grass);
blockMap.set('minecraft:fern', fern);

function directionToVector3(direction: Direction): Vector3 {
    switch (direction) {
        case Direction.Down:
            return { x: 0, y: -1, z: 0 };
        case Direction.Up:
            return { x: 0, y: 1, z: 0 };
        case Direction.North:
            return { x: 0, y: 0, z: -1 };
        case Direction.South:
            return { x: 0, y: 0, z: 1 };
        case Direction.West:
            return { x: -1, y: 0, z: 0 };
        case Direction.East:
            return { x: 1, y: 0, z: 0 };
    }
}

function areVectorsEqual(v1: Vector3, v2: Vector3): boolean {
    return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
}

function setLiquidBlock(type: string, dimension: Dimension, location: Vector3) {
    dimension.setBlockType(location, type);
}

export class useOnBucket extends onUseOn {
    onUseOn(componentData: ItemComponentUseOnEvent) {
        let block_location: Vector3 = componentData.block.offset(
            directionToVector3(componentData.blockFace)
        );

        componentData.source.dimension.setBlockType(
            block_location,
            'minecraft:water'
        );

        if (
            componentData.source.dimension.getBlock(block_location).above()
                .typeId == 'minecraft:air'
        ) {
            setLiquidBlock('minecraft:water', componentData.source.dimension, {
                x: block_location.x,
                y: block_location.y + 1,
                z: block_location.z
            });
            setLiquidBlock('minecraft:air', componentData.source.dimension, {
                x: block_location.x,
                y: block_location.y + 1,
                z: block_location.z
            });
        }

        if (
            componentData.source.dimension.getBlock(block_location).below()
                .typeId == 'minecraft:air'
        ) {
            setLiquidBlock('minecraft:water', componentData.source.dimension, {
                x: block_location.x,
                y: block_location.y - 1,
                z: block_location.z
            });
            setLiquidBlock('minecraft:air', componentData.source.dimension, {
                x: block_location.x,
                y: block_location.y - 1,
                z: block_location.z
            });
        }

        if (
            componentData.source.dimension.getBlock(block_location).north()
                .typeId == 'minecraft:air'
        ) {
            setLiquidBlock('minecraft:water', componentData.source.dimension, {
                x: block_location.x,
                y: block_location.y,
                z: block_location.z - 1
            });
            setLiquidBlock('minecraft:air', componentData.source.dimension, {
                x: block_location.x,
                y: block_location.y,
                z: block_location.z - 1
            });
        }

        if (
            componentData.source.dimension.getBlock(block_location).south()
                .typeId == 'minecraft:air'
        ) {
            setLiquidBlock('minecraft:water', componentData.source.dimension, {
                x: block_location.x,
                y: block_location.y,
                z: block_location.z + 1
            });
            setLiquidBlock('minecraft:air', componentData.source.dimension, {
                x: block_location.x,
                y: block_location.y,
                z: block_location.z + 1
            });
        }

        if (
            componentData.source.dimension.getBlock(block_location).west()
                .typeId == 'minecraft:air'
        ) {
            setLiquidBlock('minecraft:water', componentData.source.dimension, {
                x: block_location.x - 1,
                y: block_location.y,
                z: block_location.z
            });
            setLiquidBlock('minecraft:air', componentData.source.dimension, {
                x: block_location.x - 1,
                y: block_location.y,
                z: block_location.z
            });
        }

        if (
            componentData.source.dimension.getBlock(block_location).east()
                .typeId == 'minecraft:air'
        ) {
            setLiquidBlock('minecraft:water', componentData.source.dimension, {
                x: block_location.x + 1,
                y: block_location.y,
                z: block_location.z
            });
            setLiquidBlock('minecraft:air', componentData.source.dimension, {
                x: block_location.x + 1,
                y: block_location.y,
                z: block_location.z
            });
        }
    }
}
