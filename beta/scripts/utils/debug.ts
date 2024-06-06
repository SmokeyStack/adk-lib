import {
    Block,
    BlockComponentTypes,
    BlockInventoryComponent,
    BlockPermutation,
    BlockPistonComponent,
    BlockRecordPlayerComponent,
    BlockSignComponent,
    Container,
    Dimension,
    Entity,
    EntityBreathableComponent,
    EntityRideableComponent,
    EntityTypeFamilyComponent,
    ItemCooldownComponent,
    ItemDurabilityComponent,
    ItemEnchantableComponent,
    ItemStack,
    Player,
    SignSide
} from '@minecraft/server';

export function logEventData(
    data: Object,
    prefix = '',
    skip: string[] = []
): Object {
    const prototype: Object = Object.getPrototypeOf(data);
    let result: Object = {};
    let parentName: string = '';

    for (const key in data) {
        if (skip.includes(key)) continue;
        const value: any = data[key];
        parentName = getParentPrototypeName(data, key);
        let fullKey: string = prefix ? `${prefix}.${key}` : key;

        if (typeof data[key] === 'object' && value !== null) {
            if (!prototype.hasOwnProperty(key))
                fullKey = parentName ? `${parentName}.${key}` : key;

            result[fullKey] = logEventData(value, value.constructor.name, skip);
        } else if (typeof data[key] === 'function') {
            // console.warn('Function: ' + fullKey);
            switch (data.constructor) {
                case Dimension:
                    result[fullKey] = logDimensionFunctions(data, key);
                    break;
                case Entity:
                    result[fullKey] = logEntityFunctions(data, key, skip);
                    break;
                case Player:
                    result[fullKey] = logPlayerFunctions(data, key, skip);
                    break;
                case Block:
                    result[fullKey] = logBlockFunctions(data, key, skip);
                    break;
                case BlockPermutation:
                    result[fullKey] = logBlockPermutationFunctions(data, key);
                    break;
                case ItemStack:
                    result[fullKey] = logItemStackFunctions(data, key, skip);
                    break;
                case Container:
                    result[fullKey] = logContainerFunctions(data, key, skip);
                    break;
                case EntityBreathableComponent:
                    result[fullKey] = logEntityBreathableComponentFunctions(
                        data,
                        key
                    );
                    break;
                case EntityTypeFamilyComponent:
                    result[fullKey] = logEntityTypeFamilyComponentFunctions(
                        data,
                        key
                    );
                    break;
                case EntityRideableComponent:
                    result[fullKey] = logEntityRideableComponentFunctions(
                        data,
                        key
                    );
                    break;
                case BlockSignComponent:
                    result[fullKey] = logBlockSignComponentFunctions(data, key);
                    break;
                case BlockInventoryComponent:
                    result[fullKey] = logBlockInventoryComponentFunctions(
                        data,
                        key
                    );
                    break;
                case BlockPistonComponent:
                    result[fullKey] = logBlockPistonComponentFunctions(
                        data,
                        key
                    );
                    break;
                case BlockRecordPlayerComponent:
                    result[fullKey] = logBlockRecordPlayerComponentFunctions(
                        data,
                        key
                    );
                    break;
                case ItemDurabilityComponent:
                    result[fullKey] = logItemDurabilityComponentFunctions(
                        data,
                        key
                    );
                    break;
                case ItemEnchantableComponent:
                    result[fullKey] = logItemEnchantableComponentFunctions(
                        data,
                        key
                    );
                    break;
                default:
                    break;
            }
        } else {
            if (prototype.hasOwnProperty(key)) {
                result[fullKey] = value;
            } else {
                fullKey = parentName ? `${parentName}.${key}` : key;
                result[fullKey] = value;
            }
        }
    }

    result = Object.keys(result)
        .sort()
        .reduce((object, key) => {
            object[key] = result[key];
            return object;
        }, {});

    return result;
}

