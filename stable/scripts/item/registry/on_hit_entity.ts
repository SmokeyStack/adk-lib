import {
    CustomComponentParameters,
    ItemComponentHitEntityEvent,
    ItemCustomComponent,
    system
} from '@minecraft/server';
import * as adk from 'adk-scripts-server';
import { ParameterRunCommand } from 'utils/shared_parameters';

abstract class OnHitEntity implements ItemCustomComponent {
    abstract onHitEntity(
        componentData: ItemComponentHitEntityEvent,
        paramData?: CustomComponentParameters
    ): void;
}

class Debug extends OnHitEntity {
    onHitEntity(componentData: ItemComponentHitEntityEvent) {
        console.log(adk.Debug.logEventData(componentData));
    }
}

type ParameterSummonEntity = {
    entity: string;
    entity_filter?: string[];
}[];

class SummonEntity extends OnHitEntity {
    onHitEntity(
        componentData: ItemComponentHitEntityEvent,
        paramData: CustomComponentParameters
    ) {
        const param = paramData.params as ParameterSummonEntity;
        for (const entry of param) {
            const entity_filter: string[] | undefined = entry.entity_filter;
            const entity: string = entry.entity;

            // Check if player_equipment matches any transform_from
            const matches: boolean = (entity_filter ?? []).some(
                (entity: string) => {
                    return componentData.hitEntity.typeId === entity;
                }
            );

            // If there's a match, log the corresponding transform_to
            if (matches) {
                componentData.hitEntity.dimension.spawnEntity(
                    entity,
                    componentData.hitEntity.location
                );
                return; // Stop further checks if a match is found
            }
        }
    }
}

type ParameterSummonParticle = {
    particle: string;
    entity_filter?: string[];
}[];

class SummonParticle extends OnHitEntity {
    onHitEntity(
        componentData: ItemComponentHitEntityEvent,
        paramData: CustomComponentParameters
    ) {
        const param = paramData.params as ParameterSummonParticle;
        for (const entry of param) {
            const entity_filter: string[] | undefined = entry.entity_filter;
            const particle: string = entry.particle;

            // Check if player_equipment matches any transform_from
            const matches: boolean = (entity_filter ?? []).some(
                (entity: string) => {
                    return componentData.hitEntity.typeId === entity;
                }
            );

            // If there's a match, log the corresponding transform_to
            if (matches) {
                componentData.hitEntity.dimension.spawnParticle(
                    particle,
                    componentData.hitEntity.location
                );
                return; // Stop further checks if a match is found
            }
        }
    }
}

class RunCommand extends OnHitEntity {
    onHitEntity(
        componentData: ItemComponentHitEntityEvent,
        paramData: CustomComponentParameters
    ) {
        const param = paramData.params as ParameterRunCommand;
        system.run(() => {
            param.command.forEach((command) => {
                componentData.attackingEntity.runCommand(command);
            });
        });
    }
}

enum OnHitEntityKey {
    Debug = 'debug',
    SummonEntity = 'summon_entity',
    SummonParticle = 'summon_particle',
    RunCommand = 'run_command'
}

export const ON_HIT_ENTITY_REGISTRY = new Map([
    [OnHitEntityKey.Debug, new Debug()],
    [OnHitEntityKey.SummonEntity, new SummonEntity()],
    [OnHitEntityKey.SummonParticle, new SummonParticle()],
    [OnHitEntityKey.RunCommand, new RunCommand()]
]);
