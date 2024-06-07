import {
    ItemComponentMineBlockEvent,
    BlockPermutation,
    EntityItemComponent
} from '@minecraft/server';
import {
    needsDiamondTool,
    needsIronTool,
    needsStoneTool,
    pickaxeMineable,
    requiresTool
} from 'vanilla/vanilla_tags';

export function canHarvest(componentData: ItemComponentMineBlockEvent): void {
    const REGEX: RegExp = new RegExp(
        'adk-lib:mining_level_(diamond|iron|stone|wood|hand)'
    );
    const minedBlockPermutation: BlockPermutation =
        componentData.minedBlockPermutation;
    let miningLevel: string;
    const tags: string[] = componentData.itemStack.getTags();

    for (let tag of tags) {
        if (REGEX.exec(tag)) {
            miningLevel = REGEX.exec(tag)[1].toUpperCase();
            break;
        }
    }
    if (
        !requiresTool.includes(minedBlockPermutation.type.id) ||
        isSuitableFor(MiningLevels[miningLevel], minedBlockPermutation.type.id)
    )
        return;

    componentData.source.dimension
        .getEntitiesAtBlockLocation(componentData.block.location)
        .forEach((entity) => {
            // ==================================================
            // Workaround since stable doesn't have EntityComponentTypeMap
            let itemTemp: EntityItemComponent = entity.getComponent(
                'item'
            ) as EntityItemComponent;
            // ==================================================
            if (itemTemp.itemStack.typeId == minedBlockPermutation.type.id)
                entity.remove();
        });
}

function isSuitableFor(currentLevel: number, block: string): boolean {
    if (
        currentLevel < MiningLevels.DIAMOND &&
        needsDiamondTool.includes(block)
    ) {
        return false;
    }
    if (currentLevel < MiningLevels.IRON && needsIronTool.includes(block)) {
        return false;
    }
    if (currentLevel < MiningLevels.STONE && needsStoneTool.includes(block)) {
        return false;
    }
    return pickaxeMineable.includes(block);
}

enum MiningLevels {
    HAND = -1,
    WOOD = 0,
    STONE = 1,
    IRON = 2,
    DIAMOND = 3,
    NETHERITE = 4
}
