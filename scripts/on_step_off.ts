import {
    BlockComponentStepOffEvent,
    BlockCustomComponent,
    system,
    world
} from '@minecraft/server';

class onStepOff implements BlockCustomComponent {
    constructor() {
        this.onStepOff = this.onStepOff.bind(this);
    }
    onStepOff(_componentData: BlockComponentStepOffEvent) {}
}

export class debug extends onStepOff {
    onStepOff(componentData: BlockComponentStepOffEvent) {
        world.sendMessage(`Block: ${componentData.block.typeId}`);
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
