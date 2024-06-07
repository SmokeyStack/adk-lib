import {
    Block,
    BlockComponentPlayerInteractEvent,
    BlockComponentTickEvent,
    BlockPermutation,
    Dimension,
    EquipmentSlot,
    ItemStack,
    Player,
    Vector3
} from '@minecraft/server';

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
        namespace + ':candles'
    ) as number;
    const lit: string = namespace + ':lit';
    block.setPermutation(
        BlockPermutation.resolve(block.typeId, { [lit]: false })
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
        data.block.typeId.split(':')[0] + ':candles'
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
    const player: Player = data.player;
    const playerEquipment: ItemStack = player
        .getComponent('equippable')
        .getEquipment(EquipmentSlot.Mainhand);
    const namespace: string = data.block.typeId.split(':')[0];
    const isLit: boolean = data.block.permutation.getState(
        namespace + ':lit'
    ) as boolean;
    const candles: number = data.block.permutation.getState(
        namespace + ':candles'
    ) as number;

    if (playerEquipment === undefined && !isLit) return;
    if (playerEquipment === undefined && isLit) {
        extinguish(data.block, data.dimension, data.block.location);
        return;
    }
    if (
        (playerEquipment.typeId == 'minecraft:flint_and_steel' ||
            playerEquipment.typeId == 'minecraft:fire_charge') &&
        !isLit
    ) {
        data.block.setPermutation(
            BlockPermutation.resolve(data.block.typeId, {
                [namespace + ':lit']: true
            })
        );
        data.dimension.playSound('fire.ignite', data.block.location);
        ParticleOffsets[candles].forEach(
            (offset: { x: number; y: number; z: number }) => {
                spawnParticle(data.dimension, {
                    x: data.block.location.x + offset.x,
                    y: data.block.location.y + offset.y,
                    z: data.block.location.z + offset.z
                });
            }
        );
        return;
    }
}
