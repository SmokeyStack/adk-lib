import {
    CustomComponentParameters,
    ItemComponentCompleteUseEvent,
    ItemCustomComponent,
    system
} from '@minecraft/server';
import * as adk from 'adk-scripts-server';
import { ParameterRunCommand } from 'utils/shared_parameters';

abstract class OnCompleteUse implements ItemCustomComponent {
    abstract onCompleteUse(
        componentData: ItemComponentCompleteUseEvent,
        paramData?: CustomComponentParameters
    ): void;
}

class Debug extends OnCompleteUse {
    onCompleteUse(componentData: ItemComponentCompleteUseEvent) {
        console.log(adk.Debug.logEventData(componentData));
    }
}

class RunCommand extends OnCompleteUse {
    onCompleteUse(
        componentData: ItemComponentCompleteUseEvent,
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

enum OnCompleteUseKey {
    Debug = 'debug',
    RunCommand = 'run_command'
}

export const ON_COMPLETE_USE_REGISTRY = new Map([
    [OnCompleteUseKey.Debug, new Debug()],
    [OnCompleteUseKey.RunCommand, new RunCommand()]
]);
