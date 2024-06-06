import { world } from '@minecraft/server';
import * as itemOnBeforeDurabilityDamage from './item/on_before_durability_damage';
import * as itemOnCompleteUse from './item/on_complete_use';
import * as itemOnConsume from './item/on_consume';
import * as itemUse from './item/on_use';
import * as itemOnMineBlock from './item/on_mine_block';
import * as itemOnHitEntity from './item/on_hit_entity';
import * as itemOnUseOn from './item/on_use_on';

world.beforeEvents.worldInitialize.subscribe((eventData) => {
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
