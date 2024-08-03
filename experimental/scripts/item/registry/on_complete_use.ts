import {
    ItemComponentCompleteUseEvent,
    ItemCustomComponent
} from '@minecraft/server';
import { logEventData } from 'utils/debug';

class onCompleteUse implements ItemCustomComponent {
    constructor() {
        this.onCompleteUse = this.onCompleteUse.bind(this);
    }
    onCompleteUse(_componentData: ItemComponentCompleteUseEvent) {}
}

export class debug extends onCompleteUse {
    onCompleteUse(componentData: ItemComponentCompleteUseEvent) {
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

export class runCommand extends onCompleteUse {
    onUse(componentData: ItemComponentCompleteUseEvent) {
        const REGEX: RegExp = new RegExp('adk-lib:on_complete_use_([^]+)');
        let tags: string[] = componentData.itemStack.getTags();
        let commands: string[] = [];

        for (let tag of tags)
            if (REGEX.exec(tag)) commands.push(REGEX.exec(tag)[1]);

        commands.forEach((command) => {
            componentData.source.runCommand(command);
        });
    }
}
