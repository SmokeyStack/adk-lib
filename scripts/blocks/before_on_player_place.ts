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
        world.sendMessage(`Cancel: ${componentData.cancel}`);
        world.sendMessage(`Face: ${componentData.face}`);
        world.sendMessage(
            `Permutation To Place: ${componentData.permutationToPlace.type.id}`
        );
        world.sendMessage(`Player: ${componentData.player.name}`);
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
