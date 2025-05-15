import {
    ItemComponentUseOnEvent,
    BlockSignComponent,
    BlockPermutation,
    Vector3,
    DyeColor,
    SignSide,
    Player,
    CustomComponentParameters
} from '@minecraft/server';
import * as adk from 'adk-scripts-server';

type ParameterDye = {
    color: string;
};

export function onUseOnDye(
    componentData: ItemComponentUseOnEvent,
    paramData: CustomComponentParameters
) {
    const param = paramData.params as ParameterDye;
    let sign_component: BlockSignComponent = adk.ComponentBlockSign.get(
        componentData.block
    );
    let block_permutation: BlockPermutation =
        componentData.usedOnBlockPermutation;
    let player_location: Vector3 = componentData.source.location;
    let block_location: Vector3 = componentData.block.location;
    let floored_x: number, floored_z: number;
    let player: Player = componentData.source as Player;
    if (player_location.x > 0) floored_x = Math.floor(player_location.x);
    else floored_x = signedFloor(player_location.x);
    if (player_location.z > 0) floored_z = Math.floor(player_location.z);
    else floored_z = signedFloor(player_location.z);
    if (componentData.block.typeId.endsWith('wall_sign')) {
        dyeSignFacingDirection(
            block_permutation,
            sign_component,
            player_location,
            block_location,
            DyeColor[param.color],
            floored_x,
            floored_z,
            player
        );
        return;
    }
    if (componentData.block.typeId.endsWith('standing_sign')) {
        dyeSignGroundDirection(
            block_permutation,
            sign_component,
            player_location,
            block_location,
            DyeColor[param.color],
            floored_x,
            floored_z,
            player
        );
        return;
    }
    if (componentData.block.typeId.endsWith('hanging_sign')) {
        if (!block_permutation.getState('attached_bit')) {
            dyeSignFacingDirection(
                block_permutation,
                sign_component,
                player_location,
                block_location,
                DyeColor[param.color],
                floored_x,
                floored_z,
                player
            );

            return;
        }
        dyeSignGroundDirection(
            block_permutation,
            sign_component,
            player_location,
            block_location,
            DyeColor[param.color],
            floored_x,
            floored_z,
            player
        );
    }
}

/**
 * Dye the sign based on the player's location.
 *
 * @param sign_component SignComponent
 * @param player_location Player's location
 * @param block_location Block's location
 * @param color DyeColor
 */
function dyeSign(
    sign_component: BlockSignComponent,
    player_location: Vector3,
    block_location: Vector3,
    color: DyeColor,
    player: Player
): void {
    const side = adk.Vector3Helper.equals(player_location, block_location)
        ? SignSide.Front
        : SignSide.Back;
    if (sign_component.getTextDyeColor(side) !== color) {
        sign_component.setTextDyeColor(color, side);
        adk.PlayerHelper.decrementStack(player);
    }
}

/**
 * @brief This function is for dyeing the sign if it's a wall sign, or hanging sign.
 * @param blockPermutation BlockPermutation
 * @param signComponent SignComponent
 * @param playerLocation Player's location
 * @param blockLocation Block's location
 * @param color DyeColor
 * @param flooredX Floored X
 * @param flooredZ Floored Z
 * @param player Player
 */
function dyeSignFacingDirection(
    blockPermutation: BlockPermutation,
    signComponent: BlockSignComponent,
    playerLocation: Vector3,
    blockLocation: Vector3,
    color: DyeColor,
    flooredX: number,
    flooredZ: number,
    player: Player
): void {
    switch (blockPermutation.getState('facing_direction')) {
        case 2:
            {
                if (playerLocation.z < blockLocation.z)
                    flooredZ = blockLocation.z;
                dyeSign(
                    signComponent,
                    {
                        x: blockLocation.x,
                        y: blockLocation.y,
                        z: flooredZ
                    },
                    blockLocation,
                    color,
                    player
                );
            }
            break;
        case 3:
            {
                if (playerLocation.z > blockLocation.z)
                    flooredZ = blockLocation.z;
                dyeSign(
                    signComponent,
                    {
                        x: blockLocation.x,
                        y: blockLocation.y,
                        z: flooredZ
                    },
                    blockLocation,
                    color,
                    player
                );
            }
            break;
        case 4:
            {
                if (playerLocation.x < blockLocation.x)
                    flooredX = blockLocation.x;
                dyeSign(
                    signComponent,
                    {
                        x: flooredX,
                        y: blockLocation.y,
                        z: blockLocation.z
                    },
                    blockLocation,
                    color,
                    player
                );
            }
            break;
        case 5:
            {
                if (playerLocation.x > blockLocation.x)
                    flooredX = blockLocation.x;
                dyeSign(
                    signComponent,
                    {
                        x: flooredX,
                        y: blockLocation.y,
                        z: blockLocation.z
                    },
                    blockLocation,
                    color,
                    player
                );
            }
            break;
        default:
            break;
    }
}

/**
 * @brief This function is for dyeing the sign if it's a standing sign or hanging sign(chains are connected to one point).
 * @param blockPermutation BlockPermutation
 * @param signComponent SignComponent
 * @param playerLocation Player's location
 * @param blockLocation Block's location
 * @param color DyeColor
 * @param flooredX Floored X
 * @param flooredZ Floored Z
 * @param player Player
 */
function dyeSignGroundDirection(
    blockPermutation: BlockPermutation,
    signComponent: BlockSignComponent,
    playerLocation: Vector3,
    blockLocation: Vector3,
    color: DyeColor,
    flooredX: number,
    flooredZ: number,
    player: Player
): void {
    switch (blockPermutation.getState('ground_sign_direction')) {
        case 0:
        case 1:
        case 2:
        case 14:
        case 15:
            {
                if (playerLocation.z > blockLocation.z)
                    flooredZ = blockLocation.z;
                dyeSign(
                    signComponent,
                    {
                        x: blockLocation.x,
                        y: blockLocation.y,
                        z: flooredZ
                    },
                    blockLocation,
                    color,
                    player
                );
            }
            break;
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
            {
                if (playerLocation.z < blockLocation.z)
                    flooredZ = blockLocation.z;
                dyeSign(
                    signComponent,
                    {
                        x: blockLocation.x,
                        y: blockLocation.y,
                        z: flooredZ
                    },
                    blockLocation,
                    color,
                    player
                );
            }
            break;
        case 3:
        case 4:
        case 5:
            {
                if (playerLocation.x < blockLocation.x)
                    flooredX = blockLocation.x;
                dyeSign(
                    signComponent,
                    {
                        x: flooredX,
                        y: blockLocation.y,
                        z: blockLocation.z
                    },
                    blockLocation,
                    color,
                    player
                );
            }
            break;
        case 11:
        case 12:
        case 13:
            {
                if (playerLocation.x > blockLocation.x)
                    flooredX = blockLocation.x;
                dyeSign(
                    signComponent,
                    {
                        x: flooredX,
                        y: blockLocation.y,
                        z: blockLocation.z
                    },
                    blockLocation,
                    color,
                    player
                );
            }
            break;
        default:
            break;
    }
}

/**
 * @brief Floor the number. Used for Vector3 player location since it returns a float.
 * @param value Number to floor
 * @returns Floored number
 */
function signedFloor(value: number): number {
    return Math.sign(value) * Math.ceil(Math.abs(value));
}
