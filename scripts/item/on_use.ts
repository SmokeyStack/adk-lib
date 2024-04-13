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
