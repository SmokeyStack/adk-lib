import {
    BlockComponentPlayerPlaceBeforeEvent,
    BlockCustomComponent,
    BlockPermutation
} from '@minecraft/server';

class beforeOnPlayerPlace implements BlockCustomComponent {
    constructor() {
        this.beforeOnPlayerPlace = this.beforeOnPlayerPlace.bind(this);
    }
    beforeOnPlayerPlace(_componentData: BlockComponentPlayerPlaceBeforeEvent) {}
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
