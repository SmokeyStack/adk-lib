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
        world.sendMessage(`Entity: ${componentData.entity.nameTag}`);
        world.sendMessage(`Fall Distance: ${componentData.fallDistance}`);
    }
}

export class player_bounce extends onEntityFallOn {
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
