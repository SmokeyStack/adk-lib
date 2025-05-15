type ParameterEffect = {
    effect: string;
    duration: number;
    radius: number;
    amplifier?: number;
    show_particles?: boolean;
    entity_type?: string[];
}[];

type ParameterMelt = {
    melted_state: string;
};

type ParameterBounceForce = {
    force?: number;
};

type ParameterRunCommand = {
    command: string[];
};

type ParameterLiquidPickup = {
    liquid_to_pickup?: string[];
    transform_to: string;
}[];

export {
    ParameterEffect,
    ParameterMelt,
    ParameterBounceForce,
    ParameterRunCommand,
    ParameterLiquidPickup
};
