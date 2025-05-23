import {
    ItemComponentCompleteUseEvent,
    ItemCustomComponent
} from '@minecraft/server';
import { Debug } from 'adk-scripts-server';

class onCompleteUse implements ItemCustomComponent {
    constructor() {
        this.onCompleteUse = this.onCompleteUse.bind(this);
    }
    onCompleteUse(_componentData: ItemComponentCompleteUseEvent) {}
}

export class debug extends onCompleteUse {
    onCompleteUse(componentData: ItemComponentCompleteUseEvent) {
        let data: Object = Debug.logEventData(
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
