import {
    EquipmentSlot,
    ItemComponentMineBlockEvent,
    ItemCustomComponent,
    ItemStack
} from '@minecraft/server';
import { logEventData } from 'utils/debug';

class onMineBlock implements ItemCustomComponent {
    constructor() {
        this.onMineBlock = this.onMineBlock.bind(this);
    }
    onMineBlock(_componentData: ItemComponentMineBlockEvent) {}
}

export class debug extends onMineBlock {
    onMineBlock(componentData: ItemComponentMineBlockEvent) {
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

export class runCommand extends onMineBlock {
    onMineBlock(componentData: ItemComponentMineBlockEvent) {
        const REGEX: RegExp = new RegExp('adk-lib:on_mine_block_([^]+)');
        let tags: string[] = componentData.itemStack.getTags();
        let commands: string[] = [];

        for (let tag of tags)
            if (REGEX.exec(tag)) commands.push(REGEX.exec(tag)[1]);

        commands.forEach((command) => {
            componentData.source.runCommand(command);
        });
    }
}
