import {
    ItemComponentUseEvent,
    ItemCustomComponent,
    world
} from '@minecraft/server';

class onUse implements ItemCustomComponent {
    constructor() {
        this.onUse = this.onUse.bind(this);
    }
    onUse(_componentData: ItemComponentUseEvent) {}
}

export class debug extends onUse {
    onUse(componentData: ItemComponentUseEvent) {
        world.sendMessage(`Item: ${componentData.itemStack.typeId}`);
        world.sendMessage(`Player: ${componentData.source.name}`);
    }
}

export class goatHorn extends onUse {
    onUse(componentData: ItemComponentUseEvent) {
        const REGEX: RegExp = new RegExp('adk-lib:instrument_([^]+)');
        let tags: string[] = componentData.itemStack.getTags();
        let instrument: string;

        for (let tag of tags)
            if (REGEX.exec(tag)) {
                instrument = REGEX.exec(tag)[1];

                break;
            }

        componentData.source.playSound(instrument, {
            volume: 16
        });
        componentData.itemStack
            .getComponent('cooldown')
            .startCooldown(componentData.source);
    }
}
