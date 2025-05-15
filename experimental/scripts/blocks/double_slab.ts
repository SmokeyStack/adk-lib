import {
    BlockComponentPlayerPlaceBeforeEvent,
    Block,
    Player,
    ItemStack,
    EquipmentSlot,
    Direction,
    BlockPermutation,
    BlockComponentPlayerDestroyEvent
} from '@minecraft/server';
import type * as minecraftvanilladata from '@minecraft/vanilla-data';
import * as adk from 'adk-scripts-server';

export function beforeOnPlayerPlaceDoubleSlab(
    data: BlockComponentPlayerPlaceBeforeEvent
): void {
    const player: Player | undefined = data.player;
    if (!player) return;
    const player_equipment: ItemStack = adk.PlayerHelper.getItemFromEquippable(
        player,
        EquipmentSlot.Mainhand
    );
    if (!player_equipment) return;

    const block: Block = data.block;
    const face: Direction = adk.DirectionHelper.getOpposite(data.face);
    const block_to_check: Block | undefined = block.offset(
        adk.DirectionHelper.toVector3(face)
    );

    if (!block_to_check) return;

    const namespace: string = block_to_check.typeId.split(':')[0];
    const block_state_double: string = namespace + ':is_double';
    const block_state_half: string = 'minecraft:vertical_half';

    if (
        block_to_check.permutation.getState(
            block_state_double as keyof minecraftvanilladata.BlockStateSuperset
        )
    )
        return;
    if (block_to_check.typeId !== player_equipment.typeId) return;
    if (face === Direction.Up || face === Direction.Down) {
        const state = block_to_check.permutation.getState(
            block_state_half as keyof minecraftvanilladata.BlockStateSuperset
        );
        if (
            (face === Direction.Up && state === 'top') ||
            (face === Direction.Down && state === 'bottom')
        ) {
            block_to_check.setPermutation(
                BlockPermutation.resolve(block_to_check.typeId, {
                    [block_state_double]: true
                })
            );
            data.cancel = true;
            adk.PlayerHelper.decrementStack(player);
        }
    }
}

export function onPlayerDestroyDoubleSlab(
    data: BlockComponentPlayerDestroyEvent
): void {
    const player: Player | undefined = data.player;
    if (!player) return;

    const player_equipement: ItemStack = adk.PlayerHelper.getItemFromEquippable(
        player,
        EquipmentSlot.Mainhand
    );
    if (player.getGameMode() == 'creative') return;
    if (player_equipement === undefined) return;

    const has_silk_touch = adk.ComponentItemEnchantable.hasEnchantment(
        player_equipement,
        'silk_touch'
    );

    if (!has_silk_touch) return;

    adk.Cache.getDimension(data.dimension.id).spawnItem(
        new ItemStack(data.destroyedBlockPermutation.type.id),
        data.block.location
    );
}
