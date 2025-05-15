import {
    Block,
    BlockComponentPlayerInteractEvent,
    BlockComponentTickEvent,
    Dimension,
    EquipmentSlot,
    ItemStack,
    Player,
    Vector3
} from '@minecraft/server';
import type * as minecraftvanilladata from '@minecraft/vanilla-data';
import * as adk from 'adk-scripts-server';

const ParticleOffsets = {
    1: [{ x: 0.5, y: 0.5, z: 0.5 }],
    2: [
        { x: 0.375, y: 0.44, z: 0.56 },
        { x: 0.625, y: 0.5, z: 0.5 }
    ],
    3: [
        { x: 0.5, y: 0.313, z: 0.625 },
        { x: 0.375, y: 0.44, z: 0.5 },
        { x: 0.56, y: 0.5, z: 0.44 }
    ],
    4: [
        { x: 0.44, y: 0.313, z: 0.56 },
        { x: 0.625, y: 0.44, z: 0.56 },
        { x: 0.375, y: 0.44, z: 0.375 },
        { x: 0.56, y: 0.5, z: 0.375 }
    ]
};

function spawnParticle(world: Dimension, vector: Vector3): void {
    let chance: number = Math.random();
    if (chance < 0.3) {
        world.spawnParticle('minecraft:basic_smoke_particle', vector);
        if (chance < 0.17) {
            world.playSound(
                'ambient.candle',
                {
                    x: vector.x + 0.5,
                    y: vector.y + 0.5,
                    z: vector.z + 0.5
                },
                { volume: Math.random() + 1, pitch: Math.random() * 0.7 + 0.3 }
            );
        }
    }
    world.spawnParticle('minecraft:candle_flame_particle', vector);
}

function extinguish(block: Block, world: Dimension, vector: Vector3): void {
    const namespace: string = block.typeId.split(':')[0];
    const candles: number = block.permutation.getState(
        (namespace +
            ':candles') as keyof minecraftvanilladata.BlockStateSuperset
    ) as number;
    const lit: string = namespace + ':lit';
    block.setPermutation(
        block.permutation.withState(
            lit as keyof minecraftvanilladata.BlockStateSuperset,
            false
        )
    );
    world.playSound('extinguish.candle', vector, { volume: 1, pitch: 1 });
    ParticleOffsets[candles].forEach(
        (offset: { x: number; y: number; z: number }) => {
            world.spawnParticle('minecraft:basic_smoke_particle', {
                x: block.location.x + offset.x,
                y: block.location.y + offset.y,
                z: block.location.z + offset.z
            });
        }
    );
}

export function onTickCandle(data: BlockComponentTickEvent): void {
    let candles: number = data.block.permutation.getState(
        (data.block.typeId.split(':')[0] +
            ':candles') as keyof minecraftvanilladata.BlockStateSuperset
    ) as number;

    ParticleOffsets[candles].forEach(
        (offset: { x: number; y: number; z: number }) => {
            spawnParticle(data.dimension, {
                x: data.block.location.x + offset.x,
                y: data.block.location.y + offset.y,
                z: data.block.location.z + offset.z
            });
        }
    );
}

export function onInteractCandle(
    data: BlockComponentPlayerInteractEvent
): void {
    const player: Player = data.player!;
    const player_equipment: ItemStack = adk.PlayerHelper.getItemFromEquippable(
        player,
        EquipmentSlot.Mainhand
    );
    const block: Block = data.block;
    const dimension: Dimension = data.dimension;
    const namespace: string = block.typeId.split(':')[0];
    const is_lit: boolean = block.permutation.getState(
        `${namespace}:lit` as keyof minecraftvanilladata.BlockStateSuperset
    ) as boolean;
    const candles: number = data.block.permutation.getState(
        `${namespace}:candles` as keyof minecraftvanilladata.BlockStateSuperset
    ) as number;

    if (player_equipment === undefined && !is_lit) return;
    if (player_equipment === undefined && is_lit) {
        extinguish(block, dimension, block);
        return;
    }
    if (player_equipment.typeId === block.typeId && candles != 4) {
        block.setPermutation(
            block.permutation.withState(
                `${namespace}:candles` as keyof minecraftvanilladata.BlockStateSuperset,
                candles + 1
            )
        );
        adk.PlayerHelper.decrementStack(player);

        return;
    }
    if (
        (player_equipment.typeId == 'minecraft:flint_and_steel' ||
            player_equipment.typeId == 'minecraft:fire_charge') &&
        !is_lit
    ) {
        block.setPermutation(
            block.permutation.withState(
                `${namespace}:lit` as keyof minecraftvanilladata.BlockStateSuperset,
                true
            )
        );
        dimension.playSound('fire.ignite', block);
        ParticleOffsets[candles].forEach(
            (offset: { x: number; y: number; z: number }) => {
                spawnParticle(dimension, {
                    x: block.location.x + offset.x,
                    y: block.location.y + offset.y,
                    z: block.location.z + offset.z
                });
            }
        );

        return;
    }
}
