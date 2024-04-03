import {
    BlockComponentEntityFallOnEvent,
    BlockCustomComponent,
    world
} from '@minecraft/server';

class onEntityFallOn implements BlockCustomComponent {
    constructor() {
        this.onEntityFallOn = this.onEntityFallOn.bind(this);
    }
    onEntityFallOn(_componentData: BlockComponentEntityFallOnEvent) {}
}

export class debug extends onEntityFallOn {
    onEntityFallOn(componentData: BlockComponentEntityFallOnEvent): void {
        world.sendMessage(
            `${componentData.entity.typeId} fell on block at ${componentData.block.x}, ${componentData.block.y}, ${componentData.block.z} from a height of ${componentData.fallDistance}.`
        );
    }
}

export class player_bounce extends onEntityFallOn {
    onEntityFallOn(componentData: BlockComponentEntityFallOnEvent) {
        if (Math.abs(componentData.entity.getVelocity().y) < 1) {
            componentData.entity.applyKnockback(
                0,
                0,
                0,
                componentData.entity.getVelocity().y * -1.5
            );
        } else {
            componentData.entity.applyKnockback(
                0,
                0,
                0,
                componentData.entity.getVelocity().y * -0.5
            );
        }
    }
}
