import {
    Block,
    BlockComponentPlayerDestroyEvent,
    BlockCustomComponent,
    ItemStack,
    MinecraftDimensionTypes,
    world
} from '@minecraft/server';
import { BlockHelper, Debug } from 'adk-scripts-server';
import { vectorOfCenter } from 'utils/math';
import { onPlayerDestroyDoubleSlab } from '../double_slab';

class onPlayerDestroy implements BlockCustomComponent {
    constructor() {
        this.onPlayerDestroy = this.onPlayerDestroy.bind(this);
    }
    onPlayerDestroy(_componentData: BlockComponentPlayerDestroyEvent) {}
}

export class debug extends onPlayerDestroy {
    onPlayerDestroy(componentData: BlockComponentPlayerDestroyEvent) {
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

export class spawnItem extends onPlayerDestroy {
    onPlayerDestroy(componentData: BlockComponentPlayerDestroyEvent) {
        if (componentData.player.getGameMode() == 'creative') return;

        const REGEX: RegExp = new RegExp('adk-lib:spawn_item_([^]+)');
        const tags: string[] =
            componentData.destroyedBlockPermutation.getTags();
        let results: string[] = [];

        for (const tag of tags)
            if (REGEX.exec(tag)) results.push(REGEX.exec(tag)[1]);

        results.forEach((result) => {
            componentData.dimension.spawnItem(
                new ItemStack(result),
                componentData.block.location
            );
        });
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

export class dropExperience extends onPlayerDestroy {
    onPlayerDestroy(componentData: BlockComponentPlayerDestroyEvent) {
        if (componentData.player.getGameMode() == 'creative') return;
        if (!world.gameRules.doTileDrops) return;

        const REGEX: RegExp = new RegExp('adk-lib:drop_experience_([0-9]+)');
        const tags: string[] =
            componentData.destroyedBlockPermutation.getTags();
        let experienceDrop: number;

        for (let tag of tags)
            if (REGEX.exec(tag)) {
                experienceDrop = parseInt(REGEX.exec(tag)[1]);
                break;
            }

        for (let a = 0; a < experienceDrop; a++)
            componentData.dimension.spawnEntity(
                'minecraft:xp_orb',
                vectorOfCenter(componentData.block.location)
            );
    }
}

export class destroyIce extends onPlayerDestroy {
    onPlayerDestroy(componentData: BlockComponentPlayerDestroyEvent): void {
        const block: Block = componentData.block;

        if (block.dimension.id == MinecraftDimensionTypes.nether) {
            block.setType('minecraft:air');
            return;
        }

        const blockBelow: Block = block.below();

        if (BlockHelper.blocksMovement(blockBelow) || block.isLiquid) {
            block.setType('minecraft:water');
            return;
        }
    }
}

export class doubleSlab extends onPlayerDestroy {
    onPlayerDestroy(componentData: BlockComponentPlayerDestroyEvent): void {
        onPlayerDestroyDoubleSlab(componentData);
    }
}
