import {
    CustomComponentParameters,
    ItemComponentUseEvent,
    ItemCustomComponent,
    ItemStack,
    system
} from '@minecraft/server';
import * as adk from 'adk-scripts-server';
import { ParameterRunCommand } from 'utils/shared_parameters';

abstract class OnUse implements ItemCustomComponent {
    abstract onUse(
        componentData: ItemComponentUseEvent,
        paramData?: CustomComponentParameters
    ): void;
}

class Debug extends OnUse {
    onUse(componentData: ItemComponentUseEvent) {
        console.log(adk.Debug.logEventData(componentData));
    }
}

type ParameterGoatHorn = {
    instrument: string;
};

class GoatHorn extends OnUse {
    onUse(
        componentData: ItemComponentUseEvent,
        paramData: CustomComponentParameters
    ) {
        const param = paramData.params as ParameterGoatHorn;
        componentData.source.playSound(param.instrument, {
            volume: 16
        });
        const item: ItemStack | undefined = componentData.itemStack;
        if (!item) return;

        adk.ComponentItemCooldown.startCooldown(item, componentData.source);
    }
}

class RunCommand extends OnUse {
    onUse(
        componentData: ItemComponentUseEvent,
        paramData: CustomComponentParameters
    ) {
        const param = paramData.params as ParameterRunCommand;
        system.run(() => {
            param.command.forEach((command) => {
                componentData.source.runCommand(command);
            });
        });
    }
}

enum OnUseKey {
    Debug = 'debug',
    GoatHorn = 'goat_horn',
    RunCommand = 'run_command'
}

export const ON_USE_REGISTRY = new Map([
    [OnUseKey.Debug, new Debug()],
    [OnUseKey.GoatHorn, new GoatHorn()],
    [OnUseKey.RunCommand, new RunCommand()]
]);
