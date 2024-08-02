import { world } from '@minecraft/server';
import * as blockOnStepOn from './blocks/registry/on_step_on';
import * as blockOnStepOff from './blocks/registry/on_step_off';
import * as blockOnRandomTick from './blocks/registry/on_random_tick';
import * as blockBeforeOnPlayerPlace from './blocks/registry/before_on_player_place';
import * as blockOnEntityFallOn from './blocks/registry/on_entity_fall_on';
import * as blockOnPlace from './blocks/registry/on_place';
import * as blockOnPlayerDestroy from './blocks/registry/on_player_destroy';
import * as blockOnPlayerInteract from './blocks/registry/on_player_interact';
import * as blockOnTick from './blocks/registry/on_tick';
import * as itemOnBeforeDurabilityDamage from './item/registry/on_before_durability_damage';
import * as itemOnCompleteUse from './item/registry/on_complete_use';
import * as itemOnConsume from './item/registry/on_consume';
import * as itemUse from './item/registry/on_use';
import * as itemOnMineBlock from './item/registry/on_mine_block';
import * as itemOnHitEntity from './item/registry/on_hit_entity';
import * as itemOnUseOn from './item/registry/on_use_on';

world.beforeEvents.worldInitialize.subscribe((eventData) => {
    // On Step On
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:on_step_on_debug',
        new blockOnStepOn.debug()
    );
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:on_step_on_effect',
        new blockOnStepOn.effect()
    );
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:on_step_on_impulse',
        new blockOnStepOn.impulse()
    );

    // On Step Off
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:on_step_off_debug',
        new blockOnStepOff.debug()
    );
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:on_step_off_effect',
        new blockOnStepOff.effect()
    );
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:on_step_off_disappearing',
        new blockOnStepOff.disappearing()
    );

    // On Random Tick
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:on_random_tick_debug',
        new blockOnRandomTick.debug()
    );
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:on_random_tick_effect',
        new blockOnRandomTick.effect()
    );
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:on_random_tick_grow',
        new blockOnRandomTick.grow()
    );
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:on_random_tick_plant_growth',
        new blockOnRandomTick.plantGrowth()
    );
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:on_random_tick_sugar_cane',
        new blockOnRandomTick.sugarCane()
    );
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:on_random_tick_melt_ice',
        new blockOnRandomTick.meltIce()
    );

    // Before On Player Place
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:before_on_player_place_debug',
        new blockBeforeOnPlayerPlace.debug()
    );
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:before_on_player_place_cancel',
        new blockBeforeOnPlayerPlace.cancel()
    );
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:before_on_player_place_turn_into',
        new blockBeforeOnPlayerPlace.turnInto()
    );
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:before_on_player_place_double_slab',
        new blockBeforeOnPlayerPlace.doubleSlab()
    );
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:before_on_player_place_sugar_cane',
        new blockBeforeOnPlayerPlace.sugarCane()
    );
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:before_on_player_place_stairs',
        new blockBeforeOnPlayerPlace.stairs()
    );

    // On Entity Fall On
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:on_entity_fall_on_debug',
        new blockOnEntityFallOn.debug()
    );
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:on_entity_fall_on_player_bounce',
        new blockOnEntityFallOn.player_bounce()
    );

    // On Place On
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:on_place_on_debug',
        new blockOnPlace.debug()
    );
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:on_place_on_change_into_bedrock',
        new blockOnPlace.changeIntoBedrock()
    );

    // On Player Destroy
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:on_player_destroy_debug',
        new blockOnPlayerDestroy.debug()
    );
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:on_player_destroy_spawn_item',
        new blockOnPlayerDestroy.spawnItem()
    );
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:on_player_destroy_regenerate',
        new blockOnPlayerDestroy.regenerate()
    );
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:on_player_destroy_drop_experience',
        new blockOnPlayerDestroy.dropExperience()
    );
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:on_player_destroy_double_slab',
        new blockOnPlayerDestroy.doubleSlab()
    );

    // On Player Interact
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:on_player_interact_debug',
        new blockOnPlayerInteract.debug()
    );
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:on_player_interact_turn_into',
        new blockOnPlayerInteract.turnInto()
    );
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:on_player_interact_prime_tnt',
        new blockOnPlayerInteract.primeTnt()
    );
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:on_player_interact_candle',
        new blockOnPlayerInteract.candle()
    );

    // On Tick
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:on_tick_debug',
        new blockOnTick.debug()
    );
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:on_tick_torch_particles',
        new blockOnTick.torchParticles()
    );
    eventData.blockComponentRegistry.registerCustomComponent(
        'adk-lib:on_tick_candle_particles',
        new blockOnTick.candleParticles()
    );

    // Items

    // On Before Durability Damage
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:before_durability_damage_debug',
        new itemOnBeforeDurabilityDamage.debug()
    );
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:before_durability_damage_elytra_is_useable',
        new itemOnBeforeDurabilityDamage.elytraIsUseable()
    );

    // On Complete Use
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_complete_use_debug',
        new itemOnCompleteUse.debug()
    );

    // On Consume
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_consume_teleport',
        new itemOnConsume.teleport()
    );
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_consume_food_effect',
        new itemOnConsume.foodEffect()
    );

    // On Hit Entity
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_hit_entity_debug',
        new itemOnHitEntity.debug()
    );
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_hit_entity_summon_lightning',
        new itemOnHitEntity.summonLightning()
    );
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_hit_entity_prevent_damage_durability',
        new itemOnHitEntity.preventDamageDurability()
    );
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_hit_entity_different_damage_durability',
        new itemOnHitEntity.differentDamageDurability()
    );

    // On Mine Block
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_mine_block_debug',
        new itemOnMineBlock.debug()
    );
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_mine_block_digger',
        new itemOnMineBlock.digger()
    );
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_mine_block_pickaxe',
        new itemOnMineBlock.pickaxe()
    );

    // On Use
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_use_debug',
        new itemUse.debug()
    );
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_use_goat_horn',
        new itemUse.goatHorn()
    );
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_use_run_command',
        new itemUse.runCommand()
    );

    // On Use On
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:use_on_debug',
        new itemOnUseOn.debug()
    );
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:use_on_fertilizable',
        new itemOnUseOn.useOnFertilizable()
    );
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_use_on_bucket',
        new itemOnUseOn.bucket()
    );
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_use_on_dye',
        new itemOnUseOn.dye()
    );
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_use_on_fire',
        new itemOnUseOn.fire()
    );
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_use_on_glass_bottle',
        new itemOnUseOn.glassBottle()
    );
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_use_on_wax',
        new itemOnUseOn.wax()
    );
});
