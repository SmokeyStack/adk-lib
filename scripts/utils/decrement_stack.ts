import { Player, ItemStack } from '@minecraft/server';

export function decrementStack(player: Player): void {
    if (player.getGameMode() == 'creative') return;

    let item = player
        .getComponent('inventory')
        .container.getItem(player.selectedSlotIndex);

    if (item.amount == 1)
        player
            .getComponent('inventory')
            .container.setItem(player.selectedSlotIndex, undefined);
    else
        player
            .getComponent('inventory')
            .container.setItem(
                player.selectedSlotIndex,
                new ItemStack(item.typeId, item.amount - 1)
            );
}
