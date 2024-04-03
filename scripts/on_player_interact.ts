import {
    BlockComponentPlayerInteractEvent,
    BlockCustomComponent,
    world
} from '@minecraft/server';

class onPlayerInteract implements BlockCustomComponent {
    constructor() {
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
    }
    onPlayerInteract(_componentData: BlockComponentPlayerInteractEvent) {}
}

export class debug extends onPlayerInteract {
    onPlayerInteract(componentData: BlockComponentPlayerInteractEvent) {
        world.sendMessage(
            `Player interacted with block at ${componentData.block.x}, ${componentData.block.y}, ${componentData.block.z} on the ${componentData.face} face.`
        );
    }
}
