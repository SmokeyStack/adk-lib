import { system } from '@minecraft/server';
import { BEFORE_ON_PLAYER_PLACE_REGISTRY } from './blocks/registry/before_on_player_place';
import { ON_ENTITY_FALL_ON_REGISTRY } from './blocks/registry/on_entity_fall_on';
import { ON_PLACE_REGISTRY } from './blocks/registry/on_place';
import { ON_PLAYER_DESTROY_REGISTRY } from './blocks/registry/on_player_destroy';
import { ON_PLAYER_INTERACT_REGISTRY } from './blocks/registry/on_player_interact';
import { ON_RANDOM_TICK_REGISTRY } from './blocks/registry/on_random_tick';
import { ON_STEP_OFF_REGISTRY } from './blocks/registry/on_step_off';
import { ON_STEP_ON_REGISTRY } from './blocks/registry/on_step_on';
import { ON_TICK_REGISTRY } from './blocks/registry/on_tick';
import * as itemOnBeforeDurabilityDamage from './item/registry/on_before_durability_damage';
import * as itemOnCompleteUse from './item/registry/on_complete_use';
import * as itemOnConsume from './item/registry/on_consume';
import * as itemUse from './item/registry/on_use';
import * as itemOnMineBlock from './item/registry/on_mine_block';
import * as itemOnHitEntity from './item/registry/on_hit_entity';
import * as itemOnUseOn from './item/registry/on_use_on';
import { SystemHelper } from 'adk-scripts-server';

BEFORE_ON_PLAYER_PLACE_REGISTRY.forEach((value, key) => {
    SystemHelper.registerCustomComponentBlock(
        `adk-lib:before_on_player_place_${key}`,
        value
    );
});
ON_ENTITY_FALL_ON_REGISTRY.forEach((value, key) => {
    SystemHelper.registerCustomComponentBlock(
        `adk-lib:on_entity_fall_on_${key}`,
        value
    );
});
ON_PLACE_REGISTRY.forEach((value, key) => {
    SystemHelper.registerCustomComponentBlock(`adk-lib:on_place_${key}`, value);
});
ON_PLAYER_DESTROY_REGISTRY.forEach((value, key) => {
    SystemHelper.registerCustomComponentBlock(
        `adk-lib:on_player_destroy_${key}`,
        value
    );
});
ON_PLAYER_INTERACT_REGISTRY.forEach((value, key) => {
    SystemHelper.registerCustomComponentBlock(
        `adk-lib:on_player_interact_${key}`,
        value
    );
});
ON_RANDOM_TICK_REGISTRY.forEach((value, key) => {
    SystemHelper.registerCustomComponentBlock(
        `adk-lib:on_random_tick_${key}`,
        value
    );
});
ON_STEP_OFF_REGISTRY.forEach((value, key) => {
    SystemHelper.registerCustomComponentBlock(
        `adk-lib:on_step_off_${key}`,
        value
    );
});
ON_STEP_ON_REGISTRY.forEach((value, key) => {
    SystemHelper.registerCustomComponentBlock(
        `adk-lib:on_step_on_${key}`,
        value
    );
});
ON_TICK_REGISTRY.forEach((value, key) => {
    SystemHelper.registerCustomComponentBlock(`adk-lib:on_tick_${key}`, value);
});

system.beforeEvents.startup.subscribe((eventData) => {
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
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:before_durability_damage_run_command',
        new itemOnBeforeDurabilityDamage.runCommand()
    );
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:before_durability_damage_modify_durability_damage',
        new itemOnBeforeDurabilityDamage.modifyDurabilityDamageAmount()
    );
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:before_durability_damage_modify_durability_damage_conditional',
        new itemOnBeforeDurabilityDamage.modifyDurabilityDamageAmountConditional()
    );
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:before_durability_damage_prevent_damage_durability',
        new itemOnBeforeDurabilityDamage.preventDamageDurability()
    );

    // On Complete Use
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_complete_use_debug',
        new itemOnCompleteUse.debug()
    );
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_complete_use_run_command',
        new itemOnCompleteUse.runCommand()
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
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_consume_run_command',
        new itemOnConsume.runCommand()
    );

    // On Hit Entity
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_hit_entity_debug',
        new itemOnHitEntity.debug()
    );
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_hit_entity_summon_entity',
        new itemOnHitEntity.summonEntity()
    );
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_hit_entity_summon_particle',
        new itemOnHitEntity.summonParticle()
    );
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_hit_entity_run_command',
        new itemOnHitEntity.runCommand()
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
        'adk-lib:on_mine_block_digger_conditional',
        new itemOnMineBlock.diggerConditional()
    );
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_mine_block_run_command',
        new itemOnMineBlock.runCommand()
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
    eventData.itemComponentRegistry.registerCustomComponent(
        'adk-lib:on_use_on_run_command',
        new itemOnUseOn.runCommand()
    );
});
