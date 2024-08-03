import {
    EquipmentSlot,
    ItemComponentHitEntityEvent,
    ItemCustomComponent,
    ItemStack
} from '@minecraft/server';
import { logEventData } from 'utils/debug';

class onHitEntity implements ItemCustomComponent {
    constructor() {
        this.onHitEntity = this.onHitEntity.bind(this);
    }
    onHitEntity(_componentData: ItemComponentHitEntityEvent) {}
}

export class debug extends onHitEntity {
    onHitEntity(componentData: ItemComponentHitEntityEvent) {
        let data: Object = logEventData(
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

export class summonLightning extends onHitEntity {
    onHitEntity(componentData: ItemComponentHitEntityEvent) {
        componentData.hitEntity.dimension.spawnEntity(
            'minecraft:lightning_bolt',
            componentData.hitEntity.location
        );
    }
}

export class differentDamageDurability extends onHitEntity {
    onHitEntity(componentData: ItemComponentHitEntityEvent) {
        let player = componentData.attackingEntity;
        let item = new ItemStack(componentData.itemStack.typeId, 1);

        if (componentData.hitEntity.typeId === 'minecraft:sheep') {
            item.getComponent('durability').damage +=
                componentData.itemStack.getComponent('durability').damage + 0;
        } else if (componentData.hitEntity.typeId === 'minecraft:armadillo') {
            item.getComponent('durability').damage +=
                componentData.itemStack.getComponent('durability').damage + 5;
        } else {
            item.getComponent('durability').damage +=
                componentData.itemStack.getComponent('durability').damage + 1;
        }

        player
            .getComponent('minecraft:equippable')
            .setEquipment(EquipmentSlot.Mainhand, item);
    }
}

export class preventDamageDurability extends onHitEntity {
    onHitEntity(componentData: ItemComponentHitEntityEvent) {
        let player = componentData.attackingEntity;
        let item = new ItemStack(componentData.itemStack.typeId, 1);
        item.getComponent('durability').damage +=
            componentData.itemStack.getComponent('durability').damage;
        player
            .getComponent('minecraft:equippable')
            .setEquipment(EquipmentSlot.Mainhand, item);
    }
}

export class runCommand extends onHitEntity {
    onHitEntity(componentData: ItemComponentHitEntityEvent) {
        const REGEX: RegExp = new RegExp('adk-lib:on_hit_entity_([^]+)');
        let tags: string[] = componentData.itemStack.getTags();
        let commands: string[] = [];

        for (let tag of tags)
            if (REGEX.exec(tag)) commands.push(REGEX.exec(tag)[1]);

        commands.forEach((command) => {
            componentData.attackingEntity.runCommand(command);
        });
    }
}
