import {
    Block,
    BlockComponentStepOffEvent,
    BlockCustomComponent,
    CustomComponentParameters,
    Dimension
} from '@minecraft/server';
import * as adk from 'adk-scripts-server';
import { ParameterEffect } from 'utils/shared_parameters';

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
    onStepOff(
        componentData: BlockComponentStepOffEvent,
        paramData: CustomComponentParameters
    ) {
        const param = paramData.params as ParameterEffect;
        const dimension: Dimension = adk.Cache.getDimension(
            componentData.block.dimension.id
        );
        const block: Block = componentData.block;
        param.forEach(
            ({
                effect,
                duration,
                radius,
                amplifier = 0,
                show_particles = true,
                entity_type
            }) => {
                dimension
                    .getEntities({
                        location: block.center(),
                        maxDistance: radius
                    })
                    .forEach((entity) => {
                        if (
                            !entity_type ||
                            entity_type.includes(entity.typeId)
                        ) {
                            entity.addEffect(effect, duration, {
                                showParticles: show_particles,
                                amplifier
                            });
                        }
                    });
            }
        );
    }
}

enum OnStepOffKey {
    Debug = 'debug',
    Effect = 'effect'
}

export const ON_STEP_OFF_REGISTRY: Map<OnStepOffKey, OnStepOff> = new Map([
    [OnStepOffKey.Debug, new Debug()],
    [OnStepOffKey.Effect, new Effect()]
]);
