import {
    Block,
    BlockComponentStepOnEvent,
    BlockCustomComponent,
    CustomComponentParameters,
    Dimension,
    Entity,
    Vector3
} from '@minecraft/server';
import * as adk from 'adk-scripts-server';
import { ParameterBounceForce, ParameterEffect } from 'utils/shared_parameters';

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
    onStepOn(
        componentData: BlockComponentStepOnEvent,
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

class Bounce extends OnStepOn {
    onStepOn(
        componentData: BlockComponentStepOnEvent,
        paramData: CustomComponentParameters
    ) {
        const entity: Entity | undefined = componentData.entity;

        if (!entity) return;

        const velocity: Vector3 = entity.getVelocity();
        if (velocity.y < 0) {
            const param = paramData.params as ParameterBounceForce;
            const bounce_force = param.force ?? 1;
            entity.applyKnockback({ x: 0, z: 0 }, -velocity.y * bounce_force);
        }
    }
}

enum OnStepOnKey {
    Debug = 'debug',
    Effect = 'effect',
    Bounce = 'bounce'
}

export const ON_STEP_ON_REGISTRY: Map<OnStepOnKey, OnStepOn> = new Map([
    [OnStepOnKey.Debug, new Debug()],
    [OnStepOnKey.Effect, new Effect()],
    [OnStepOnKey.Bounce, new Bounce()]
]);
