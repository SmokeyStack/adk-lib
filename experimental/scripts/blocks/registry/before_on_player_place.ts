import {
    BlockComponentPlayerPlaceBeforeEvent,
    BlockCustomComponent,
    CustomComponentParameters
} from '@minecraft/server';
import { beforeOnPlayerPlaceTurnInto } from 'blocks/turn_into';
import { beforeOnPlayerPlaceDoubleSlab } from 'blocks/double_slab';
import { beforeOnPlayerPlaceSugarCane } from 'blocks/sugar_cane';
import { beforeOnPlayerPlaceStairs } from 'blocks/stairs';
import * as adk from 'adk-scripts-server';

abstract class BeforeOnPlayerPlace implements BlockCustomComponent {
    abstract beforeOnPlayerPlace(
        componentData: BlockComponentPlayerPlaceBeforeEvent,
        paramData?: CustomComponentParameters
    ): void;
}

class Debug extends BeforeOnPlayerPlace {
    beforeOnPlayerPlace(componentData: BlockComponentPlayerPlaceBeforeEvent) {
        console.log(adk.Debug.logEventData(componentData));
    }
}

class Cancel extends BeforeOnPlayerPlace {
    beforeOnPlayerPlace(componentData: BlockComponentPlayerPlaceBeforeEvent) {
        componentData.cancel = true;
    }
}

class TurnInto extends BeforeOnPlayerPlace {
    beforeOnPlayerPlace(
        componentData: BlockComponentPlayerPlaceBeforeEvent,
        paramData: CustomComponentParameters
    ) {
        beforeOnPlayerPlaceTurnInto(componentData, paramData);
    }
}

class DoubleSlab extends BeforeOnPlayerPlace {
    beforeOnPlayerPlace(
        componentData: BlockComponentPlayerPlaceBeforeEvent
    ): void {
        beforeOnPlayerPlaceDoubleSlab(componentData);
    }
}

class SugarCane extends BeforeOnPlayerPlace {
    beforeOnPlayerPlace(
        componentData: BlockComponentPlayerPlaceBeforeEvent
    ): void {
        beforeOnPlayerPlaceSugarCane(componentData);
    }
}

class Stairs extends BeforeOnPlayerPlace {
    beforeOnPlayerPlace(
        componentData: BlockComponentPlayerPlaceBeforeEvent
    ): void {
        beforeOnPlayerPlaceStairs(componentData);
    }
}

enum BeforeOnPlayerPlaceKey {
    Debug = 'debug',
    Cancel = 'cancel',
    TurnInto = 'turn_into',
    DoubleSlab = 'double_slab',
    SugarCane = 'sugar_cane',
    Stairs = 'stairs'
}

export const BEFORE_ON_PLAYER_PLACE_REGISTRY: Map<
    BeforeOnPlayerPlaceKey,
    BeforeOnPlayerPlace
> = new Map([
    [BeforeOnPlayerPlaceKey.Debug, new Debug()],
    [BeforeOnPlayerPlaceKey.Cancel, new Cancel()],
    [BeforeOnPlayerPlaceKey.TurnInto, new TurnInto()],
    [BeforeOnPlayerPlaceKey.DoubleSlab, new DoubleSlab()],
    [BeforeOnPlayerPlaceKey.SugarCane, new SugarCane()],
    [BeforeOnPlayerPlaceKey.Stairs, new Stairs()]
]);
