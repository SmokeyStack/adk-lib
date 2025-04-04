import {
    BlockComponentOnPlaceEvent,
    BlockCustomComponent,
    CustomComponentParameters
} from '@minecraft/server';
import * as adk from 'adk-scripts-server';

abstract class OnPlace implements BlockCustomComponent {
    abstract onPlace(
        componentData: BlockComponentOnPlaceEvent,
        paramData?: CustomComponentParameters
    ): void;
}

class Debug extends OnPlace {
    onPlace(componentData: BlockComponentOnPlaceEvent) {
        console.log(adk.Debug.logEventData(componentData));
    }
}

class TurnInto extends OnPlace {
    onPlace(componentData: BlockComponentOnPlaceEvent) {
        componentData.block.setType('minecraft:bedrock');
    }
}

enum OnPlaceKey {
    Debug = 'debug',
    TurnInto = 'turn_into'
}

export const ON_PLACE_REGISTRY: Map<OnPlaceKey, OnPlace> = new Map([
    [OnPlaceKey.Debug, new Debug()],
    [OnPlaceKey.TurnInto, new TurnInto()]
]);
