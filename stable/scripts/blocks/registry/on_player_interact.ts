import {
    Block,
    BlockComponentPlayerInteractEvent,
    BlockCustomComponent,
    EntityEquippableComponent,
    EquipmentSlot,
    ItemStack,
    Player
} from '@minecraft/server';
import { Debug } from 'adk-scripts-server';
import { vectorOfCenter } from 'utils/math';
import { onInteractCandle } from '../candle';

class onPlayerInteract implements BlockCustomComponent {
    constructor() {
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
    }
    onPlayerInteract(_componentData: BlockComponentPlayerInteractEvent) {}
}

export class debug extends onPlayerInteract {
    onPlayerInteract(componentData: BlockComponentPlayerInteractEvent) {
        let data: Object = Debug.logEventData(
            componentData,
            componentData.constructor.name
        );
        let result: string = JSON.stringify(
            Object.keys(data)
                .sort()
                .reduce((result, key) => {
                    result[key] = data[key];
                    return result;
                }, {}),
            null,
            4
        );
        console.log(result);
    }
}

export class turnInto extends onPlayerInteract {
    onPlayerInteract(componentData: BlockComponentPlayerInteractEvent) {
        let block: Block = componentData.block;
        let player: Player = componentData.player;
        let playerEquipment: string = (
            player.getComponent('equippable') as EntityEquippableComponent
        ).getEquipment(EquipmentSlot.Mainhand).typeId;
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

export class primeTnt extends onPlayerInteract {
    onPlayerInteract(componentData: BlockComponentPlayerInteractEvent) {
        let item: ItemStack = (
            componentData.player.getComponent(
                'equippable'
            ) as EntityEquippableComponent
        ).getEquipment(EquipmentSlot.Mainhand);
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

export class candle extends onPlayerInteract {
    onPlayerInteract(componentData: BlockComponentPlayerInteractEvent): void {
        onInteractCandle(componentData);
    }
}