function logDimensionFunctions(data: any, key: string): any {
    switch (key) {
        case 'getPlayers':
            return logEventData(data[key](), '', ['dimension']);
        case 'getWeather':
            return data[key]();
        default:
            break;
    }
}

function logEntityFunctions(data: any, key: string, skip: string[] = []): any {
    switch (key) {
        case 'getBlockFromViewDirection':
            if (
                data[key]({
                    includeLiquidBlocks: true,
                    includePassableBlocks: true
                }) === undefined
            )
                return;
            return logEventData(
                data[key]({
                    includeLiquidBlocks: true,
                    includePassableBlocks: true
                }),
                '',
                ['dimension']
            );
        case 'getComponents':
            skip.push('entity');
            return data[key]().map((component: any) =>
                logEventData(component, component.constructor.name, skip)
            );
        case 'getDynamicPropertyIds':
            return data[key]().map((id: string) => ({
                key: id,
                value: data.getDynamicProperty(id)
            }));
        case 'getDynamicPropertyTotalByteCount':
            return data[key]();
        case 'getEffects':
            return data[key]().map((effect: any) =>
                logEventData(effect, effect.constructor.name)
            );
        case 'getEntitiesFromViewDirection':
            return logEventData(
                data[key]({
                    ignoreBlockCollision: false,
                    includeLiquidBlocks: false,
                    includePassableBlocks: false
                }),
                '',
                ['dimension']
            );
        case 'getHeadLocation':
            return data[key]();
        case 'getRotation':
            return data[key]();
        case 'getTags':
            return data[key]();
        case 'getVelocity':
            return data[key]();
        case 'getViewDirection':
            return data[key]();
        default:
            break;
    }
}

function logPlayerFunctions(data: any, key: string, skip: string[] = []): any {
    switch (key) {
        case 'getGameMode':
            return data[key]();
        case 'getSpawnPoint':
            if (data[key]() === undefined) return;
            return logEventData(data[key](), '', skip);
        case 'getTotalXp':
            return data[key]();
        case 'isOp':
            return data[key]();
        default:
            return logEntityFunctions(data, key, skip);
    }
}

function logBlockFunctions(data: any, key: string, skip: string[]): any {
    switch (key) {
        case 'getComponent': {
            skip.push('block');
            let result: any[] = [];
            for (const component in BlockComponentTypes) {
                if (data[key](BlockComponentTypes[component]) === undefined)
                    continue;
                result.push(
                    logEventData(
                        data[key](BlockComponentTypes[component]),
                        component,
                        skip
                    )
                );
            }
            return result;
        }
        case 'getItemStack':
            if (data[key]() === undefined) return;
            return logEventData(data[key]());
        case 'getRedstonePower':
            return data[key]();
        case 'getTags':
            return data[key]();
        default:
            break;
    }
}

function logBlockPermutationFunctions(data: any, key: string): any {
    switch (key) {
        case 'getAllStates':
            return data[key]();
        case 'getItemStack':
            if (data[key]() === undefined) return;
            return logEventData(data[key]());
        case 'getTags':
            return data[key]();
        default:
            break;
    }
}

function logItemStackFunctions(data: any, key: string, skip: string[]): any {
    switch (key) {
        case 'getCanDestroy':
            return data[key]();
        case 'getCanPlaceOn':
            return data[key]();
        case 'getComponents':
            return data[key]().map((component: any) =>
                logEventData(component, component.constructor.name)
            );
        case 'getDynamicPropertyIds':
            return data[key]().map((id: string) => ({
                key: id,
                value: data.getDynamicProperty(id)
            }));
        case 'getDynamicPropertyTotalByteCount':
            return data[key]();
        case 'getLore':
            return data[key]();
        case 'getTags':
            return data[key]();
        default:
            break;
    }
}

function logContainerFunctions(data: any, key: string, skip: string[]): any {
    switch (key) {
        case 'getItem': {
            let size: number = data['size'];
            let result: any[] = [];
            for (let index = 0; index < size; index++) {
                if (data[key](index) === undefined) continue;
                result.push({
                    slot: index,
                    content: logEventData(data[key](index))
                });
            }
            return result;
        }
        default:
            break;
    }
}

