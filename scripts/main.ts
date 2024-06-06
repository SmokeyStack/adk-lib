import { world } from '@minecraft/server';
import * as blockOnStepOn from './blocks/on_step_on';
import * as blockOnStepOff from './blocks/on_step_off';
import * as blockOnRandomTick from './blocks/on_random_tick';
import * as blockBeforeOnPlayerPlace from './blocks/registry/before_on_player_place';
import * as blockOnEntityFallOn from './blocks/on_entity_fall_on';
import * as blockOnPlace from './blocks/on_place';
import * as blockOnPlayerDestroy from './blocks/on_player_destroy';
import * as blockOnPlayerInteract from './blocks/on_player_interact';
import * as blockOnTick from './blocks/registry/on_tick';
import * as itemOnBeforeDurabilityDamage from './item/on_before_durability_damage';
import * as itemOnCompleteUse from './item/on_complete_use';
import * as itemOnConsume from './item/on_consume';
import * as itemUse from './item/on_use';
import * as itemOnMineBlock from './item/on_mine_block';
import * as itemOnHitEntity from './item/on_hit_entity';
import * as itemOnUseOn from './item/on_use_on';

world.beforeEvents.worldInitialize.subscribe((eventData) => {
    // On Step On
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_step_on_debug',
        new blockOnStepOn.debug()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_step_on_effect',
        new blockOnStepOn.effect()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_step_on_impulse',
        new blockOnStepOn.impulse()
    );

    // On Step Off
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_step_off_debug',
        new blockOnStepOff.debug()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_step_off_effect',
        new blockOnStepOff.effect()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_step_off_disappearing',
        new blockOnStepOff.disappearing()
    );

    // On Random Tick
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_random_tick_debug',
        new blockOnRandomTick.debug()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_random_tick_effect',
        new blockOnRandomTick.effect()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_random_tick_grow',
        new blockOnRandomTick.grow()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_random_tick_plant_growth',
        new blockOnRandomTick.plantGrowth()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_random_tick_sugar_cane',
        new blockOnRandomTick.sugarCane()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_random_tick_melt_ice',
        new blockOnRandomTick.meltIce()
    );

    // Before On Player Place
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:before_on_player_place_debug',
        new blockBeforeOnPlayerPlace.debug()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:before_on_player_place_cancel',
        new blockBeforeOnPlayerPlace.cancel()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:before_on_player_place_turn_into',
        new blockBeforeOnPlayerPlace.turnInto()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:before_on_player_place_double_slab',
        new blockBeforeOnPlayerPlace.doubleSlab()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:before_on_player_place_sugar_cane',
        new blockBeforeOnPlayerPlace.sugarCane()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:before_on_player_place_stairs',
        new blockBeforeOnPlayerPlace.stairs()
    );

    // On Entity Fall On
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_entity_fall_on_debug',
        new blockOnEntityFallOn.debug()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_entity_fall_on_player_bounce',
        new blockOnEntityFallOn.player_bounce()
    );

    // On Place On
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_place_on_debug',
        new blockOnPlace.debug()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_place_on_change_into_bedrock',
        new blockOnPlace.changeIntoBedrock()
    );

    // On Player Destroy
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_player_destroy_debug',
        new blockOnPlayerDestroy.debug()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_player_destroy_spawn_item',
        new blockOnPlayerDestroy.spawnItem()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_player_destroy_regenerate',
        new blockOnPlayerDestroy.regenerate()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_player_destroy_drop_experience',
        new blockOnPlayerDestroy.dropExperience()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_player_destroy_double_slab',
        new blockOnPlayerDestroy.doubleSlab()
    );

    // On Player Interact
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_player_interact_debug',
        new blockOnPlayerInteract.debug()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_player_interact_turn_into',
        new blockOnPlayerInteract.turnInto()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_player_interact_prime_tnt',
        new blockOnPlayerInteract.primeTnt()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_player_interact_candle',
        new blockOnPlayerInteract.candle()
    );

    // On Tick
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_tick_debug',
        new blockOnTick.debug()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
        'adk-lib:on_tick_torch_particles',
        new blockOnTick.torchParticles()
    );
    eventData.blockTypeRegistry.registerCustomComponent(
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
