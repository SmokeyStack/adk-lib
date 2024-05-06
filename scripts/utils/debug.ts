import {
    BlockPermutation,
    Container,
    DimensionLocation,
    EntityBreathableComponent,
    EntityEquippableComponent,
    Player
} from '@minecraft/server';

/**
 * Logs the eventData object in a more readable format
 * @param data eventData object
 * @param prefix The prefix to use for the keys in the object
 * @returns Object that contains the eventData object in a more readable format
 */
export function logEventData(data: Object, prefix = ''): Object {
    const prototype: Object = Object.getPrototypeOf(data);
    let result: Object = {};
    let parentName: string = '';
    let currentPrototype: Object | null = prototype;
    let previousPrototype: Object | null = currentPrototype;

    while (currentPrototype !== null) {
        if (currentPrototype === Object.prototype) {
            parentName = previousPrototype.constructor.name;
            break;
        }

        previousPrototype = currentPrototype;
        currentPrototype = Object.getPrototypeOf(currentPrototype);
    }

    for (let key in data) {
        const value: any = data[key];
        let fullKey: string = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'object' && value !== null) {
            // Recurse into nested objects
            if (!prototype.hasOwnProperty(key))
                fullKey = `${parentName}.${key}`;

            result[fullKey] = logEventData(value, value.constructor.name);
        } else {
            if (prototype.hasOwnProperty(key)) {
                result[fullKey] = value;
            } else {
                fullKey = `${parentName}.${key}`;
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

export function logEventDataWithFunctions(
    data: Object,
    prefix = '',
    isComponent: boolean = false
): Object {
    const prototype: Object = Object.getPrototypeOf(data);
    let result: Object = {};
    let parentName: string = '';
    let currentPrototype: Object | null = prototype;
    let previousPrototype: Object | null = currentPrototype;

    while (currentPrototype !== null) {
        if (currentPrototype === Object.prototype) {
            parentName = previousPrototype.constructor.name;
            break;
        }

        previousPrototype = currentPrototype;
        currentPrototype = Object.getPrototypeOf(currentPrototype);
    }

    for (let key in data) {
        if (key === 'distance') {
            console.warn('Entering racast');
            console.warn(isComponent);
        }
        if (isComponent && key === 'entity') continue;

        const value: any = data[key];
        let fullKey: string = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'object' && value !== null) {
            // Recurse into nested objects
            if (!prototype.hasOwnProperty(key))
                fullKey = `${parentName}.${key}`;

            result[fullKey] = logEventDataWithFunctions(
                value,
                value.constructor.name,
                false
            );
        } else if (typeof value === 'function') {
            console.log(
                `${data['typeId']} - ${key} - ${data.constructor.name}`
            );
            switch (data.constructor) {
                case Player:
                    result[fullKey] = executePlayerFunction(data, key);
                    break;
                case Container:
                    result[fullKey] = executeContainerFunction(data, key);
                    break;
                case EntityBreathableComponent:
                    result[fullKey] = executeEntityBreathableComponentFunction(
                        data,
                        key
                    );
                    break;
                case EntityEquippableComponent:
                    result[fullKey] = executeEntityEquippableComponentFunction(
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
                fullKey = `${parentName}.${key}`;
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

function executePlayerFunction(data: any, key: string): any {
    switch (key) {
        case 'getGameMode':
            return data[key]();
        case 'getSpawnPoint':
            return logEventDataWithFunctions(data[key]());
        case 'getTotalXp':
            return data[key]();
        case 'isOp':
            return data[key]();
        case 'getBlockFromViewDirection':
            return logEventDataWithFunctions(
                data[key]({
                    includeLiquidBlocks: true,
                    includePassableBlocks: true
                })
            );
        case 'getComponents':
            return data[key]().map((component: any) =>
                logEventDataWithFunctions(component, '', true)
            );
        case 'getDynamicPropertyIds':
            return data[key]().map((id: string) => ({
                key: id,
                value: data.getDynamicProperty(id)
            }));
        case 'getEffects':
            return data[key]().map((effect: any) =>
                logEventDataWithFunctions(effect, '', true)
            );
        case 'getEntitiesFromViewDirection':
            console.warn('getEntitiesFromViewDirection');
            return logEventDataWithFunctions(
                data[key]({
                    ignoreBlockCollision: false,
                    includeLiquidBlocks: false,
                    includePassableBlocks: true
                })
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
        case 'getTags':
            return data[key]();
        default:
            break;
    }
}

function executeContainerFunction(data: any, key: string): any {
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

function executeEntityBreathableComponentFunction(data: any, key: string): any {
    switch (key) {
        case 'getBreatheBlocks': {
            return data[key]().map((block: any) => logEventData(block));
        }
        case 'getNonBreatheBlocks': {
            return data[key]().map((block: any) => logEventData(block));
        }
        default:
            break;
    }
}

function executeEntityEquippableComponentFunction(data: any, key: string): any {
    switch (key) {
        case 'getBreatheBlocks': {
            return data[key]().map((block: any) => logEventData(block));
        }
        case 'getNonBreatheBlocks': {
            return data[key]().map((block: any) => logEventData(block));
        }
        default:
            break;
    }
}
