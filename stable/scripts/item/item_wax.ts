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
import {
    DirectionHelper,
    PlayerHelper,
    Vector3Builder
} from 'adk-scripts-server';
import { getRandomVelocity, nextDouble, vectorOfCenter } from 'utils/math';

export function onUseOnWax(componentData: ItemComponentUseOnEvent) {
    const REGEX: RegExp = new RegExp(
        'minecraft:(?:[a-z]\\w+_)?(?:standing|wall|hanging)_sign'
    );
    let sign_component: BlockSignComponent = componentData.block.getComponent(
        'sign'
    ) as BlockSignComponent;
    let player: Player = componentData.source as Player;
    let block: Block = componentData.block;

    if (REGEX.test(block.typeId)) {
        sign_component.setWaxed(true);
        PlayerHelper.decrementStack(player);
        spawnWaxParticles(block);

        return;
    }
    if (block.typeId.includes('copper') && !block.typeId.includes('waxed')) {
        PlayerHelper.decrementStack(player);
        let newBlock: string = 'minecraft:waxed_' + block.typeId.substring(10);
        if (newBlock == 'minecraft:waxed_copper_block')
            newBlock = 'minecraft:waxed_copper';

        if (
            block.typeId.includes('door') &&
            !block.typeId.includes('trapdoor')
        ) {
            if (!block.permutation.getState('upper_block_bit'))
                player.runCommand(
                    `setblock ${block.location.x} ${block.location.y} ${
                        block.location.z
                    } ${newBlock}["direction"=${block.permutation.getState(
                        'direction'
                    )}, "door_hinge_bit"=${block.permutation.getState(
                        'door_hinge_bit'
                    )}, "open_bit"=${block.permutation.getState('open_bit')}]`
                );
            else
                player.runCommand(
                    `setblock ${block.location.x} ${block.location.y - 1} ${
                        block.location.z
                    } ${newBlock}["direction"=${block
                        .below()
                        .permutation.getState(
                            'direction'
                        )}, "door_hinge_bit"=${block
                        .below()
                        .permutation.getState(
                            'door_hinge_bit'
                        )}, "open_bit"=${block
                        .below()
                        .permutation.getState('open_bit')}]`
                );
            spawnWaxParticles(block);

            return;
        }

        if (Object.keys(block.permutation.getAllStates()).length == 0) {
            block.setType(newBlock);
            spawnWaxParticles(block);

            return;
        }

        block.setPermutation(
            BlockPermutation.resolve(newBlock, block.permutation.getAllStates())
        );
        spawnWaxParticles(block);

        return;
    }
}

function spawnWaxParticles(block: Block) {
    for (let direction in Direction) {
        let count: number = Math.floor(Math.random() * 2) + 3;
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
    blockPosition: Vector3,
    effect: string,
    direction: Direction,
    velocity: Vector3,
    offsetMultiplier: number
): void {
    let vector: Vector3 = vectorOfCenter(blockPosition);
    let { x, y, z } = DirectionHelper.toVector3(direction);
    let world_x: number =
        vector.x + (x == 0 ? nextDouble(-0.5, 0.5) : x * offsetMultiplier);
    let world_y: number =
        vector.y + (y == 0 ? nextDouble(-0.5, 0.5) : y * offsetMultiplier);
    let world_z: number =
        vector.z + (z == 0 ? nextDouble(-0.5, 0.5) : z * offsetMultiplier);
    let particle_velocity_x: number = x == 0 ? velocity.x : 0;
    let particle_velocity_y: number = y == 0 ? velocity.y : 0;
    let particle_velocity_z: number = z == 0 ? velocity.z : 0;
    let molang: MolangVariableMap = new MolangVariableMap();
    molang.setColorRGB('variable.color', {
        red: 0.91,
        green: 0.55,
        blue: 0.08
    });
    new Vector3Builder(
        (particle_velocity_x * 0.01) / 2.0,
        particle_velocity_y * 0.01,
        (particle_velocity_z * 0.01) / 2.0
    );
    molang.setVector3(
        'variable.direction',
        new Vector3Builder(
            (particle_velocity_x * 0.01) / 2.0,
            particle_velocity_y * 0.01,
            (particle_velocity_z * 0.01) / 2.0
        )
    );
    dimension.spawnParticle(
        effect,
        new Vector3Builder(world_x, world_y, world_z),
        molang
    );
}
