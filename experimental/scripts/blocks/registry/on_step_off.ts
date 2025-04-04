import {
    BlockComponentStepOffEvent,
    BlockCustomComponent,
    CustomComponentParameters,
    system
} from '@minecraft/server';
import * as adk from 'adk-scripts-server';

abstract class OnStepOff implements BlockCustomComponent {
    abstract onStepOff(
        componentData: BlockComponentStepOffEvent,
        paramData?: CustomComponentParameters
    ): void;
}

class Debug extends OnStepOff {
    onStepOff(componentData: BlockComponentStepOffEvent) {
        console.log(adk.Debug.logEventData(componentData));
    }
}

class Effect extends OnStepOff {
    onStepOff(componentData: BlockComponentStepOffEvent) {
        componentData.entity.addEffect('slowness', 200, {
            showParticles: false,
            amplifier: 2
        });
    }
}

class Disappearing extends OnStepOff {
    onStepOff(componentData: BlockComponentStepOffEvent) {
        let block = componentData.block.typeId;

        componentData.block.setType('minecraft:air');
        system.runTimeout(() => {
            componentData.block.setType(block);
        }, 100);
    }
}

enum OnStepOffKey {
    Debug = 'debug',
    Effect = 'effect',
    Disappearing = 'disappearing'
}

export const ON_STEP_OFF_REGISTRY: Map<OnStepOffKey, OnStepOff> = new Map([
    [OnStepOffKey.Debug, new Debug()],
    [OnStepOffKey.Effect, new Effect()],
    [OnStepOffKey.Disappearing, new Disappearing()]
]);
