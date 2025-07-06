import {
    CustomComponentParameters,
    ItemComponentConsumeEvent,
    ItemCustomComponent,
    system,
    Vector3
} from '@minecraft/server';
import { teleportEntity } from '../teleport';
import * as adk from 'adk-scripts-server';
import { ParameterEffect, ParameterRunCommand } from 'utils/shared_parameters';

abstract class OnConsume implements ItemCustomComponent {
    abstract onConsume(
        componentData: ItemComponentConsumeEvent,
        paramData?: CustomComponentParameters
    ): void;
}

class Debug extends OnConsume {
    onConsume(componentData: ItemComponentConsumeEvent): void {
        console.log(adk.Debug.logEventData(componentData));
    }
}

class Teleport extends OnConsume {
    onConsume(componentData: ItemComponentConsumeEvent) {
        const location: Vector3 = componentData.source.location;
        const dimension_height_range = adk.Cache.getDimensionHeightRange(
            componentData.source.dimension.id
        );
        for (let a = 0; a < 16; ++a) {
            const x: number = location.x + (Math.random() - 0.5) * 16.0;
            const y: number = adk.MathHelper.clamp(
                location.y + (Math.random() * 16 - 8),
                dimension_height_range.min,
                dimension_height_range.max
            );
            const z: number = location.z + (Math.random() - 0.5) * 16.0;
            const new_location: adk.Vector3Builder = new adk.Vector3Builder(
                x,
                y,
                z
            );

            if (
                teleportEntity(
                    componentData.source,
                    new_location,
                    dimension_height_range
                )
            )
                break;
        }
    }
}

class FoodEffect extends OnConsume {
    onConsume(
        componentData: ItemComponentConsumeEvent,
        paramData: CustomComponentParameters
    ) {
        const param = paramData.params as ParameterEffect;
        param.forEach(
            ({
                effect,
                duration,
                amplifier = 0,
                show_particles = true,
                entity_type
            }) => {
                if (!entity_type)
                    componentData.source.addEffect(effect, duration, {
                        showParticles: show_particles,
                        amplifier
                    });
                else {
                    entity_type.forEach((type) => {
                        if (componentData.source.typeId === type)
                            componentData.source.addEffect(effect, duration, {
                                showParticles: show_particles,
                                amplifier
                            });
                    });
                }
            }
        );
    }
}

class RunCommand extends OnConsume {
    onConsume(
        componentData: ItemComponentConsumeEvent,
        paramData: CustomComponentParameters
    ) {
        const param = paramData.params as ParameterRunCommand;
        system.run(() => {
            param.command.forEach((command) => {
                componentData.source.runCommand(command);
            });
        });
    }
}

enum OnConsumeKey {
    Debug = 'debug',
    Teleport = 'teleport',
    FoodEffect = 'food_effect',
    RunCommand = 'run_command'
}

export const ON_CONSUME_REGISTRY = new Map([
    [OnConsumeKey.Debug, new Debug()],
    [OnConsumeKey.Teleport, new Teleport()],
    [OnConsumeKey.FoodEffect, new FoodEffect()],
    [OnConsumeKey.RunCommand, new RunCommand()]
]);
