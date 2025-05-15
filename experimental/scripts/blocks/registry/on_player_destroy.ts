import {
    Block,
    BlockComponentPlayerDestroyEvent,
    BlockCustomComponent,
    CustomComponentParameters,
    ItemStack,
    world
} from '@minecraft/server';
import { onPlayerDestroyDoubleSlab } from '../double_slab';
import * as adk from 'adk-scripts-server';
import { ParameterMelt } from 'utils/shared_parameters';

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

type ParameterSpawnItem = {
    items: string[];
};

class SpawnItem extends OnPlayerDestroy {
    onPlayerDestroy(
        componentData: BlockComponentPlayerDestroyEvent,
        paramData: CustomComponentParameters
    ) {
        if (!componentData.player) return;

        if (componentData.player.getGameMode() == 'creative') return;
        if (!world.gameRules.doTileDrops) return;
        const param = paramData.params as ParameterSpawnItem;

        param.items.forEach((item) => {
            adk.Cache.getDimension(componentData.dimension.id).spawnItem(
                new ItemStack(item),
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

type ParameterDropExperience = {
    experience_reward: number;
};

class DropExperience extends OnPlayerDestroy {
    onPlayerDestroy(
        componentData: BlockComponentPlayerDestroyEvent,
        paramData: CustomComponentParameters
    ) {
        if (!componentData.player) return;

        if (componentData.player.getGameMode() == 'creative') return;
        if (!world.gameRules.doTileDrops) return;

        const param = paramData.params as ParameterDropExperience;

        for (let a = 0; a < param.experience_reward; a++)
            adk.Cache.getDimension(componentData.dimension.id).spawnEntity(
                'minecraft:xp_orb',
                componentData.block.center()
            );
    }
}

class Melt extends OnPlayerDestroy {
    onPlayerDestroy(
        componentData: BlockComponentPlayerDestroyEvent,
        paramData: CustomComponentParameters
    ): void {
        const block: Block = componentData.block;

        if (block.dimension.id == 'minecraft:nether') {
            block.setType('minecraft:air');
            return;
        }

        const block_below: Block | undefined = block.below();

        if (!block_below) return;
        if (adk.BlockHelper.blocksMovement(block_below) || block.isLiquid) {
            const param = paramData.params as ParameterMelt;
            block.setType(param.melted_state);
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
    Melt = 'melt',
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
    [OnPlayerDestroyKey.Melt, new Melt()],
    [OnPlayerDestroyKey.DoubleSlab, new DoubleSlab()]
]);
