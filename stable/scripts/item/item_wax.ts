import {
    ItemComponentUseOnEvent,
    BlockSignComponent,
    Player,
    Block,
    BlockPermutation,
    MolangVariableMap,
    Direction,
    Dimension,
    Vector3
} from '@minecraft/server';
import * as adk from 'adk-scripts-server';
import { getRandomVelocity, nextDouble, vectorOfCenter } from 'utils/math';

export function onUseOnWax(componentData: ItemComponentUseOnEvent) {
    const REGEX: RegExp = new RegExp(
        'minecraft:(?:[a-z]\\w+_)?(?:standing|wall|hanging)_sign'
    );
    const sign_component: BlockSignComponent = adk.ComponentBlockSign.get(
        componentData.block
    );
    const player: Player = componentData.source as Player;
    const block: Block = componentData.block;

    if (REGEX.test(block.typeId)) {
        sign_component.setWaxed(true);
        adk.PlayerHelper.decrementStack(player);
        spawnWaxParticles(block);

        return;
    }
    if (block.typeId.includes('copper') && !block.typeId.includes('waxed')) {
        adk.PlayerHelper.decrementStack(player);
        let new_block: string = 'minecraft:waxed_' + block.typeId.substring(10);
        if (new_block == 'minecraft:waxed_copper_block')
            new_block = 'minecraft:waxed_copper';

        if (
            block.typeId.includes('door') &&
            !block.typeId.includes('trapdoor')
        ) {
            if (!block.permutation.getState('upper_block_bit'))
                player.runCommand(
                    `setblock ${block.location.x} ${block.location.y} ${
                        block.location.z
                    } ${new_block}["direction"=${block.permutation.getState(
                        'direction'
                    )}, "door_hinge_bit"=${block.permutation.getState(
                        'door_hinge_bit'
                    )}, "open_bit"=${block.permutation.getState('open_bit')}]`
                );
            else {
                const block_below: Block | undefined = block.below();
                if (!block_below) return;
                player.runCommand(
                    `setblock ${block.location.x} ${block.location.y - 1} ${
                        block.location.z
                    } ${new_block}["direction"=${block_below.permutation.getState(
                        'direction'
                    )}, "door_hinge_bit"=${block_below.permutation.getState(
                        'door_hinge_bit'
                    )}, "open_bit"=${block_below.permutation.getState(
                        'open_bit'
                    )}]`
                );
            }
            spawnWaxParticles(block);

            return;
        }

        if (Object.keys(block.permutation.getAllStates()).length == 0) {
            block.setType(new_block);
            spawnWaxParticles(block);

            return;
        }

        block.setPermutation(
            BlockPermutation.resolve(
                new_block,
                block.permutation.getAllStates()
            )
        );
        spawnWaxParticles(block);

        return;
    }
}

function spawnWaxParticles(block: Block) {
    for (const direction in Direction) {
        const count: number = Math.floor(Math.random() * 2) + 3;
        for (let b: number = 0; b < count; b++) {
            spawnParticle(
                block.dimension,
                block.location,
                'minecraft:wax_particle',
                direction as Direction,
                getRandomVelocity(),
                0.5
            );
        }
    }
}

function spawnParticle(
    dimension: Dimension,
    block_location: Vector3,
    effect: string,
    direction: Direction,
    velocity: Vector3,
    offset_multiplier: number
): void {
    const vector: Vector3 = vectorOfCenter(block_location);
    const { x, y, z } = adk.DirectionHelper.toVector3(direction);
    const world_x: number =
        vector.x + (x == 0 ? nextDouble(-0.5, 0.5) : x * offset_multiplier);
    const world_y: number =
        vector.y + (y == 0 ? nextDouble(-0.5, 0.5) : y * offset_multiplier);
    const world_z: number =
        vector.z + (z == 0 ? nextDouble(-0.5, 0.5) : z * offset_multiplier);
    const particle_velocity_x: number = x == 0 ? velocity.x : 0;
    const particle_velocity_y: number = y == 0 ? velocity.y : 0;
    const particle_velocity_z: number = z == 0 ? velocity.z : 0;
    const molang: MolangVariableMap = new MolangVariableMap();
    molang.setColorRGB('variable.color', {
        red: 0.91,
        green: 0.55,
        blue: 0.08
    });
    molang.setVector3('variable.direction', {
        x: (particle_velocity_x * 0.01) / 2.0,
        y: particle_velocity_y * 0.01,
        z: (particle_velocity_z * 0.01) / 2.0
    });
    dimension.spawnParticle(
        effect,
        { x: world_x, y: world_y, z: world_z },
        molang
    );
}
