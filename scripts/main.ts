import { world } from '@minecraft/server';
import * as onStepOn from 'on_step_on';
import * as onStepOff from 'on_step_off';
import * as onRandomTick from 'on_random_tick';
import * as beforeOnPlayerPlace from 'before_on_player_place';
import * as onEntityFallOn from 'on_entity_fall_on';
import * as onPlaceOn from 'on_place_on';
import * as onPlayerDestroy from 'on_player_destroy';
import * as onPlayerInteract from 'on_player_interact';
import * as onTick from 'on_tick';
import * as onUse from 'on_use';
import * as beforeDurabilityDamage from 'before_durability_damage';
import * as onMineBlock from 'on_mine_block';
import * as onHitEntity from 'on_hit_entity';

world.beforeEvents.worldInitialize.subscribe((eventData) => {
    // On Step On
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_step_on_debug',
        new onStepOn.debug()
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
        'adk-lib:on_step_off_debug',
        new onStepOff.debug()
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
        'adk-lib:on_random_tick_debug',
        new onRandomTick.debug()
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
        new onRandomTick.plantGrowth()
    );

    // Before On Player Place
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:before_on_player_place_debug',
        new beforeOnPlayerPlace.debug()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:before_on_player_place_cancel',
        new beforeOnPlayerPlace.cancel()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:before_on_player_place_change_into_bedrock',
        new beforeOnPlayerPlace.changeIntoBedrock()
    );

    // On Entity Fall On
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_entity_fall_on_debug',
        new onEntityFallOn.debug()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_entity_fall_on_player_bounce',
        new onEntityFallOn.player_bounce()
    );

    // On Place On
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_place_on_debug',
        new onPlaceOn.debug()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_place_on_change_into_bedrock',
        new onPlaceOn.changeIntoBedrock()
    );

    // On Player Destroy
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_player_destroy_debug',
        new onPlayerDestroy.debug()
    );

    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_player_destroy_spawn_item',
        new onPlayerDestroy.spawnItem()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_player_destroy_regenerate',
        new onPlayerDestroy.regenerate()
    );

    // On Player Interact
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_player_interact_debug',
        new onPlayerInteract.debug()
    );

    // On Tick
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_tick_debug',
        new onTick.debug()
    );

    // Items

    // On Use
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_use_debug',
        new onUse.debug()
    );

    // Before Durability Damage
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:before_durability_damage_debug',
        new beforeDurabilityDamage.debug()
    );

    // On Hit Entity
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_hit_entity_debug',
        new onHitEntity.debug()
    );

    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_hit_entity_summon_lightning',
        new onHitEntity.summonLightning()
    );
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_hit_entity_prevent_damage_durability',
        new onHitEntity.preventDamageDurability()
    );
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_hit_entity_different_damage_durability',
        new onHitEntity.differentDamageDurability()
    );

    // On Mine Block
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_mine_block_debug',
        new onMineBlock.debug()
    );

    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_mine_block_digger',
        new onMineBlock.digger()
    );
});
