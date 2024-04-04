import {
    BlockComponentTickEvent,
    BlockCustomComponent,
    world
} from '@minecraft/server';

class onTick implements BlockCustomComponent {
    constructor() {
        this.onTick = this.onTick.bind(this);
    }
    onTick(_componentData: BlockComponentTickEvent) {}
}

export class debug extends onTick {
    onTick(componentData: BlockComponentTickEvent) {
        world.sendMessage(`Block: ${componentData.block.typeId}`);
    }
}
