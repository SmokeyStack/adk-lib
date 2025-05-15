import {
    BlockComponentEntityFallOnEvent,
    BlockCustomComponent,
    CustomComponentParameters,
    Entity,
    Vector3
} from '@minecraft/server';
import * as adk from 'adk-scripts-server';
import { ParameterBounceForce } from 'utils/shared_parameters';

abstract class OnEntityFallOn implements BlockCustomComponent {
    abstract onEntityFallOn(
        componentData: BlockComponentEntityFallOnEvent,
        paramData?: CustomComponentParameters
    ): void;
}

class Debug extends OnEntityFallOn {
    onEntityFallOn(componentData: BlockComponentEntityFallOnEvent): void {
        console.log(adk.Debug.logEventData(componentData));
    }
}

class Bounce extends OnEntityFallOn {
    onEntityFallOn(
        componentData: BlockComponentEntityFallOnEvent,
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

enum OnEntityFallOnKey {
    Debug = 'debug',
    Bounce = 'bounce'
}

export const ON_ENTITY_FALL_ON_REGISTRY: Map<
    OnEntityFallOnKey,
    OnEntityFallOn
> = new Map([
    [OnEntityFallOnKey.Debug, new Debug()],
    [OnEntityFallOnKey.Bounce, new Bounce()]
]);
