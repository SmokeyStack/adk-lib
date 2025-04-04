import {
    Block,
    BlockComponentPlayerInteractEvent,
    BlockCustomComponent,
    CustomComponentParameters,
    EquipmentSlot,
    ItemStack,
    Player
} from '@minecraft/server';
import { vectorOfCenter } from 'utils/math';
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

class TurnInto extends OnPlayerInteract {
    onPlayerInteract(componentData: BlockComponentPlayerInteractEvent) {
        let block: Block = componentData.block;
        let player: Player = componentData.player;
        let playerEquipment: string = player
            .getComponent('equippable')
            .getEquipment(EquipmentSlot.Mainhand).typeId;
        const tags: string[] = block.getTags();
        const REGEX: RegExp = new RegExp(
            'adk-lib:turn_into_([a-z]\\w+:[a-z]\\w+)_([a-z]\\w+:[a-z]\\w+)'
        );
        let map: Map<string, string> = new Map<string, string>();

        for (let tag of tags)
            if (REGEX.exec(tag))
                map.set(REGEX.exec(tag)[2], REGEX.exec(tag)[1]);

        for (const [key, value] of map) {
            if (playerEquipment === key) {
                block.setType(value);

                break;
            }
        }
    }
}

class PrimeTnt extends OnPlayerInteract {
    onPlayerInteract(componentData: BlockComponentPlayerInteractEvent) {
        let item: ItemStack = componentData.player
            .getComponent('equippable')
            .getEquipment(EquipmentSlot.Mainhand);
        if (
            item.typeId == 'minecraft:flint_and_steel' ||
            item.typeId == 'minecraft:fire_charge'
        ) {
            componentData.dimension.spawnEntity(
                'minecraft:tnt',
                vectorOfCenter(componentData.block.location)
            );
            componentData.block.setType('minecraft:air');
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
    PrimeTnt = 'prime_tnt',
    Candle = 'candle'
}

export const ON_PLAYER_INTERACT_REGISTRY: Map<
    OnPlayerInteractKey,
    OnPlayerInteract
> = new Map([
    [OnPlayerInteractKey.Debug, new Debug()],
    [OnPlayerInteractKey.TurnInto, new TurnInto()],
    [OnPlayerInteractKey.PrimeTnt, new PrimeTnt()],
    [OnPlayerInteractKey.Candle, new Candle()]
]);
