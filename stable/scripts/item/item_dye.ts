import {
    ItemComponentUseOnEvent,
    BlockSignComponent,
    BlockPermutation,
    Vector3,
    DyeColor,
    SignSide,
    Player
} from '@minecraft/server';
import {
    PlayerHelper,
    Vector3Builder,
    Vector3Helper
} from 'adk-scripts-server';

export function onUseOnDye(componentData: ItemComponentUseOnEvent) {
    const REGEX: RegExp = new RegExp(
        'minecraft:(?:[a-z]\\w+_)?(?:standing|wall|hanging)_sign'
    );

    if (!REGEX.test(componentData.block.typeId)) return;

    let tags: string[] = componentData.itemStack.getTags();
    const REGEX_DYE: RegExp = new RegExp('adk-lib:dye_([a-zA-Z]\\w+)');

    let sign_component: BlockSignComponent = componentData.block.getComponent(
        'sign'
    ) as BlockSignComponent;
    let block_permutation: BlockPermutation =
        componentData.usedOnBlockPermutation;
    let player_location: Vector3Builder = new Vector3Builder(
        componentData.source.location
    );
    let block_location: Vector3Builder = new Vector3Builder(
        componentData.block.location
    );
    let floored_x: number, floored_z: number;
    let color: string;
    let player: Player = componentData.source as Player;

    for (let tag of tags) {
        if (REGEX_DYE.exec(tag)) {
            color = REGEX_DYE.exec(tag)[1];

            break;
        }
    }
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
            DyeColor[color],
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
            DyeColor[color],
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
                DyeColor[color],
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
            DyeColor[color],
            floored_x,
            floored_z,
            player
        );
    }
}

/**
 * @brief Dye the sign based on the player's location.
 * @param sign_component SignComponent
 * @param player_location Player's location
 * @param block_location Block's location
 * @param color DyeColor
 */
function dyeSign(
    sign_component: BlockSignComponent,
    player_location: Vector3Builder,
    block_location: Vector3Builder,
    color: DyeColor,
    player: Player
): void {
    const side = Vector3Helper.equals(player_location, block_location)
        ? SignSide.Front
        : SignSide.Back;
    if (sign_component.getTextDyeColor(side) !== color) {
        sign_component.setTextDyeColor(color, side);
        PlayerHelper.decrementStack(player);
    }
}

/**
 * @brief This function is for dyeing the sign if it's a wall sign, or hanging sign.
 * @param block_permutation BlockPermutation
 * @param sign_component SignComponent
 * @param player_location Player's location
 * @param block_location Block's location
 * @param color DyeColor
 * @param floored_x Floored X
 * @param floored_z Floored Z
 * @param player Player
 */
function dyeSignFacingDirection(
    block_permutation: BlockPermutation,
    sign_component: BlockSignComponent,
    player_location: Vector3Builder,
    block_location: Vector3Builder,
    color: DyeColor,
    floored_x: number,
    floored_z: number,
    player: Player
): void {
    switch (block_permutation.getState('facing_direction')) {
        case 2:
            {
                if (player_location.z < block_location.z)
                    floored_z = block_location.z;
                dyeSign(
                    sign_component,
                    new Vector3Builder(
                        block_location.x,
                        block_location.y,
                        floored_z
                    ),
                    block_location,
                    color,
                    player
                );
            }
            break;
        case 3:
            {
                if (player_location.z > block_location.z)
                    floored_z = block_location.z;
                dyeSign(
                    sign_component,
                    new Vector3Builder(
                        block_location.x,
                        block_location.y,
                        floored_z
                    ),
                    block_location,
                    color,
                    player
                );
            }
            break;
        case 4:
            {
                if (player_location.x < block_location.x)
                    floored_x = block_location.x;
                dyeSign(
                    sign_component,
                    new Vector3Builder(
                        floored_x,
                        block_location.y,
                        block_location.z
                    ),
                    block_location,
                    color,
                    player
                );
            }
            break;
        case 5:
            {
                if (player_location.x > block_location.x)
                    floored_x = block_location.x;
                dyeSign(
                    sign_component,
                    new Vector3Builder(
                        floored_x,
                        block_location.y,
                        block_location.z
                    ),
                    block_location,
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
 * @param block_permutation BlockPermutation
 * @param sign_component SignComponent
 * @param player_location Player's location
 * @param block_location Block's location
 * @param color DyeColor
 * @param floored_x Floored X
 * @param floored_z Floored Z
 * @param player Player
 */
function dyeSignGroundDirection(
    block_permutation: BlockPermutation,
    sign_component: BlockSignComponent,
    player_location: Vector3Builder,
    block_location: Vector3Builder,
    color: DyeColor,
    floored_x: number,
    floored_z: number,
    player: Player
): void {
    switch (block_permutation.getState('ground_sign_direction')) {
        case 0:
        case 1:
        case 2:
        case 14:
        case 15:
            {
                if (player_location.z > block_location.z)
                    floored_z = block_location.z;
                dyeSign(
                    sign_component,
                    new Vector3Builder(
                        block_location.x,
                        block_location.y,
                        floored_z
                    ),
                    block_location,
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
                if (player_location.z < block_location.z)
                    floored_z = block_location.z;
                dyeSign(
                    sign_component,
                    new Vector3Builder(
                        block_location.x,
                        block_location.y,
                        floored_z
                    ),
                    block_location,
                    color,
                    player
                );
            }
            break;
        case 3:
        case 4:
        case 5:
            {
                if (player_location.x < block_location.x)
                    floored_x = block_location.x;
                dyeSign(
                    sign_component,
                    new Vector3Builder(
                        floored_x,
                        block_location.y,
                        block_location.z
                    ),
                    block_location,
                    color,
                    player
                );
            }
            break;
        case 11:
        case 12:
        case 13:
            {
                if (player_location.x > block_location.x)
                    floored_x = block_location.x;
                dyeSign(
                    sign_component,
                    new Vector3Builder(
                        floored_x,
                        block_location.y,
                        block_location.z
                    ),
                    block_location,
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
