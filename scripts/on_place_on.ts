import {
    BlockComponentOnPlaceEvent,
    BlockCustomComponent,
    world
} from '@minecraft/server';

class onPlaceOn implements BlockCustomComponent {
    constructor() {
        this.onPlace = this.onPlace.bind(this);
    }
    onPlace(_componentData: BlockComponentOnPlaceEvent) {}
}

export class debug extends onPlaceOn {
    onPlace(componentData: BlockComponentOnPlaceEvent) {
        world.sendMessage(
            `Player placed block at ${componentData.block.x}, ${componentData.block.y}, ${componentData.block.z}.`
        );
        world.sendMessage(
            `Previous block was ${componentData.previousBlock.type.id}.`
        );
    }
}

export class changeIntoBedrock extends onPlaceOn {
    onPlace(componentData: BlockComponentOnPlaceEvent) {
        componentData.block.setType('minecraft:bedrock');
    }
}
