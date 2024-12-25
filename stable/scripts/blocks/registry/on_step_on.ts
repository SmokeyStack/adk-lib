import {
    BlockComponentStepOnEvent,
    BlockCustomComponent
} from '@minecraft/server';
import { Debug } from 'adk-scripts-server';

class onStepOn implements BlockCustomComponent {
    constructor() {
        this.onStepOn = this.onStepOn.bind(this);
    }
    onStepOn(_componentData: BlockComponentStepOnEvent) {}
}

export class debug extends onStepOn {
    onStepOn(componentData: BlockComponentStepOnEvent) {
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

export class effect extends onStepOn {
    onStepOn(componentData: BlockComponentStepOnEvent) {
        componentData.entity.addEffect('speed', 200, {
            showParticles: false,
            amplifier: 2
        });
    }
}

export class impulse extends onStepOn {
    onStepOn(componentData: BlockComponentStepOnEvent) {
        componentData.entity.applyKnockback(
            componentData.entity.getVelocity().x,
            componentData.entity.getVelocity().z,
            1,
            1
        );
    }
}
