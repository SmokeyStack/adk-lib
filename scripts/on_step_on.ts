import {
    BlockComponentStepOnEvent,
    BlockCustomComponent,
    world
} from '@minecraft/server';

class onStepOn implements BlockCustomComponent {
    constructor() {
        this.onStepOn = this.onStepOn.bind(this);
    }
    onStepOn(_componentData: BlockComponentStepOnEvent) {}
}

export class debug extends onStepOn {
    onStepOn(componentData: BlockComponentStepOnEvent) {
        world.sendMessage(`Block: ${componentData.block.typeId}`);
        world.sendMessage(`Entity: ${componentData.entity.typeId}`);
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
