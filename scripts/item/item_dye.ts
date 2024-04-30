import {
    ItemComponentUseOnEvent,
    BlockSignComponent,
    BlockPermutation,
    Vector3,
    DyeColor,
    SignSide
} from '@minecraft/server';
import { areVectorsEqual } from '../utils/vector';

export function onUseOnDye(componentData: ItemComponentUseOnEvent) {
    const REGEX: RegExp = new RegExp(
        'minecraft:(?:[a-z]\\w+_)?(?:standing|wall|hanging)_sign'
    );

    if (!REGEX.test(componentData.block.typeId)) return;

    let signComponent: BlockSignComponent =
        componentData.block.getComponent('sign');
    let blockPermutation: BlockPermutation =
        componentData.usedOnBlockPermutation;
    let playerLocation: Vector3 = componentData.source.location;
    let blockLocation: Vector3 = componentData.block.location;
    let flooredX: number, flooredZ: number;

    if (playerLocation.x > 0) flooredX = Math.floor(playerLocation.x);
    else flooredX = signedFloor(playerLocation.x);
    if (playerLocation.z > 0) flooredZ = Math.floor(playerLocation.z);
    else flooredZ = signedFloor(playerLocation.z);
    if (componentData.block.typeId.endsWith('wall_sign')) {
        dyeSignFacingDirection(
            blockPermutation,
            signComponent,
            playerLocation,
            blockLocation,
            DyeColor.Blue,
            flooredX,
            flooredZ
        );

        return;
    }
    if (componentData.block.typeId.endsWith('standing_sign')) {
        dyeSignGroundDirection(
            blockPermutation,
            signComponent,
            playerLocation,
            blockLocation,
            DyeColor.Blue,
            flooredX,
            flooredZ
        );

        return;
    }
    if (componentData.block.typeId.endsWith('hanging_sign')) {
        if (!blockPermutation.getState('attached_bit')) {
            dyeSignFacingDirection(
                blockPermutation,
                signComponent,
                playerLocation,
                blockLocation,
                DyeColor.Blue,
                flooredX,
                flooredZ
            );

            return;
        }

        dyeSignGroundDirection(
            blockPermutation,
            signComponent,
            playerLocation,
            blockLocation,
            DyeColor.Blue,
            flooredX,
            flooredZ
        );
    }
}

/**
 * @brief Dye the sign based on the player's location.
 * @param signComponent SignComponent
 * @param playerLocation Player's location
 * @param blockLocation Block's location
 * @param color DyeColor
 */
function dyeSign(
    signComponent: BlockSignComponent,
    playerLocation: Vector3,
    blockLocation: Vector3,
    color: DyeColor
): void {
    if (areVectorsEqual(playerLocation, blockLocation))
        signComponent.setTextDyeColor(color, SignSide.Front);
    else signComponent.setTextDyeColor(color, SignSide.Back);
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
 */
function dyeSignFacingDirection(
    blockPermutation: BlockPermutation,
    signComponent: BlockSignComponent,
    playerLocation: Vector3,
    blockLocation: Vector3,
    color: DyeColor,
    flooredX: number,
    flooredZ: number
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
                    color
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
                    color
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
                    color
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
                    color
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
 */
function dyeSignGroundDirection(
    blockPermutation: BlockPermutation,
    signComponent: BlockSignComponent,
    playerLocation: Vector3,
    blockLocation: Vector3,
    color: DyeColor,
    flooredX: number,
    flooredZ: number
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
                    color
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
                    color
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
                    color
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
                    color
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