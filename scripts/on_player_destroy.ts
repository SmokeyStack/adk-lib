import {
    BlockComponentPlayerDestroyEvent,
    BlockCustomComponent,
    ItemStack,
    world
} from '@minecraft/server';

class onPlayerDestroy implements BlockCustomComponent {
    constructor() {
        this.onPlayerDestroy = this.onPlayerDestroy.bind(this);
    }
    onPlayerDestroy(_componentData: BlockComponentPlayerDestroyEvent) {}
}

export class spawn_item extends onPlayerDestroy {
    onPlayerDestroy(componentData: BlockComponentPlayerDestroyEvent) {
        componentData.dimension.spawnItem(
            new ItemStack('minecraft:diamond'),
            componentData.block.location
        );

        world.sendMessage(
            `Player destroyed ${componentData.destroyedBlockPermutation.type.id} at ${componentData.block.location.x}, ${componentData.block.location.y}, ${componentData.block.location.z}`
        );
    }
}

export class regenerate extends onPlayerDestroy {
    onPlayerDestroy(componentData: BlockComponentPlayerDestroyEvent) {
        componentData.block.setType(
            componentData.destroyedBlockPermutation.type
        );

        world.sendMessage(
            `Player destroyed ${componentData.destroyedBlockPermutation.type.id} at ${componentData.block.location.x}, ${componentData.block.location.y}, ${componentData.block.location.z}`
        );
        world.sendMessage('Regenerating block...');
    }
}
