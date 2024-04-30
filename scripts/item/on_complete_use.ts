import {
    ItemComponentCompleteUseEvent,
    ItemCustomComponent
} from '@minecraft/server';

class onCompleteUse implements ItemCustomComponent {
    constructor() {
        this.onCompleteUse = this.onCompleteUse.bind(this);
    }
    onCompleteUse(_componentData: ItemComponentCompleteUseEvent) {}
}
