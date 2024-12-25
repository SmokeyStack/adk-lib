import {
    ItemComponentUseOnEvent,
    BlockSignComponent,
    BlockPermutation,
    Vector3,
    DyeColor,
    SignSide,
    Player
} from '@minecraft/server';
import { PlayerHelper } from 'adk-scripts-server';

export function onUseOnDye(componentData: ItemComponentUseOnEvent) {
    const REGEX: RegExp = new RegExp(
        'minecraft:(?:[a-z]\\w+_)?(?:standing|wall|hanging)_sign'
    );

    if (!REGEX.test(componentData.block.typeId)) return;

    let tags: string[] = componentData.itemStack.getTags();
    const REGEX_DYE: RegExp = new RegExp('adk-lib:dye_([a-zA-Z]\\w+)');

    let signComponent: BlockSignComponent = componentData.block.getComponent(
        'sign'
    ) as BlockSignComponent;
    let blockPermutation: BlockPermutation =
        componentData.usedOnBlockPermutation;
    let playerLocation: Vector3 = componentData.source.location;
    let blockLocation: Vector3 = componentData.block.location;
    let flooredX: number, flooredZ: number;
    let color: string;
    let player: Player = componentData.source as Player;

    for (let tag of tags) {
        if (REGEX_DYE.exec(tag)) {
            color = REGEX_DYE.exec(tag)[1];

            break;
        }
    }
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
            DyeColor[color],
            flooredX,
            flooredZ,
            player
        );

        return;
    }
    if (componentData.block.typeId.endsWith('standing_sign')) {
        dyeSignGroundDirection(
            blockPermutation,
            signComponent,
            playerLocation,
            blockLocation,
            DyeColor[color],
            flooredX,
            flooredZ,
            player
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
                DyeColor[color],
                flooredX,
                flooredZ,
                player
            );

            return;
        }

        dyeSignGroundDirection(
            blockPermutation,
            signComponent,
            playerLocation,
            blockLocation,
            DyeColor[color],
            flooredX,
            flooredZ,
            player
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
    color: DyeColor,
    player: Player
): void {
    const side = Vector3Helper.equals(playerLocation, blockLocation)
        ? SignSide.Front
        : SignSide.Back;
    if (signComponent.getTextDyeColor(side) !== color) {
        signComponent.setTextDyeColor(color, side);
        PlayerHelper.decrementStack(player);
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
