import {
    ItemComponentUseEvent,
    ItemCooldownComponent,
    ItemCustomComponent
} from '@minecraft/server';
import { logEventData } from 'utils/debug';

class onUse implements ItemCustomComponent {
    constructor() {
        this.onUse = this.onUse.bind(this);
    }
    onUse(_componentData: ItemComponentUseEvent) {}
}

export class debug extends onUse {
    onUse(componentData: ItemComponentUseEvent) {
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

export class goatHorn extends onUse {
    onUse(componentData: ItemComponentUseEvent) {
        const REGEX: RegExp = new RegExp('adk-lib:instrument_([^]+)');
        let tags: string[] = componentData.itemStack.getTags();
        let instrument: string;

        for (let tag of tags)
            if (REGEX.exec(tag)) {
                instrument = REGEX.exec(tag)[1];

                break;
            }

        componentData.source.playSound(instrument, {
            volume: 16
        });
        (
            componentData.itemStack.getComponent(
                'cooldown'
            ) as ItemCooldownComponent
        ).startCooldown(componentData.source);
    }
}

export class runCommand extends onUse {
    onUse(componentData: ItemComponentUseEvent) {
        const REGEX: RegExp = new RegExp('adk-lib:on_use_([^]+)');
        let tags: string[] = componentData.itemStack.getTags();
        let commands: string[] = [];

        for (let tag of tags)
            if (REGEX.exec(tag)) commands.push(REGEX.exec(tag)[1]);

        commands.forEach((command) => {
            componentData.source.runCommand(command);
        });
    }
}
