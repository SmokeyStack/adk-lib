import {
    BlockComponentStepOnEvent,
    BlockCustomComponent
} from '@minecraft/server';

class onStepOn implements BlockCustomComponent {
    constructor() {
        this.onStepOn = this.onStepOn.bind(this);
    }
    onStepOn(_componentData: BlockComponentStepOnEvent) {}
}

export class sayHi extends onStepOn {
    onStepOn(componentData: BlockComponentStepOnEvent) {
        componentData.dimension.runCommand(
            `say Hi from ${componentData.block.typeId} at ${componentData.block.x}, ${componentData.block.y}, ${componentData.block.z}`
        );
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
