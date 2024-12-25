import {
    BlockComponentPlayerPlaceBeforeEvent,
    BlockCustomComponent
} from '@minecraft/server';
import { Debug } from 'adk-scripts-server';
import { beforeOnPlayerPlaceTurnInto } from 'blocks/turn_into';
import { beforeOnPlayerPlaceDoubleSlab } from 'blocks/double_slab';
import { beforeOnPlayerPlaceSugarCane } from 'blocks/sugar_cane';
import { beforeOnPlayerPlaceStairs } from 'blocks/stairs';

class beforeOnPlayerPlace implements BlockCustomComponent {
    constructor() {
        this.beforeOnPlayerPlace = this.beforeOnPlayerPlace.bind(this);
    }
    beforeOnPlayerPlace(_componentData: BlockComponentPlayerPlaceBeforeEvent) {}
}

export class debug extends beforeOnPlayerPlace {
    beforeOnPlayerPlace(componentData: BlockComponentPlayerPlaceBeforeEvent) {
        let data: Object = Debug.logEventData(
            componentData,
            componentData.constructor.name
        );
        let result: string = JSON.stringify(
            Object.keys(data)
                .sort()
                .reduce((result, key) => {
                    result[key] = data[key];
                    return result;
                }, {}),
            null,
            4
        );
        console.log(result);
    }
}

export class cancel extends beforeOnPlayerPlace {
    beforeOnPlayerPlace(componentData: BlockComponentPlayerPlaceBeforeEvent) {
        componentData.cancel = true;
    }
}

export class turnInto extends beforeOnPlayerPlace {
    beforeOnPlayerPlace(componentData: BlockComponentPlayerPlaceBeforeEvent) {
        beforeOnPlayerPlaceTurnInto(componentData);
    }
}

export class doubleSlab extends beforeOnPlayerPlace {
    beforeOnPlayerPlace(
        componentData: BlockComponentPlayerPlaceBeforeEvent
    ): void {
        beforeOnPlayerPlaceDoubleSlab(componentData);
    }
}

export class sugarCane extends beforeOnPlayerPlace {
    beforeOnPlayerPlace(
        componentData: BlockComponentPlayerPlaceBeforeEvent
    ): void {
        beforeOnPlayerPlaceSugarCane(componentData);
    }
}

export class stairs extends beforeOnPlayerPlace {
    beforeOnPlayerPlace(
        componentData: BlockComponentPlayerPlaceBeforeEvent
    ): void {
        beforeOnPlayerPlaceStairs(componentData);
    }
}
