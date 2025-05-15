import {
    CustomComponentParameters,
    EquipmentSlot,
    ItemComponentMineBlockEvent,
    ItemCustomComponent,
    ItemDurabilityComponent,
    ItemStack,
    Player,
    system
} from '@minecraft/server';
import * as adk from 'adk-scripts-server';
import { ParameterRunCommand } from 'utils/shared_parameters';

abstract class OnMineBlock implements ItemCustomComponent {
    abstract onMineBlock(
        componentData: ItemComponentMineBlockEvent,
        paramData?: CustomComponentParameters
    ): void;
}

class Debug extends OnMineBlock {
    onMineBlock(componentData: ItemComponentMineBlockEvent) {
        console.log(adk.Debug.logEventData(componentData));
    }
}

type ParameterDigger = {
    damage_amount: number;
    block_filter?: string[];
}[];

class Digger extends OnMineBlock {
    onMineBlock(
        componentData: ItemComponentMineBlockEvent,
        paramData: CustomComponentParameters
    ) {
        const param = paramData.params as ParameterDigger;
        for (const entry of param) {
            const block_filter: string[] | undefined = entry.block_filter;
            const damage: number = entry.damage_amount;

            // Check if player_equipment matches any transform_from
            const matches: boolean = (block_filter ?? []).some(
                (block: string) => {
                    return (
                        componentData.minedBlockPermutation.type.id === block
                    );
                }
            );

            // If there's a match, log the corresponding transform_to
            if (matches) {
                const item = componentData.itemStack;
                if (!item) return;
                const durability: ItemDurabilityComponent =
                    adk.ComponentItemDurability.get(item);
                durability.damage += damage;
                return; // Stop further checks if a match is found
            }
        }
    }
}

class RunCommand extends OnMineBlock {
    onMineBlock(
        componentData: ItemComponentMineBlockEvent,
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

enum OnMineBlockKey {
    Debug = 'debug',
    Digger = 'digger',
    RunCommand = 'run_command'
}

export const ON_MINE_BLOCK_REGISTRY = new Map([
    [OnMineBlockKey.Debug, new Debug()],
    [OnMineBlockKey.Digger, new Digger()],
    [OnMineBlockKey.RunCommand, new RunCommand()]
]);
