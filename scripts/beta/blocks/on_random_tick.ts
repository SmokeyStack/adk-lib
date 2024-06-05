import {
    Block,
    BlockComponentRandomTickEvent,
    BlockCustomComponent,
    BlockPermutation,
    BlockStates,
    Dimension,
    MinecraftDimensionTypes,
    Vector3,
    world
} from '@minecraft/server';
import { updateLiquidBlock } from 'utils/helper';

class onRandomTick implements BlockCustomComponent {
    constructor() {
        this.onRandomTick = this.onRandomTick.bind(this);
    }
    onRandomTick(_componentData: BlockComponentRandomTickEvent) {}
}

export class debug extends onRandomTick {
    onRandomTick(componentData: BlockComponentRandomTickEvent) {
        world.sendMessage(`Block: ${componentData.block.typeId}`);
    }
}

export class effect extends onRandomTick {
    onRandomTick(componentData: BlockComponentRandomTickEvent) {
        componentData.dimension
            .getEntities({
                location: componentData.block.location,
                maxDistance: 8
            })
            .forEach((entity) => {
                entity.addEffect('darkness', 200, {
                    showParticles: false,
                    amplifier: 2
                });
            });
    }
}

export class grow extends onRandomTick {
    onRandomTick(componentData: BlockComponentRandomTickEvent) {
        let direction = Math.floor(Math.random() * 6);

        switch (direction) {
            case 0:
                {
                    let block = componentData.block.above();

                    if (block.typeId === 'minecraft:air')
                        block.setType(componentData.block.typeId);
                }
                break;
            case 1:
                {
                    let block = componentData.block.below();

                    if (block.typeId === 'minecraft:air')
                        block.setType(componentData.block.typeId);
                }
                break;
            case 2:
                {
                    let block = componentData.block.north();

                    if (block.typeId === 'minecraft:air')
                        block.setType(componentData.block.typeId);
                }
                break;
            case 3:
                {
                    let block = componentData.block.east();

                    if (block.typeId === 'minecraft:air')
                        block.setType(componentData.block.typeId);
                }
                break;
            case 4:
                {
                    let block = componentData.block.south();

                    if (block.typeId === 'minecraft:air')
                        block.setType(componentData.block.typeId);
                }
                break;
            case 5:
                {
                    let block = componentData.block.west();

                    if (block.typeId === 'minecraft:air')
                        block.setType(componentData.block.typeId);
                }
                break;

            default:
                break;
        }
    }
}

export class plantGrowth extends onRandomTick {
    onRandomTick(componentData: BlockComponentRandomTickEvent) {
        let block = componentData.block;
        let current_state = block.permutation.getState('adk-lib:age') as number;
        let valid_values = BlockStates.get('adk-lib:age').validValues;
        let max = valid_values[valid_values.length - 1] as number;
        if (current_state < max)
            block.setPermutation(
                BlockPermutation.resolve(block.typeId, {
                    'adk-lib:age': (current_state += 1)
                })
            );
    }
}

export class sugarCane extends onRandomTick {
    onRandomTick(componentData: BlockComponentRandomTickEvent): void {
        const block: Block = componentData.block;

        if (!block.above().isAir) return;

        let count: number = 1;

        while (block.below(count).typeId === block.typeId) ++count;

        const namespace: string = block.typeId.split(':')[0];
        const blockStateAge: string = namespace + ':age';

        if (count < 3) {
            let age: number = block.permutation.getState(
                blockStateAge
            ) as number;
            if (age == 15) {
                block.above().setType(block.typeId);
                block.setPermutation(
                    BlockPermutation.resolve(block.typeId, {
                        [blockStateAge]: 0
                    })
                );
            } else {
                block.setPermutation(
                    BlockPermutation.resolve(block.typeId, {
                        [blockStateAge]: age + 1
                    })
                );
            }
        }
    }
}

export class meltIce extends onRandomTick {
    onRandomTick(componentData: BlockComponentRandomTickEvent): void {
        const block: Block = componentData.block;

        if (block.dimension.id == MinecraftDimensionTypes.nether) {
            block.setType('minecraft:air');
            return;
        }

        block.setType('minecraft:water');
        updateLiquidBlock(block.dimension, block.location);
    }
}

export class candleParticles extends onRandomTick {
    onRandomTick(componentData: BlockComponentRandomTickEvent): void {
        let candles: number = componentData.block.permutation.getState(
            componentData.block.typeId.split(':')[0] + ':candles'
        ) as number;

        ParticleOffsets[candles].forEach((offset) => {
            this.spawnParticle(componentData.dimension, {
                x: componentData.block.location.x + offset.x,
                y: componentData.block.location.y + offset.y,
                z: componentData.block.location.z + offset.z
            });
        });
    }

    spawnParticle(world: Dimension, vector: Vector3): void {
        let float: number = Math.random();
        // if(float<0.3)
        world.spawnParticle('minecraft:candle_flame_particle', vector);
    }
}

export const ParticleOffsets = {
    1: [{ x: 0.5, y: 0.5, z: 0.5 }],
    2: [
        { x: 0.375, y: 0.44, z: 0.56 },
        { x: 0.625, y: 0.5, z: 0.5 }
    ],
    3: [
        { x: 0.5, y: 0.313, z: 0.625 },
        { x: 0.375, y: 0.44, z: 0.5 },
        { x: 0.56, y: 0.5, z: 0.44 }
    ],
    4: [
        { x: 0.44, y: 0.313, z: 0.56 },
        { x: 0.625, y: 0.44, z: 0.56 },
        { x: 0.375, y: 0.44, z: 0.375 },
        { x: 0.56, y: 0.5, z: 0.375 }
    ]
};
