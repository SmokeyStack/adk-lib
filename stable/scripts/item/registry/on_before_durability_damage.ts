import {
    CustomComponentParameters,
    ItemComponentBeforeDurabilityDamageEvent,
    ItemCustomComponent,
    ItemDurabilityComponent,
    ItemStack,
    system
} from '@minecraft/server';
import * as adk from 'adk-scripts-server';
import { ParameterRunCommand } from 'utils/shared_parameters';

abstract class OnBeforeDurabilityDamage implements ItemCustomComponent {
    abstract onBeforeDurabilityDamage(
        componentData: ItemComponentBeforeDurabilityDamageEvent,
        paramData?: CustomComponentParameters
    ): void;
}

class Debug extends OnBeforeDurabilityDamage {
    onBeforeDurabilityDamage(
        componentData: ItemComponentBeforeDurabilityDamageEvent
    ) {
        console.log(adk.Debug.logEventData(componentData));
    }
}

/**
 * This was supposed to be a custom component that implements the elytra functionality of not being able to be damaged if the item has 1 durability left.
 * Unfortunately, I forgot that onBeforeDurabilityDamage only activates if the item gets damaged by hitting an entity, not by using it.
 * I'll leave this here for reference.
 */
class ElytraIsUseable extends OnBeforeDurabilityDamage {
    onBeforeDurabilityDamage(
        componentData: ItemComponentBeforeDurabilityDamageEvent
    ) {
        const item: ItemStack | undefined = componentData.itemStack;
        if (!item) return;

        const durability: ItemDurabilityComponent =
            adk.ComponentItemDurability.get(item);
        const potentialDurabilityDamage =
            durability.maxDurability + 1 - (durability.damage + 1);
        componentData.durabilityDamage = potentialDurabilityDamage > 0 ? 1 : 0;
    }
}

class RunCommand extends OnBeforeDurabilityDamage {
    onBeforeDurabilityDamage(
        componentData: ItemComponentBeforeDurabilityDamageEvent,
        paramData: CustomComponentParameters
    ) {
        const param = paramData.params as ParameterRunCommand;
        system.run(() => {
            param.command.forEach((command) => {
                componentData.attackingEntity.runCommand(command);
            });
        });
    }
}

type ParameterModifyDurabilityDamageAmount = {
    damage_amount: number;
    entity_filter?: string[];
}[];

class ModifyDurabilityDamageAmount extends OnBeforeDurabilityDamage {
    onBeforeDurabilityDamage(
        componentData: ItemComponentBeforeDurabilityDamageEvent,
        paramData: CustomComponentParameters
    ): void {
        const param = paramData.params as ParameterModifyDurabilityDamageAmount;
        for (const entry of param) {
            const entity_filter: string[] | undefined = entry.entity_filter;
            const damage: number = entry.damage_amount;

            // Check if player_equipment matches any transform_from
            const matches: boolean = (entity_filter ?? []).some(
                (entity: string) => {
                    return componentData.hitEntity.typeId === entity;
                }
            );

            // If there's a match, log the corresponding transform_to
            if (matches) {
                componentData.durabilityDamage = damage;
                return; // Stop further checks if a match is found
            }
        }
    }
}

class PreventDamageDurability extends OnBeforeDurabilityDamage {
    onBeforeDurabilityDamage(
        componentData: ItemComponentBeforeDurabilityDamageEvent
    ): void {
        componentData.durabilityDamage = 0;
    }
}

enum OnBeforeDurabilityDamageKey {
    Debug = 'debug',
    RunCommand = 'run_command',
    ModifyDurabilityDamageAmount = 'modify_durability_damage_amount',
    PreventDamageDurability = 'prevent_damage_durability'
}

export const ON_BEFORE_DURABILITY_DAMAGE_REGISTRY: Map<
    OnBeforeDurabilityDamageKey,
    OnBeforeDurabilityDamage
> = new Map([
    [OnBeforeDurabilityDamageKey.Debug, new Debug()],
    [OnBeforeDurabilityDamageKey.RunCommand, new RunCommand()],
    [
        OnBeforeDurabilityDamageKey.ModifyDurabilityDamageAmount,
        new ModifyDurabilityDamageAmount()
    ],
    [
        OnBeforeDurabilityDamageKey.PreventDamageDurability,
        new PreventDamageDurability()
    ]
]);
