import { world } from '@minecraft/server';
import * as onStepOn from 'on_step_on';
import * as onStepOff from 'on_step_off';
import * as onRandomTick from 'on_random_tick';

world.beforeEvents.worldInitialize.subscribe((eventData) => {
    // On Step On
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_step_on_say_hi',
        new onStepOn.sayHi()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_step_on_effect',
        new onStepOn.effect()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_step_on_impulse',
        new onStepOn.impulse()
    );

    // On Step Off
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_step_off_say_hi',
        new onStepOff.sayHi()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_step_off_effect',
        new onStepOff.effect()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_step_off_disappearing',
        new onStepOff.disappearing()
    );

    // On Random Tick
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_random_tick_say_hi',
        new onRandomTick.sayHi()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_random_tick_effect',
        new onRandomTick.effect()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_random_tick_grow',
        new onRandomTick.grow()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_random_tick_plant_growth',
        new onRandomTick.plant_growth()
    );
});
