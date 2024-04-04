import {
    EquipmentSlot,
    ItemComponentHitEntityEvent,
    ItemCustomComponent,
    ItemStack,
    world
} from '@minecraft/server';

class onHitEntity implements ItemCustomComponent {
    constructor() {
        this.onHitEntity = this.onHitEntity.bind(this);
    }
    onHitEntity(_componentData: ItemComponentHitEntityEvent) {}
}

export class debug extends onHitEntity {
    onHitEntity(componentData: ItemComponentHitEntityEvent) {
        world.sendMessage(
            `Attacking Entity: ${componentData.attackingEntity.typeId}`
        );
        world.sendMessage(`Had Effect: ${componentData.hadEffect}`);
        world.sendMessage(`Hit Entity: ${componentData.hitEntity.typeId}`);
        world.sendMessage(`Item: ${componentData.itemStack.typeId}`);
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
