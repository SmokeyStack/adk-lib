import {
    ItemComponentBeforeDurabilityDamageEvent,
    ItemCustomComponent,
    world
} from '@minecraft/server';

class onBeforeDurabilityDamage implements ItemCustomComponent {
    constructor() {
        this.onBeforeDurabilityDamage =
            this.onBeforeDurabilityDamage.bind(this);
    }
    onBeforeDurabilityDamage(
        _componentData: ItemComponentBeforeDurabilityDamageEvent
    ) {}
}

export class debug extends onBeforeDurabilityDamage {
    onBeforeDurabilityDamage(
        componentData: ItemComponentBeforeDurabilityDamageEvent
    ) {
        world.sendMessage(
            `Attacking Entity: ${componentData.attackingEntity.typeId}`
        );
        world.sendMessage(
            `Durability Damage: ${componentData.durabilityDamage}`
        );
        world.sendMessage(`Hit Entity: ${componentData.hitEntity.typeId}`);
        world.sendMessage(`Item: ${componentData.itemStack.typeId}`);
    }
}

export class elytraIsUseable extends onBeforeDurabilityDamage {
    onBeforeDurabilityDamage(
        componentData: ItemComponentBeforeDurabilityDamageEvent
    ) {
        const { itemStack } = componentData;
        const { maxDurability, damage } = itemStack.getComponent('durability');
        const potentialDurabilityDamage = maxDurability + 1 - (damage + 1);
        componentData.durabilityDamage = potentialDurabilityDamage > 0 ? 1 : 0;
    }
}
