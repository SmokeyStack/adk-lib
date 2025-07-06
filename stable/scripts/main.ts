import { BEFORE_ON_PLAYER_PLACE_REGISTRY } from './blocks/registry/before_on_player_place';
import { ON_ENTITY_FALL_ON_REGISTRY } from './blocks/registry/on_entity_fall_on';
import { ON_PLACE_REGISTRY } from './blocks/registry/on_place';
import { ON_PLAYER_DESTROY_REGISTRY } from './blocks/registry/on_player_break';
import { ON_PLAYER_INTERACT_REGISTRY } from './blocks/registry/on_player_interact';
import { ON_RANDOM_TICK_REGISTRY } from './blocks/registry/on_random_tick';
import { ON_STEP_OFF_REGISTRY } from './blocks/registry/on_step_off';
import { ON_STEP_ON_REGISTRY } from './blocks/registry/on_step_on';
import { ON_TICK_REGISTRY } from './blocks/registry/on_tick';
import { ON_BEFORE_DURABILITY_DAMAGE_REGISTRY } from './item/registry/on_before_durability_damage';
import { ON_COMPLETE_USE_REGISTRY } from './item/registry/on_complete_use';
import { ON_CONSUME_REGISTRY } from './item/registry/on_consume';
import { ON_HIT_ENTITY_REGISTRY } from './item/registry/on_hit_entity';
import { ON_MINE_BLOCK_REGISTRY } from './item/registry/on_mine_block';
import { ON_USE_ON_REGISTRY } from './item/registry/on_use_on';
import { ON_USE_REGISTRY } from './item/registry/on_use';
import { SystemHelper } from 'adk-scripts-server';

BEFORE_ON_PLAYER_PLACE_REGISTRY.forEach((value, key) => {
    SystemHelper.registerCustomComponentBlock(
        `adk_lib:before_on_player_place_${key}`,
        value
    );
});
ON_ENTITY_FALL_ON_REGISTRY.forEach((value, key) => {
    SystemHelper.registerCustomComponentBlock(
        `adk_lib:on_entity_fall_on_${key}`,
        value
    );
});
ON_PLACE_REGISTRY.forEach((value, key) => {
    SystemHelper.registerCustomComponentBlock(`adk_lib:on_place_${key}`, value);
});
ON_PLAYER_DESTROY_REGISTRY.forEach((value, key) => {
    SystemHelper.registerCustomComponentBlock(
        `adk_lib:on_player_destroy_${key}`,
        value
    );
});
ON_PLAYER_INTERACT_REGISTRY.forEach((value, key) => {
    SystemHelper.registerCustomComponentBlock(
        `adk_lib:on_player_interact_${key}`,
        value
    );
});
ON_RANDOM_TICK_REGISTRY.forEach((value, key) => {
    SystemHelper.registerCustomComponentBlock(
        `adk_lib:on_random_tick_${key}`,
        value
    );
});
ON_STEP_OFF_REGISTRY.forEach((value, key) => {
    SystemHelper.registerCustomComponentBlock(
        `adk_lib:on_step_off_${key}`,
        value
    );
});
ON_STEP_ON_REGISTRY.forEach((value, key) => {
    SystemHelper.registerCustomComponentBlock(
        `adk_lib:on_step_on_${key}`,
        value
    );
});
ON_TICK_REGISTRY.forEach((value, key) => {
    SystemHelper.registerCustomComponentBlock(`adk_lib:on_tick_${key}`, value);
});
ON_BEFORE_DURABILITY_DAMAGE_REGISTRY.forEach((value, key) => {
    SystemHelper.registerCustomComponentItem(
        `adk_lib:on_before_durability_damage_${key}`,
        value
    );
});
ON_COMPLETE_USE_REGISTRY.forEach((value, key) => {
    SystemHelper.registerCustomComponentItem(
        `adk_lib:on_complete_use_${key}`,
        value
    );
});
ON_CONSUME_REGISTRY.forEach((value, key) => {
    SystemHelper.registerCustomComponentItem(
        `adk_lib:on_consume_${key}`,
        value
    );
});
ON_HIT_ENTITY_REGISTRY.forEach((value, key) => {
    SystemHelper.registerCustomComponentItem(
        `adk_lib:on_hit_entity_${key}`,
        value
    );
});
ON_MINE_BLOCK_REGISTRY.forEach((value, key) => {
    SystemHelper.registerCustomComponentItem(
        `adk_lib:on_mine_block_${key}`,
        value
    );
});
ON_USE_ON_REGISTRY.forEach((value, key) => {
    SystemHelper.registerCustomComponentItem(`adk_lib:on_use_on_${key}`, value);
});
ON_USE_REGISTRY.forEach((value, key) => {
    SystemHelper.registerCustomComponentItem(`adk_lib:on_use_${key}`, value);
});
