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
            `Previous Block: ${componentData.previousBlock.type.id}`
        );
    }
}

export class changeIntoBedrock extends onPlaceOn {
    onPlace(componentData: BlockComponentOnPlaceEvent) {
        componentData.block.setType('minecraft:bedrock');
    }
}
