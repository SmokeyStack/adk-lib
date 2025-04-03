import {
    ItemComponentHitEntityEvent,
    ItemCustomComponent,
    EntityIdentifierType,
    EntityTypes,
    VanillaEntityIdentifier
} from '@minecraft/server';
import { logEventData } from 'utils/debug';

class onHitEntity implements ItemCustomComponent {
    constructor() {
        this.onHitEntity = this.onHitEntity.bind(this);
    }
    onHitEntity(_componentData: ItemComponentHitEntityEvent) {}
}

export class debug extends onHitEntity {
    onHitEntity(componentData: ItemComponentHitEntityEvent) {
        let data: Object = logEventData(
            componentData,
            componentData.constructor.name
        );
        let result: string = JSON.stringify(
            Object.keys(data)
                .sort()
                .reduce((result, key) => {
                    result[key] = data[key];
                    return result;
                }, {}),
            null,
            4
        );
        console.log(result);
    }
}

export class summonEntity extends onHitEntity {
    onHitEntity(componentData: ItemComponentHitEntityEvent) {
        const REGEX: RegExp = new RegExp('adk-lib:on_hit_summon_entity_([^]+)');
        let tags: string[] = componentData.itemStack.getTags();
        let entities: string[] = [];

        for (let tag of tags)
            if (REGEX.exec(tag)) entities.push(REGEX.exec(tag)[1]);

        entities.forEach((entity) => {
            componentData.hitEntity.dimension.spawnEntity<string>(
                entity,
                componentData.hitEntity.location
            );
        });
    }
}

export class summonParticle extends onHitEntity {
    onHitEntity(componentData: ItemComponentHitEntityEvent) {
        const REGEX: RegExp = new RegExp(
            'adk-lib:on_hit_summon_particle_([^]+)'
        );
        let tags: string[] = componentData.itemStack.getTags();
        let particles: string[] = [];

        for (let tag of tags)
            if (REGEX.exec(tag)) particles.push(REGEX.exec(tag)[1]);

        particles.forEach((entity) => {
            componentData.hitEntity.dimension.spawnParticle(
                entity,
                componentData.hitEntity.location
            );
        });
    }
}

export class runCommand extends onHitEntity {
    onHitEntity(componentData: ItemComponentHitEntityEvent) {
        const REGEX: RegExp = new RegExp('adk-lib:on_hit_entity_([^]+)');
        let tags: string[] = componentData.itemStack.getTags();
        let commands: string[] = [];

        for (let tag of tags)
            if (REGEX.exec(tag)) commands.push(REGEX.exec(tag)[1]);

        commands.forEach((command) => {
            componentData.attackingEntity.runCommand(command);
        });
    }
}
