import {
    EntityEquippableComponent,
    EquipmentSlot,
    ItemComponentHitEntityEvent,
    ItemCustomComponent,
    ItemDurabilityComponent,
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

        // ==================================================
        // Workaround since stable doesn't have ItemComponentTypeMap
        let durability: ItemDurabilityComponent = item.getComponent(
            'durability'
        ) as ItemDurabilityComponent;
        // ==================================================

        if (componentData.hitEntity.typeId === 'minecraft:sheep') {
            durability.damage +=
                (
                    componentData.itemStack.getComponent(
                        'durability'
                    ) as ItemDurabilityComponent
                ).damage + 0;
        } else if (componentData.hitEntity.typeId === 'minecraft:armadillo') {
            durability.damage +=
                (
                    componentData.itemStack.getComponent(
                        'durability'
                    ) as ItemDurabilityComponent
                ).damage + 5;
        } else {
            durability.damage +=
                (
                    componentData.itemStack.getComponent(
                        'durability'
                    ) as ItemDurabilityComponent
                ).damage + 1;
        }

        // ==================================================
        // Workaround since stable doesn't have EntityComponentTypeMap
        let equippableTemp: EntityEquippableComponent = player.getComponent(
            'equippable'
        ) as EntityEquippableComponent;
        // ==================================================

        equippableTemp.setEquipment(EquipmentSlot.Mainhand, item);
    }
}

export class preventDamageDurability extends onHitEntity {
    onHitEntity(componentData: ItemComponentHitEntityEvent) {
        let player = componentData.attackingEntity;
        let item = new ItemStack(componentData.itemStack.typeId, 1);

        // ==================================================
        // Workaround since stable doesn't have ItemComponentTypeMap
        let durability: ItemDurabilityComponent = item.getComponent(
            'durability'
        ) as ItemDurabilityComponent;
        // ==================================================

        durability.damage += (
            componentData.itemStack.getComponent(
                'durability'
            ) as ItemDurabilityComponent
        ).damage;

        // ==================================================
        // Workaround since stable doesn't have EntityComponentTypeMap
        let equippableTemp: EntityEquippableComponent = player.getComponent(
            'equippable'
        ) as EntityEquippableComponent;
        // ==================================================

        equippableTemp.setEquipment(EquipmentSlot.Mainhand, item);
    }
}