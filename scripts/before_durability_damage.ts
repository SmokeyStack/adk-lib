import {
    ItemComponentBeforeDurabilityDamageEvent,
    ItemCustomComponent,
    world
} from '@minecraft/server';

class beforeDurabilityDamage implements ItemCustomComponent {
    constructor() {
        this.onBeforeDurabilityDamage =
            this.onBeforeDurabilityDamage.bind(this);
    }
    onBeforeDurabilityDamage(
        _componentData: ItemComponentBeforeDurabilityDamageEvent
    ) {}
}

export class debug extends beforeDurabilityDamage {
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
