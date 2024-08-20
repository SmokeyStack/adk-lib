import {
    ItemComponentBeforeDurabilityDamageEvent,
    ItemCustomComponent,
    ItemDurabilityComponent,
    system
} from '@minecraft/server';
import { logEventData } from 'utils/debug';

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

/**
 * This was supposed to be a custom component that implements the elytra functionality of not being able to be damaged if the item has 1 durability left.
 * Unfortunately, I forgot that onBeforeDurabilityDamage only activates if the item gets damaged by hitting an entity, not by using it.
 * I'll leave this here for reference.
 */
export class elytraIsUseable extends onBeforeDurabilityDamage {
    onBeforeDurabilityDamage(
        componentData: ItemComponentBeforeDurabilityDamageEvent
    ) {
        const { itemStack } = componentData;
        const { maxDurability, damage } = itemStack.getComponent(
            'durability'
        ) as ItemDurabilityComponent;
        const potentialDurabilityDamage = maxDurability + 1 - (damage + 1);
        componentData.durabilityDamage = potentialDurabilityDamage > 0 ? 1 : 0;
    }
}

export class runCommand extends onBeforeDurabilityDamage {
    onBeforeDurabilityDamage(
        componentData: ItemComponentBeforeDurabilityDamageEvent
    ) {
        const REGEX: RegExp = new RegExp(
            'adk-lib:before_durability_damage_([^]+)'
        );
        let tags: string[] = componentData.itemStack.getTags();
        let commands: string[] = [];

        for (let tag of tags)
            if (REGEX.exec(tag)) commands.push(REGEX.exec(tag)[1]);

        system.run(() => {
            commands.forEach((command) => {
                componentData.attackingEntity.runCommand(command);
            });
        });
    }
}

export class modifyDurabilityDamageAmount extends onBeforeDurabilityDamage {
    onBeforeDurabilityDamage(
        componentData: ItemComponentBeforeDurabilityDamageEvent
    ): void {
        const REGEX: RegExp = new RegExp(
            'adk-lib:modify_durability_damage_([0-9]+)'
        );
        let tags: string[] = componentData.itemStack.getTags();

        for (let tag of tags)
            if (REGEX.exec(tag)) {
                componentData.durabilityDamage +=
                    parseInt(REGEX.exec(tag)[1]) - 2;

                break;
            }
    }
}

export class preventDamageDurability extends onBeforeDurabilityDamage {
    onBeforeDurabilityDamage(
        componentData: ItemComponentBeforeDurabilityDamageEvent
    ): void {
        componentData.durabilityDamage -= 2;
    }
}

interface Condition {
    entity: string;
    amount: number;
}

export class modifyDurabilityDamageAmountConditional extends onBeforeDurabilityDamage {
    onBeforeDurabilityDamage(
        componentData: ItemComponentBeforeDurabilityDamageEvent
    ): void {
        const REGEX: RegExp = new RegExp(
            'adk-lib:modify_durability_damage_conditional_entity_([^]+)_amount_([0-9]+)'
        );
        let tags: string[] = componentData.itemStack.getTags();
        let conditions: Condition[] = [];

        for (let tag of tags)
            if (REGEX.exec(tag))
                conditions.push({
                    entity: REGEX.exec(tag)[1],
                    amount: parseInt(REGEX.exec(tag)[2])
                });

        for (let condition of conditions)
            if (componentData.hitEntity.typeId === condition.entity) {
                componentData.durabilityDamage += condition.amount - 2;
                break;
            }
    }
}
