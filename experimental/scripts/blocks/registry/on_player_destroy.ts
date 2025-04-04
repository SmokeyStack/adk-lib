import {
    Block,
    BlockComponentPlayerDestroyEvent,
    BlockCustomComponent,
    CustomComponentParameters,
    ItemStack,
    world
} from '@minecraft/server';
import { doesBlockBlockkMovement } from 'utils/helper';
import { vectorOfCenter } from 'utils/math';
import { onPlayerDestroyDoubleSlab } from '../double_slab';
import * as adk from 'adk-scripts-server';

abstract class OnPlayerDestroy implements BlockCustomComponent {
    abstract onPlayerDestroy(
        componentData: BlockComponentPlayerDestroyEvent,
        paramData?: CustomComponentParameters
    ): void;
}

class Debug extends OnPlayerDestroy {
    onPlayerDestroy(componentData: BlockComponentPlayerDestroyEvent) {
        console.log(adk.Debug.logEventData(componentData));
    }
}

class SpawnItem extends OnPlayerDestroy {
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

class Regenerate extends OnPlayerDestroy {
    onPlayerDestroy(componentData: BlockComponentPlayerDestroyEvent) {
        componentData.block.setType(
            componentData.destroyedBlockPermutation.type
        );
    }
}

class DropExperience extends OnPlayerDestroy {
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

class MeltIce extends OnPlayerDestroy {
    onPlayerDestroy(componentData: BlockComponentPlayerDestroyEvent): void {
        const block: Block = componentData.block;

        if (block.dimension.id == 'minecraft:nether') {
            block.setType('minecraft:air');
            return;
        }

        const blockBelow: Block = block.below();

        if (doesBlockBlockkMovement(blockBelow) || block.isLiquid) {
            block.setType('minecraft:water');
            return;
        }
    }
}

class DoubleSlab extends OnPlayerDestroy {
    onPlayerDestroy(componentData: BlockComponentPlayerDestroyEvent): void {
        onPlayerDestroyDoubleSlab(componentData);
    }
}

enum OnPlayerDestroyKey {
    Debug = 'debug',
    SpawnItem = 'spawn_item',
    Regenerate = 'regenerate',
    DropExperience = 'drop_experience',
    MeltIce = 'melt_ice',
    DoubleSlab = 'double_slab'
}

export const ON_PLAYER_DESTROY_REGISTRY: Map<
    OnPlayerDestroyKey,
    OnPlayerDestroy
> = new Map([
    [OnPlayerDestroyKey.Debug, new Debug()],
    [OnPlayerDestroyKey.Regenerate, new Regenerate()],
    [OnPlayerDestroyKey.SpawnItem, new SpawnItem()],
    [OnPlayerDestroyKey.DropExperience, new DropExperience()],
    [OnPlayerDestroyKey.MeltIce, new MeltIce()],
    [OnPlayerDestroyKey.DoubleSlab, new DoubleSlab()]
]);