function logEntityBreathableComponentFunctions(data: any, key: string): any {
    switch (key) {
        case 'getBreatheBlocks':
            return logEventData(data[key]());
        case 'getNonBreatheBlocks':
            return logEventData(data[key]());
        default:
            break;
    }
}

function logEntityTypeFamilyComponentFunctions(data: any, key: string): any {
    switch (key) {
        case 'getTypeFamilies':
            return logEventData(data[key]());
        default:
            break;
    }
}

function logEntityRideableComponentFunctions(data: any, key: string): any {
    switch (key) {
        case 'getFamilyTypes':
            return logEventData(data[key]());
        case 'getRiders':
            return logEventData(data[key](), '', [
                'entityRidingOn',
                'dimension'
            ]);
        default:
            break;
    }
}

function logBlockSignComponentFunctions(data: any, key: string): any {
    switch (key) {
        case 'getRawText': {
            let result: any[] = [];
            for (const side in SignSide) {
                if (data[key](side) === undefined) continue;
                result.push(logEventData(data[key](side)));
            }
            return result;
        }
        case 'getText': {
            let result: any[] = [];
            for (const side in SignSide) {
                if (data[key](side) === undefined) continue;
                result.push({
                    side: side,
                    content: data[key](side)
                });
            }
            return result;
        }
        case 'getTextDyeColor': {
            let result: any[] = [];
            for (const side in SignSide) {
                if (data[key](side) === undefined) continue;
                result.push({
                    side: side,
                    content: data[key](side)
                });
            }
            return result;
        }
        default:
            break;
    }
}

function logBlockInventoryComponentFunctions(data: any, key: string): any {
    switch (key) {
        case 'getRawText': {
            let result: any[] = [];
            for (const side in SignSide) {
                if (data[key](side) === undefined) continue;
                result.push(logEventData(data[key](side)));
            }
            return result;
        }
        case 'getText': {
            let result: any[] = [];
            for (const side in SignSide) {
                if (data[key](side) === undefined) continue;
                result.push({
                    side: side,
                    content: data[key](side)
                });
            }
            return result;
        }
        case 'getTextDyeColor': {
            let result: any[] = [];
            for (const side in SignSide) {
                if (data[key](side) === undefined) continue;
                result.push({
                    side: side,
                    content: data[key](side)
                });
            }
            return result;
        }
        default:
            break;
    }
}

function logBlockPistonComponentFunctions(data: any, key: string): any {
    switch (key) {
        case 'getAttachedBlocks':
            return logEventData(data[key]());
        case 'getAttachedBlocksLocations':
            return logEventData(data[key]());
        default:
            break;
    }
}

function logBlockRecordPlayerComponentFunctions(data: any, key: string): any {
    switch (key) {
        case 'isPlaying':
            return data[key]();
        case 'getRecord':
            if (data[key]() === undefined) return;
            return logEventData(data[key]());
        default:
            break;
    }
}

function logItemDurabilityComponentFunctions(data: any, key: string): any {
    switch (key) {
        case 'getDamageChance':
            let result: any[] = [];
            for (let index = 0; index < 4; index++) {
                result.push({
                    'Unbreaking Level': index,
                    'Damage Chance': data[key](index)
                });
            }
            return result;
        default:
            break;
    }
}

function logItemEnchantableComponentFunctions(data: any, key: string): any {
    switch (key) {
        case 'getEnchantments':
            return data[key]().map((enchantment: any) =>
                logEventData(enchantment, enchantment.constructor.name)
            );
        default:
            break;
    }
}

function getParentPrototypeName(obj: any, key: string): string {
    const prototype = Object.getPrototypeOf(obj);

    if (!prototype) return ''; // No parent prototype (reached the top of the chain)
    if (prototype.hasOwnProperty(key))
        return prototype.constructor.name; // Prototype has own properties
    else return getParentPrototypeName(prototype, key); // Recurse to the parent prototype
}
