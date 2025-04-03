import { Entity, ItemComponentConsumeEvent } from '@minecraft/server';

export function giveFoodEffect(componentData: ItemComponentConsumeEvent) {
    const source: Entity = componentData.source;
    let tags: string[] = componentData.itemStack.getTags();
    const effect_map: EffectOptions[] = [];
    let effect: string;
    let duration: number = 0;
    let amplifier: number = 0;
    let show_particles: boolean = true;
    const REGEX: RegExp = new RegExp(
        'adk-lib:food_([a-z]\\w+)_(\\d+)_(\\d+)(_true|_false)?$'
    );

    for (let tag of tags) {
        if (REGEX.exec(tag)) {
            effect = REGEX.exec(tag)[1];
            duration = parseInt(REGEX.exec(tag)[2]);
            amplifier = parseInt(REGEX.exec(tag)[3]);
            show_particles =
                REGEX.exec(tag)[4] == undefined
                    ? true
                    : REGEX.exec(tag)[4] === '_true'
                    ? true
                    : false;
            effect_map.push({
                effect: effect,
                duration: duration,
                amplifier: amplifier,
                showParticles: show_particles
            });
        }
    }

    effect_map.forEach((effectOptions: EffectOptions) => {
        if (source.getEffects().length > 0)
            source.getEffects().forEach((effect) => {
                if (effect.typeId === effectOptions.effect)
                    source.removeEffect(effect.typeId);
            });

        source.addEffect(effectOptions.effect, effectOptions.duration + 1, {
            amplifier: effectOptions.amplifier,
            showParticles: effectOptions.showParticles
        });
    });
}

interface EffectOptions {
    effect: string;
    duration: number;
    amplifier: number;
    showParticles: boolean;
}
