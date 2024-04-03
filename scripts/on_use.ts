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
        world.sendMessage(
            `Player attempted to use item ${componentData.itemStack.type.id}`
        );
    }
}
