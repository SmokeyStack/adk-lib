import {
    EquipmentSlot,
    ItemComponentMineBlockEvent,
    ItemCustomComponent,
    ItemStack,
    Player
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
        const REGEX: RegExp = new RegExp('adk-lib:digger_([0-9]+)');
        let tags: string[] = componentData.itemStack.getTags();
        let player: Player = componentData.source as Player;

        for (let tag of tags)
            if (REGEX.exec(tag)) {
                let item: ItemStack = player
                    .getComponent('minecraft:equippable')
                    .getEquipment(EquipmentSlot.Mainhand);

                if (
                    item.getComponent('minecraft:durability').damage +
                        parseInt(REGEX.exec(tag)[1]) >=
                    item.getComponent('minecraft:durability').maxDurability
                ) {
                    player
                        .getComponent('minecraft:equippable')
                        .setEquipment(EquipmentSlot.Mainhand, undefined);

                    break;
                }

                item.getComponent('minecraft:durability').damage += parseInt(
                    REGEX.exec(tag)[1]
                );
                player
                    .getComponent('minecraft:equippable')
                    .setEquipment(EquipmentSlot.Mainhand, item);

                break;
            }
    }
}

interface Condition {
    block: string;
    amount: number;
}

export class diggerConditional extends onMineBlock {
    onMineBlock(componentData: ItemComponentMineBlockEvent) {
        const REGEX: RegExp = new RegExp(
            'adk-lib:digger_conditional_block_([^]+)_amount_([0-9]+)'
        );
        let tags: string[] = componentData.itemStack.getTags();
        let conditions: Condition[] = [];
        let player: Player = componentData.source as Player;

        for (let tag of tags)
            if (REGEX.exec(tag))
                conditions.push({
                    block: REGEX.exec(tag)[1],
                    amount: parseInt(REGEX.exec(tag)[2])
                });

        for (let condition of conditions)
            if (
                componentData.minedBlockPermutation.type.id === condition.block
            ) {
                let item: ItemStack = player
                    .getComponent('minecraft:equippable')
                    .getEquipment(EquipmentSlot.Mainhand);

                if (
                    item.getComponent('minecraft:durability').damage +
                        condition.amount >=
                    item.getComponent('minecraft:durability').maxDurability
                ) {
                    player
                        .getComponent('minecraft:equippable')
                        .setEquipment(EquipmentSlot.Mainhand, undefined);

                    break;
                }

                item.getComponent('minecraft:durability').damage +=
                    condition.amount;
                player
                    .getComponent('minecraft:equippable')
                    .setEquipment(EquipmentSlot.Mainhand, item);
            }
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
