import {
    BlockComponentRandomTickEvent,
    BlockCustomComponent,
    BlockPermutation,
    BlockStates
} from '@minecraft/server';

class onRandomTick implements BlockCustomComponent {
    constructor() {
        this.onRandomTick = this.onRandomTick.bind(this);
    }
    onRandomTick(_componentData: BlockComponentRandomTickEvent) {}
}

export class sayHi extends onRandomTick {
    onRandomTick(componentData: BlockComponentRandomTickEvent) {
        componentData.dimension.runCommand(
            `say Tick tock! from ${componentData.block.typeId} at ${componentData.block.x}, ${componentData.block.y}, ${componentData.block.z}`
        );
    }
}

export class effect extends onRandomTick {
    onRandomTick(componentData: BlockComponentRandomTickEvent) {
        componentData.dimension
            .getEntities({
                location: componentData.block.location,
                maxDistance: 8
            })
            .forEach((entity) => {
                entity.addEffect('darkness', 200, {
                    showParticles: false,
                    amplifier: 2
                });
            });
    }
}

export class grow extends onRandomTick {
    onRandomTick(componentData: BlockComponentRandomTickEvent) {
        let direction = Math.floor(Math.random() * 6);

        switch (direction) {
            case 0:
                {
                    let block = componentData.block.above();

                    if (block.typeId === 'minecraft:air')
                        block.setType(componentData.block.typeId);
                }
                break;
            case 1:
                {
                    let block = componentData.block.below();

                    if (block.typeId === 'minecraft:air')
                        block.setType(componentData.block.typeId);
                }
                break;
            case 2:
                {
                    let block = componentData.block.north();

                    if (block.typeId === 'minecraft:air')
                        block.setType(componentData.block.typeId);
                }
                break;
            case 3:
                {
                    let block = componentData.block.east();

                    if (block.typeId === 'minecraft:air')
                        block.setType(componentData.block.typeId);
                }
                break;
            case 4:
                {
                    let block = componentData.block.south();

                    if (block.typeId === 'minecraft:air')
                        block.setType(componentData.block.typeId);
                }
                break;
            case 5:
                {
                    let block = componentData.block.west();

                    if (block.typeId === 'minecraft:air')
                        block.setType(componentData.block.typeId);
                }
                break;

            default:
                break;
        }
    }
}

export class plant_growth extends onRandomTick {
    onRandomTick(componentData: BlockComponentRandomTickEvent) {
        let block = componentData.block;
        let current_state = block.permutation.getState('adk-lib:age') as number;
        let valid_values = BlockStates.get('adk-lib:age').validValues;
        let max = valid_values[valid_values.length - 1] as number;
        if (current_state < max)
            block.setPermutation(
                BlockPermutation.resolve(block.typeId, {
                    'adk-lib:age': (current_state += 1)
                })
            );
    }
}
