import {
    Block,
    BlockComponentRandomTickEvent,
    BlockCustomComponent,
    BlockPermutation,
    BlockStates,
    CustomComponentParameters
} from '@minecraft/server';
import type * as minecraftvanilladata from '@minecraft/vanilla-data';
import { updateLiquidBlock } from 'utils/helper';
import * as adk from 'adk-scripts-server';

abstract class OnRandomTick implements BlockCustomComponent {
    abstract onRandomTick(
        componentData: BlockComponentRandomTickEvent,
        paramData?: CustomComponentParameters
    ): void;
}

class Debug extends OnRandomTick {
    onRandomTick(componentData: BlockComponentRandomTickEvent) {
        console.log(adk.Debug.logEventData(componentData));
    }
}

class Effect extends OnRandomTick {
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

class Grow extends OnRandomTick {
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

class PlantGrowth extends OnRandomTick {
    onRandomTick(componentData: BlockComponentRandomTickEvent) {
        let block = componentData.block;
        let current_state = block.permutation.getState(
            'adk-lib:age' as keyof minecraftvanilladata.BlockStateSuperset
        ) as number;
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

class SugarCane extends OnRandomTick {
    onRandomTick(componentData: BlockComponentRandomTickEvent): void {
        const block: Block = componentData.block;

        if (!block.above().isAir) return;

        let count: number = 1;

        while (block.below(count).typeId === block.typeId) ++count;

        const namespace: string = block.typeId.split(':')[0];
        const blockStateAge: string = namespace + ':age';

        if (count < 3) {
            let age: number = block.permutation.getState(
                blockStateAge as keyof minecraftvanilladata.BlockStateSuperset
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

class MeltIce extends OnRandomTick {
    onRandomTick(componentData: BlockComponentRandomTickEvent): void {
        const block: Block = componentData.block;

        if (block.dimension.id == 'minecraft:nether') {
            block.setType('minecraft:air');
            return;
        }

        block.setType('minecraft:water');
        updateLiquidBlock(block.dimension, block.location);
    }
}

enum OnRandomTickKey {
    Debug = 'debug',
    Effect = 'effect',
    Grow = 'grow',
    PlantGrowth = 'plant_growth',
    SugarCane = 'sugar_cane',
    MeltIce = 'melt_ice'
}

export const ON_RANDOM_TICK_REGISTRY: Map<OnRandomTickKey, OnRandomTick> =
    new Map([
        [OnRandomTickKey.Debug, new Debug()],
        [OnRandomTickKey.Effect, new Effect()],
        [OnRandomTickKey.Grow, new Grow()],
        [OnRandomTickKey.PlantGrowth, new PlantGrowth()],
        [OnRandomTickKey.SugarCane, new SugarCane()],
        [OnRandomTickKey.MeltIce, new MeltIce()]
    ]);
