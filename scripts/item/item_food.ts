import { ItemComponentConsumeEvent } from '@minecraft/server';

export function giveFoodEffect(componentData: ItemComponentConsumeEvent) {
    let tags: string[] = componentData.itemStack.getTags();
    const effectMap: EffectOptions[] = [];
    let effect: string;
    let duration: number = 0;
    let amplifier: number = 0;
    let showParticles: boolean = true;
    const REGEX: RegExp = new RegExp(
        'adk-lib:food_([a-z]\\w+)_(\\d+)_(\\d+)(_true|_false)?$'
    );

    for (let tag of tags) {
        if (REGEX.exec(tag)) {
            effect = REGEX.exec(tag)[1];
            duration = parseInt(REGEX.exec(tag)[2]);
            amplifier = parseInt(REGEX.exec(tag)[3]);
            showParticles =
                REGEX.exec(tag)[4] == undefined
                    ? true
                    : REGEX.exec(tag)[4] === '_true'
                    ? true
                    : false;
            effectMap.push({
                effect: effect,
                duration: duration,
                amplifier: amplifier,
                showParticles: showParticles
            });
        }
    }

    effectMap.forEach((effectOptions: EffectOptions) => {
        if (componentData.source.getEffects().length > 0)
            componentData.source.getEffects().forEach((effect) => {
                if (effect.typeId === effectOptions.effect)
                    componentData.source.removeEffect(effect.typeId);
            });

        componentData.source.addEffect(
            effectOptions.effect,
            effectOptions.duration + 1,
            {
                amplifier: effectOptions.amplifier,
                showParticles: effectOptions.showParticles
            }
        );
    });
}

interface EffectOptions {
    effect: string;
    duration: number;
    amplifier: number;
    showParticles: boolean;
}
