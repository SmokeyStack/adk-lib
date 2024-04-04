import {
    EquipmentSlot,
    ItemComponentMineBlockEvent,
    ItemCustomComponent,
    ItemStack,
    world
} from '@minecraft/server';

class onMineBlock implements ItemCustomComponent {
    constructor() {
        this.onMineBlock = this.onMineBlock.bind(this);
    }
    onMineBlock(_componentData: ItemComponentMineBlockEvent) {}
}

export class debug extends onMineBlock {
    onMineBlock(componentData: ItemComponentMineBlockEvent) {
        world.sendMessage(`Block: ${componentData.block.typeId}`);
        world.sendMessage(`Item: ${componentData.itemStack.typeId}`);
        world.sendMessage(
            `Mined Block Permutation: ${componentData.minedBlockPermutation.type.id}`
        );
        world.sendMessage(`Entity: ${componentData.source.typeId}`);
    }
}

export class digger extends onMineBlock {
    onMineBlock(componentData: ItemComponentMineBlockEvent) {
        let player = componentData.source;
        let item = new ItemStack(componentData.itemStack.typeId, 1);

        if (componentData.minedBlockPermutation.type.id === 'minecraft:glass') {
            item.getComponent('durability').damage +=
                componentData.itemStack.getComponent('durability').damage + 0;
        } else if (
            componentData.minedBlockPermutation.type.id ===
            'minecraft:oak_planks'
        ) {
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
