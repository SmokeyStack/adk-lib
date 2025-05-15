import {
    Block,
    BlockPermutation,
    CustomComponentParameters,
    ItemComponentUseOnEvent,
    ItemCustomComponent,
    Player,
    system,
    Vector3
} from '@minecraft/server';
import * as adk from 'adk-scripts-server';
import { BLOCK_MAP } from '../fertilizable';
import { pickupLiquid } from '../item_bucket';
import { onUseOnDye } from '../item_dye';
import { onUseOnWax } from '../item_wax';
import {
    ParameterLiquidPickup,
    ParameterRunCommand
} from 'utils/shared_parameters';

abstract class OnUseOn implements ItemCustomComponent {
    abstract onUseOn(
        componentData: ItemComponentUseOnEvent,
        paramData?: CustomComponentParameters
    ): void;
}

class Debug extends OnUseOn {
    onUseOn(componentData: ItemComponentUseOnEvent) {
        console.log(adk.Debug.logEventData(componentData));
    }
}

class Fertilizable extends OnUseOn {
    onUseOn(componentData: ItemComponentUseOnEvent) {
        if (
            BLOCK_MAP.get(componentData.block.typeId)?.canGrow(
                componentData.block.dimension,
                componentData.block.location,
                componentData.usedOnBlockPermutation
            ) &&
            BLOCK_MAP.get(componentData.block.typeId)?.isFertilizable(
                componentData.block.dimension,
                componentData.block.location,
                componentData.usedOnBlockPermutation
            )
        ) {
            BLOCK_MAP.get(componentData.block.typeId)?.grow(
                componentData.block.dimension,
                componentData.block.location,
                componentData.usedOnBlockPermutation
            );
            const player: Player = componentData.source as Player;
            adk.PlayerHelper.decrementStack(player);
        }
    }
}
class Bucket extends OnUseOn {
    onUseOn(
        componentData: ItemComponentUseOnEvent,
        paramData: CustomComponentParameters
    ) {
        const param = paramData.params as ParameterLiquidPickup;
        for (const entry of param) {
            const liquid_to_pickup: string[] | undefined =
                entry.liquid_to_pickup;
            const tranform_to: string = entry.transform_to;

            // Check if player_equipment matches any transform_from
            const matches: boolean = (liquid_to_pickup ?? []).some(
                (block: string) => {
                    return (
                        componentData.usedOnBlockPermutation.type.id === block
                    );
                }
            );

            // If there's a match, log the corresponding transform_to
            if (matches) {
                pickupLiquid(
                    tranform_to,
                    componentData.block,
                    componentData.blockFace,
                    componentData.source as Player,
                    componentData.itemStack,
                    true
                );
                return; // Stop further checks if a match is found
            }
        }
    }
}

class Dye extends OnUseOn {
    onUseOn(
        componentData: ItemComponentUseOnEvent,
        paramData: CustomComponentParameters
    ): void {
        onUseOnDye(componentData, paramData);
    }
}

class Fire extends OnUseOn {
    onUseOn(componentData: ItemComponentUseOnEvent): void {
        const block: Block = componentData.block;
        const block_permutation: BlockPermutation =
            componentData.usedOnBlockPermutation;

        if (block.typeId.endsWith('campfire')) {
            block.setPermutation(
                block_permutation.withState('extinguished', false)
            );
        } else if (block.typeId.endsWith('candle')) {
            block.setPermutation(block_permutation.withState('lit', true));
        } else {
            const location: Vector3 = adk.DirectionHelper.toVector3(
                componentData.blockFace
            );
            const block_offset: Block | undefined = block.offset(location);
            if (!block_offset) return;
            const block_below: Block | undefined = block_offset.below();
            if (!block_below) return;
            if (block_below.isLiquid || !block_offset.isAir) return;

            block_offset.setType('minecraft:fire');
        }

        const player: Player = componentData.source as Player;
        adk.PlayerHelper.decrementStack(player);
    }
}

class GlassBottle extends OnUseOn {
    onUseOn(
        componentData: ItemComponentUseOnEvent,
        paramData: CustomComponentParameters
    ): void {
        const param = paramData.params as ParameterLiquidPickup;
        for (const entry of param) {
            const liquid_to_pickup: string[] | undefined =
                entry.liquid_to_pickup;
            const tranform_to: string = entry.transform_to;

            // Check if player_equipment matches any transform_from
            const matches: boolean = (liquid_to_pickup ?? []).some(
                (block: string) => {
                    return (
                        componentData.usedOnBlockPermutation.type.id === block
                    );
                }
            );

            // If there's a match, log the corresponding transform_to
            if (matches) {
                pickupLiquid(
                    tranform_to,
                    componentData.block,
                    componentData.blockFace,
                    componentData.source as Player,
                    componentData.itemStack,
                    false
                );
                return; // Stop further checks if a match is found
            }
        }
    }
}

class Wax extends OnUseOn {
    onUseOn(componentData: ItemComponentUseOnEvent): void {
        onUseOnWax(componentData);
    }
}

class RunCommand extends OnUseOn {
    onUseOn(
        componentData: ItemComponentUseOnEvent,
        paramData: CustomComponentParameters
    ) {
        const param = paramData.params as ParameterRunCommand;
        system.run(() => {
            param.command.forEach((command) => {
                componentData.source.runCommand(command);
            });
        });
    }
}

enum OnUseOnKey {
    Debug = 'debug',
    Fertilizable = 'fertilizable',
    Bucket = 'bucket',
    Dye = 'dye',
    Fire = 'fire',
    GlassBottle = 'glass_bottle',
    Wax = 'wax',
    RunCommand = 'run_command'
}

export const ON_USE_ON_REGISTRY = new Map([
    [OnUseOnKey.Debug, new Debug()],
    [OnUseOnKey.Fertilizable, new Fertilizable()],
    [OnUseOnKey.Bucket, new Bucket()],
    [OnUseOnKey.Dye, new Dye()],
    [OnUseOnKey.Fire, new Fire()],
    [OnUseOnKey.GlassBottle, new GlassBottle()],
    [OnUseOnKey.Wax, new Wax()],
    [OnUseOnKey.RunCommand, new RunCommand()]
]);
