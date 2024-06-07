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
import { decrementStack } from '../../utils/helper';
import {
    directionToVector3,
    getRandomVelocity,
    nextDouble,
    vectorOfCenter
} from 'utils/math';

export function onUseOnWax(componentData: ItemComponentUseOnEvent) {
    const REGEX: RegExp = new RegExp(
        'minecraft:(?:[a-z]\\w+_)?(?:standing|wall|hanging)_sign'
    );
    let signComponent: BlockSignComponent = componentData.block.getComponent(
        'sign'
    ) as BlockSignComponent;
    let player: Player = componentData.source as Player;
    let block: Block = componentData.block;

    if (REGEX.test(block.typeId)) {
        signComponent.setWaxed(true);
        decrementStack(player);
        spawnWaxParticles(block);

        return;
    }
    if (block.typeId.includes('copper') && !block.typeId.includes('waxed')) {
        decrementStack(player);
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
    let { x, y, z } = directionToVector3(direction);
    let worldX: number =
        vector.x + (x == 0 ? nextDouble(-0.5, 0.5) : x * offsetMultiplier);
    let worldY: number =
        vector.y + (y == 0 ? nextDouble(-0.5, 0.5) : y * offsetMultiplier);
    let worldZ: number =
        vector.z + (z == 0 ? nextDouble(-0.5, 0.5) : z * offsetMultiplier);
    let particleVelocityX: number = x == 0 ? velocity.x : 0;
    let particleVelocityY: number = y == 0 ? velocity.y : 0;
    let particleVelocityZ: number = z == 0 ? velocity.z : 0;
    let molang: MolangVariableMap = new MolangVariableMap();
    molang.setColorRGB('variable.color', {
        red: 0.91,
        green: 0.55,
        blue: 0.08
    });
    molang.setVector3('variable.direction', {
        x: (particleVelocityX * 0.01) / 2.0,
        y: particleVelocityY * 0.01,
        z: (particleVelocityZ * 0.01) / 2.0
    });
    dimension.spawnParticle(
        effect,
        { x: worldX, y: worldY, z: worldZ },
        molang
    );
}
