import {
    Block,
    BlockComponentPlayerInteractEvent,
    BlockCustomComponent,
    BlockPermutation,
    CustomComponentParameters,
    EquipmentSlot,
    ItemStack,
    Player
} from '@minecraft/server';
import { onInteractCandle } from '../candle';
import * as adk from 'adk-scripts-server';

abstract class OnPlayerInteract implements BlockCustomComponent {
    abstract onPlayerInteract(
        componentData: BlockComponentPlayerInteractEvent,
        paramData?: CustomComponentParameters
    ): void;
}

class Debug extends OnPlayerInteract {
    onPlayerInteract(componentData: BlockComponentPlayerInteractEvent) {
        console.log(adk.Debug.logEventData(componentData));
    }
}

type TransformItem = string | { tag: string };

type ParameterTurnInto = {
    transform_from?: TransformItem[];
    transform_to:
        | string
        | { name: string; states: Record<string, boolean | number | string> };
}[];

class TurnInto extends OnPlayerInteract {
    onPlayerInteract(
        componentData: BlockComponentPlayerInteractEvent,
        paramData: CustomComponentParameters
    ) {
        const player: Player | undefined = componentData.player;
        if (!player) return;

        const param = paramData.params as ParameterTurnInto;
        const block: Block = componentData.block;
        const player_equipment: ItemStack =
            adk.PlayerHelper.getItemFromEquippable(
                player,
                EquipmentSlot.Mainhand
            );

        for (const entry of param) {
            const transform_from: TransformItem[] | undefined =
                entry.transform_from;
            const transform_to = entry.transform_to;

            // Check if player_equipment matches any transform_from
            const matches: boolean = (transform_from ?? []).some(
                (item: TransformItem) => {
                    if (typeof item === 'string') {
                        // Match by typeId
                        if (item === '') return player_equipment === undefined;

                        return player_equipment?.typeId === item;
                    } else if (typeof item === 'object' && 'tag' in item)
                        return player_equipment.getTags().includes(item.tag); // Match by tag

                    return false;
                }
            );

            // If there's a match, log the corresponding transform_to
            if (matches) {
                let permutation: BlockPermutation;

                if (typeof transform_to === 'string') {
                    // Resolve using block name only
                    permutation = BlockPermutation.resolve(transform_to);
                } else
                    permutation = BlockPermutation.resolve(
                        transform_to.name,
                        transform_to.states
                    ); // Resolve using block name and states

                block.setPermutation(permutation);
                return; // Stop further checks if a match is found
            }
        }
    }
}

type ParameterTurnIntoEntity = {
    transform_from?: TransformItem[];
    transform_to: string | { name: string; spawn_event: string };
}[];

class TurnIntoEntity extends OnPlayerInteract {
    onPlayerInteract(
        componentData: BlockComponentPlayerInteractEvent,
        paramData: CustomComponentParameters
    ) {
        const player: Player | undefined = componentData.player;
        if (!player) return;

        const param = paramData.params as ParameterTurnIntoEntity;
        const player_equipment: ItemStack =
            adk.PlayerHelper.getItemFromEquippable(
                player,
                EquipmentSlot.Mainhand
            );

        for (const entry of param) {
            const transform_from: TransformItem[] | undefined =
                entry.transform_from;
            const transform_to = entry.transform_to;

            // Check if player_equipment matches any transform_from
            const matches: boolean = (transform_from ?? []).some(
                (item: TransformItem) => {
                    if (typeof item === 'string') {
                        // Match by typeId
                        if (item === '') return player_equipment === undefined;

                        return player_equipment?.typeId === item;
                    } else if (typeof item === 'object' && 'tag' in item)
                        return player_equipment.getTags().includes(item.tag); // Match by tag

                    return false;
                }
            );

            // If there's a match, log the corresponding transform_to
            if (matches) {
                if (typeof transform_to === 'string') {
                    player.dimension.spawnEntity<string>(
                        transform_to,
                        componentData.block.center()
                    );
                } else
                    player.dimension.spawnEntity<string>(
                        transform_to.name,
                        componentData.block.center(),
                        { spawnEvent: transform_to.spawn_event }
                    );

                componentData.block.setType('minecraft:air');
                return; // Stop further checks if a match is found
            }
        }
    }
}

class Candle extends OnPlayerInteract {
    onPlayerInteract(componentData: BlockComponentPlayerInteractEvent): void {
        onInteractCandle(componentData);
    }
}

enum OnPlayerInteractKey {
    Debug = 'debug',
    TurnInto = 'turn_into',
    TurnIntoEntity = 'turn_into_entity',
    Candle = 'candle'
}

export const ON_PLAYER_INTERACT_REGISTRY: Map<
    OnPlayerInteractKey,
    OnPlayerInteract
> = new Map([
    [OnPlayerInteractKey.Debug, new Debug()],
    [OnPlayerInteractKey.TurnInto, new TurnInto()],
    [OnPlayerInteractKey.TurnIntoEntity, new TurnIntoEntity()],
    [OnPlayerInteractKey.Candle, new Candle()]
]);
