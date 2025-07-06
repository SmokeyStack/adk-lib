import {
    Block,
    BlockComponentRandomTickEvent,
    BlockCustomComponent,
    BlockPermutation,
    BlockStates,
    CustomComponentParameters,
    Dimension
} from '@minecraft/server';
import type * as minecraftvanilladata from '@minecraft/vanilla-data';
import * as adk from 'adk-scripts-server';
import { ParameterEffect, ParameterMelt } from 'utils/shared_parameters';

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
    onRandomTick(
        componentData: BlockComponentRandomTickEvent,
        paramData: CustomComponentParameters
    ) {
        const param = paramData.params as ParameterEffect;
        const dimension: Dimension = adk.Cache.getDimension(
            componentData.block.dimension.id
        );
        const block: Block = componentData.block;
        param.forEach(
            ({
                effect,
                duration,
                radius,
                amplifier = 0,
                show_particles = true,
                entity_type
            }) => {
                dimension
                    .getEntities({
                        location: block.center(),
                        maxDistance: radius
                    })
                    .forEach((entity) => {
                        if (
                            !entity_type ||
                            entity_type.includes(entity.typeId)
                        ) {
                            entity.addEffect(effect, duration, {
                                showParticles: show_particles,
                                amplifier
                            });
                        }
                    });
            }
        );
    }
}

class Grow extends OnRandomTick {
    onRandomTick(componentData: BlockComponentRandomTickEvent) {
        let direction = adk.DirectionHelper.random();
        let block = componentData.block.offset(
            adk.DirectionHelper.toVector3(direction)
        );
        if (!block || block.typeId !== 'minecraft:air') return;
        block.setType(componentData.block.typeId);
    }
}

type ParameterAdvanceState = {
    state: string;
    increment?: number;
    decrement?: number;
    min?: number;
    max?: number;
}[];

class AdvanceState extends OnRandomTick {
    onRandomTick(
        componentData: BlockComponentRandomTickEvent,
        paramData: CustomComponentParameters
    ) {
        const params = paramData.params as ParameterAdvanceState;
        const block = componentData.block;
        params.forEach(
            ({ state, increment = 1, decrement = 0, min = 0, max }) => {
                let current_state = block.permutation.getState(
                    state as keyof minecraftvanilladata.BlockStateSuperset
                );
                const valid_values = BlockStates.get(state)?.validValues || [];

                if (typeof current_state === 'number') {
                    const max_value =
                        max ??
                        (valid_values[valid_values.length - 1] as number);
                    const min_value = min ?? (valid_values[0] as number);
                    current_state = Math.min(
                        Math.max(
                            current_state + increment - decrement,
                            min_value
                        ),
                        max_value
                    );
                } else if (typeof current_state === 'string') {
                    const valid_strings = valid_values as string[];
                    const index = valid_strings.indexOf(current_state);

                    if (index === -1) return;

                    const new_index = Math.min(
                        Math.max(index + increment - decrement, 0),
                        valid_strings.length - 1
                    );
                    current_state = valid_strings[new_index];
                } else if (typeof current_state === 'boolean')
                    current_state = increment > decrement;

                block.setPermutation(
                    block.permutation.withState(
                        state as keyof minecraftvanilladata.BlockStateSuperset,
                        current_state
                    )
                );
            }
        );
    }
}

class SugarCane extends OnRandomTick {
    onRandomTick(componentData: BlockComponentRandomTickEvent): void {
        const block: Block = componentData.block;
        const block_above: Block | undefined = block.above();

        if (!block_above || block_above.typeId !== 'minecraft:air') return;

        let count: number = 1;

        while (block.below(count)?.typeId === block.typeId) ++count;

        const namespace: string = block.typeId.split(':')[0];
        const block_state_age: string = namespace + ':age';

        if (count < 3) {
            let age: number = block.permutation.getState(
                block_state_age as keyof minecraftvanilladata.BlockStateSuperset
            ) as number;
            if (age == 15) {
                block_above.setType(block.typeId);
                block.setPermutation(
                    BlockPermutation.resolve(block.typeId, {
                        [block_state_age]: 0
                    })
                );
            } else
                block.setPermutation(
                    BlockPermutation.resolve(block.typeId, {
                        [block_state_age]: age + 1
                    })
                );
        }
    }
}

class Melt extends OnRandomTick {
    onRandomTick(
        componentData: BlockComponentRandomTickEvent,
        paramData: CustomComponentParameters
    ): void {
        const block: Block = componentData.block;

        if (block.dimension.id == 'minecraft:nether') {
            block.setType('minecraft:air');
            return;
        }

        const block_below: Block | undefined = block.below();

        if (!block_below) return;
        if (adk.BlockHelper.blocksMovement(block_below) || block.isLiquid) {
            const param = paramData.params as ParameterMelt;
            block.setType(param.melted_state);
            return;
        }
    }
}

enum OnRandomTickKey {
    Debug = 'debug',
    Effect = 'effect',
    Grow = 'grow',
    AdvanceState = 'advance_state',
    SugarCane = 'sugar_cane',
    Melt = 'melt'
}

export const ON_RANDOM_TICK_REGISTRY: Map<OnRandomTickKey, OnRandomTick> =
    new Map([
        [OnRandomTickKey.Debug, new Debug()],
        [OnRandomTickKey.Effect, new Effect()],
        [OnRandomTickKey.Grow, new Grow()],
        [OnRandomTickKey.AdvanceState, new AdvanceState()],
        [OnRandomTickKey.SugarCane, new SugarCane()],
        [OnRandomTickKey.Melt, new Melt()]
    ]);
