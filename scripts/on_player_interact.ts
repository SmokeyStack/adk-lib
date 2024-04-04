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
        world.sendMessage(`Face: ${componentData.face}`);
        world.sendMessage(
            `Face Location: ${componentData.faceLocation.x}, ${componentData.faceLocation.y}, ${componentData.faceLocation.z}`
        );
        world.sendMessage(`Player: ${componentData.player.name}`);
    }
}
