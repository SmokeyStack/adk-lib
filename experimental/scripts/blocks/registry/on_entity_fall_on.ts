import {
    BlockComponentEntityFallOnEvent,
    BlockCustomComponent,
    CustomComponentParameters
} from '@minecraft/server';
import * as adk from 'adk-scripts-server';

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

class PlayerBounce extends OnEntityFallOn {
    onEntityFallOn(componentData: BlockComponentEntityFallOnEvent) {
        if (Math.abs(componentData.entity.getVelocity().y) < 1) {
            componentData.entity.applyKnockback(
                { x: 0, z: 0 },
                componentData.entity.getVelocity().y * -1.5
            );
        } else {
            componentData.entity.applyKnockback(
                { x: 0, z: 0 },
                componentData.entity.getVelocity().y * -0.5
            );
        }
    }
}

enum OnEntityFallOnKey {
    Debug = 'debug',
    PlayerBounce = 'player_bounce'
}

export const ON_ENTITY_FALL_ON_REGISTRY: Map<
    OnEntityFallOnKey,
    OnEntityFallOn
> = new Map([
    [OnEntityFallOnKey.Debug, new Debug()],
    [OnEntityFallOnKey.PlayerBounce, new PlayerBounce()]
]);
