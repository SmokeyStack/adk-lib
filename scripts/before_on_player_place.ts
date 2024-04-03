import {
    BlockComponentPlayerPlaceBeforeEvent,
    BlockCustomComponent,
    BlockPermutation,
    world
} from '@minecraft/server';

class beforeOnPlayerPlace implements BlockCustomComponent {
    constructor() {
        this.beforeOnPlayerPlace = this.beforeOnPlayerPlace.bind(this);
    }
    beforeOnPlayerPlace(_componentData: BlockComponentPlayerPlaceBeforeEvent) {}
}

export class debug extends beforeOnPlayerPlace {
    beforeOnPlayerPlace(componentData: BlockComponentPlayerPlaceBeforeEvent) {
        componentData.cancel = true;
        world.sendMessage(
            `Player attempted to place block at ${componentData.block.x}, ${componentData.block.y}, ${componentData.block.z}.`
        );
        world.sendMessage('Cancelling placement');
    }
}

export class cancel extends beforeOnPlayerPlace {
    beforeOnPlayerPlace(componentData: BlockComponentPlayerPlaceBeforeEvent) {
        componentData.cancel = true;
    }
}

export class changeIntoBedrock extends beforeOnPlayerPlace {
    beforeOnPlayerPlace(componentData: BlockComponentPlayerPlaceBeforeEvent) {
        componentData.permutationToPlace =
            BlockPermutation.resolve('minecraft:bedrock');
    }
}
