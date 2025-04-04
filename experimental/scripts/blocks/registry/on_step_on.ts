import {
    BlockComponentStepOnEvent,
    BlockCustomComponent,
    CustomComponentParameters
} from '@minecraft/server';
import * as adk from 'adk-scripts-server';

abstract class OnStepOn implements BlockCustomComponent {
    abstract onStepOn(
        componentData: BlockComponentStepOnEvent,
        paramData?: CustomComponentParameters
    ): void;
}

class Debug extends OnStepOn {
    onStepOn(componentData: BlockComponentStepOnEvent) {
        console.log(adk.Debug.logEventData(componentData));
    }
}

class Effect extends OnStepOn {
    onStepOn(componentData: BlockComponentStepOnEvent) {
        componentData.entity.addEffect('speed', 200, {
            showParticles: false,
            amplifier: 2
        });
    }
}

class Impulse extends OnStepOn {
    onStepOn(componentData: BlockComponentStepOnEvent) {
        componentData.entity.applyKnockback(
            {
                x: componentData.entity.getVelocity().x,
                z: componentData.entity.getVelocity().z
            },
            1
        );
    }
}

enum OnStepOnKey {
    Debug = 'debug',
    Effect = 'effect',
    Impulse = 'impulse'
}

export const ON_STEP_ON_REGISTRY: Map<OnStepOnKey, OnStepOn> = new Map([
    [OnStepOnKey.Debug, new Debug()],
    [OnStepOnKey.Effect, new Effect()],
    [OnStepOnKey.Impulse, new Impulse()]
]);
