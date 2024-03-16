import {
    BlockComponentStepOffEvent,
    BlockCustomComponent,
    system
} from '@minecraft/server';

class onStepOff implements BlockCustomComponent {
    constructor() {
        this.onStepOff = this.onStepOff.bind(this);
    }
    onStepOff(_componentData: BlockComponentStepOffEvent) {}
}

export class sayHi extends onStepOff {
    onStepOff(componentData: BlockComponentStepOffEvent) {
        componentData.dimension.runCommand(
            `say D: don't leave me!!! from ${componentData.block.typeId} at ${componentData.block.x}, ${componentData.block.y}, ${componentData.block.z}`
        );
    }
}

export class effect extends onStepOff {
    onStepOff(componentData: BlockComponentStepOffEvent) {
        componentData.entity.addEffect('slowness', 200, {
            showParticles: false,
            amplifier: 2
        });
    }
}

export class disappearing extends onStepOff {
    onStepOff(componentData: BlockComponentStepOffEvent) {
        let block = componentData.block.typeId;

        componentData.block.setType('minecraft:air');
        system.runTimeout(() => {
            componentData.block.setType(block);
        }, 100);
    }
}
